import React, { useEffect, useState } from 'react';
import { Table, Button, Tag, message, Typography } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);
const { Title } = Typography;

const ReportCompetition = () => {
    const { competitionId } = useParams();
    const [results, setResults] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await axios.get(`https://api.trandai03.online/api/v1/result/competition/${competitionId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                setResults(response.data);
            } catch (error) {
                message.error("Không thể tải kết quả cuộc thi. Vui lòng thử lại sau.");
            }
        };
        fetchResults();
    }, [competitionId, token]);

    const handleViewDetails = (resultId) => {
        navigate(`/resultdetail/${resultId}`);
    };

    const classifyScore = (score) => {
        if (score >= 8) return <Tag color="green">Giỏi</Tag>;
        if (score >= 5) return <Tag color="blue">Khá</Tag>;
        return <Tag color="red">Yếu</Tag>;
    };

    const columns = [
        {
            title: 'Tên người dùng',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Mã đề',
            dataIndex: 'quizTitle',
            key: 'quizTitle',
        },
        {
            title: 'Điểm',
            dataIndex: 'score',
            key: 'score',
        },
        {
            title: 'Số câu đúng / Tổng số câu',
            key: 'totalCorrect',
            render: (_, record) => `${record.totalCorrect} / ${record.resultQuestionResponses.length}`,
        },
        {
            title: 'Xếp loại',
            key: 'classification',
            render: (_, record) => classifyScore(record.score),
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Button type="link" onClick={() => handleViewDetails(record.id)}>
                    Xem chi tiết
                </Button>
            ),
        },
    ];

    // Phân loại điểm số thành các khoảng [0-1), [1-2), ..., [9-10]
    const scores = results.map(result => result.score);
    const scoreRanges = Array(10).fill(0);

    scores.forEach(score => {
        const index = Math.min(Math.floor(score), 9); // Xác định khoảng điểm
        scoreRanges[index]++;
    });

    const chartData = {
        labels: ['[0-1)', '[1-2)', '[2-3)', '[3-4)', '[4-5)', '[5-6)', '[6-7)', '[7-8)', '[8-9)', '[9-10]'],
        datasets: [
            {
                label: 'Số lượng thí sinh',
                data: scoreRanges,
                backgroundColor: '#1890ff'
            },
        ],
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Kết quả cuộc thi</h2>
            <Table
                columns={columns}
                dataSource={results}
                rowKey={(record) => record.id}
                pagination={{ pageSize: 5 }}
            />
            <div style={{ marginTop: '20px' }}>
                <Title level={2} style={{ textAlign: 'center', color: '#2A2A2A', marginBottom: '20px' }}> Thống kê điểm số</Title>

                <Bar
                    data={chartData}
                    width={1000}
                    height={500}
                    options={{
                        responsive: false,
                        maintainAspectRatio: false,
                        plugins: { legend: { position: 'top' } },
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    stepSize: 1 // Hiển thị từng bước là 1 trên trục y
                                }
                            }
                        }
                    }}
                />
            </div>
        </div>
    );
};

export default ReportCompetition;