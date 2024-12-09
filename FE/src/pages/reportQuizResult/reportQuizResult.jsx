import React, { useEffect, useState } from 'react';
import { Tabs, Table, Tag, Button } from 'antd';
import { BarChartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Loading from '../../components/loading/loading';
import axios from 'axios';

const ReportQuizResult = () => {
    const [resultThiThu, setResultThiThu] = useState(null);
    const [resultCompetition, setResultCompetition] = useState(null);
    const [currentTab, setCurrentTab] = useState("1");
    const [tableData, setTableData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchThiThuData = async () => {
            try {
                const response = await axios.get('https://api.trandai03.online/api/v1/result/user', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                        'Accept': '*/*'
                    }
                });
                if (response.status === 200) {
                    setResultThiThu(response.data);
                }
            } catch (error) {
                console.error('Error fetching Thi Thu result:', error);
            }
        };

        const fetchCompetitionData = async () => {
            try {
                const response = await axios.get('https://api.trandai03.online/api/v1/result/competition/user', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                        'Accept': '*/*'
                    }
                });
                if (response.status === 200) {
                    setResultCompetition(response.data);
                }
            } catch (error) {
                console.error('Error fetching Competition result:', error);
            }
        };

        fetchThiThuData();
        fetchCompetitionData();
    }, []);

    useEffect(() => {
        if (currentTab === "1" && resultThiThu) {
            setTableData(resultThiThu.map((res) => ({
                idResult: res.id,
                quizTitle: res.quizTitle,
                score: res.score,
                rating: res.score >= 8 ? "Giỏi" : res.score >= 5 ? "Trung bình" : "Yếu",
                correctAnswers: res.totalCorrect || 0,
                incorrectAnswers: res.resultQuestionResponses.length - res.totalCorrect || 0,
                totalQuestions: res.resultQuestionResponses.length,
                completedTime: res.submittedTime,
                finishTime: new Date(res.completedAt).toLocaleString(),
            })));
        } else if (currentTab === "2" && resultCompetition) {
            setTableData(resultCompetition.map((res) => {
                const timeStart = new Date(res.competitionResponse.startTime).getTime();
                const duration = res.competitionResponse.time * 1000;
                const timeEnd = timeStart + duration;
                const checked = Date.now() - timeEnd;

                const submitedTimeMinutes = Math.floor(res.submittedTime / 60);
                const submitedTimeSeconds = res.submittedTime % 60;
                const calculatedTime = submitedTimeMinutes < 1
                    ? `${submitedTimeSeconds} giây`
                    : `${submitedTimeMinutes} phút ${submitedTimeSeconds} giây`;
                if (checked >= 0) {
                    return {
                        idResult: res.id,
                        quizTitle: res.quizTitle,
                        score: res.score,
                        rating: res.score >= 8 ? "Giỏi" : res.score >= 5 ? "Trung bình" : "Yếu",
                        correctAnswers: res.totalCorrect || 0,
                        incorrectAnswers: res.resultQuestionResponses.length - res.totalCorrect || 0,
                        totalQuestions: res.resultQuestionResponses.length,
                        completedTime: calculatedTime,
                        finishTime: new Date(res.completedAt).toLocaleString(),
                    };
                }
                return null;
            }).filter(item => item !== null));
        }
    }, [currentTab, resultThiThu, resultCompetition]);

    if (!resultThiThu || !resultCompetition) {
        return <Loading />;
    }

    const handleTabChange = (key) => {
        setCurrentTab(key);
    };

    const columns = [
        {
            title: 'Đề thi',
            dataIndex: 'quizTitle',
            key: 'quizTitle',
        },
        {
            title: 'Điểm số',
            dataIndex: 'score',
            key: 'score',
        },
        {
            title: 'Xếp loại',
            dataIndex: 'rating',
            key: 'rating',
            render: rating => <Tag color={rating === "Giỏi" ? "green" : rating === "Trung bình" ? "yellow" : "red"}>{rating}</Tag>
        },
        {
            title: 'Số câu đúng',
            dataIndex: 'correctAnswers',
            key: 'correctAnswers',
        },
        {
            title: 'Số câu sai',
            dataIndex: 'incorrectAnswers',
            key: 'incorrectAnswers',
        },
        {
            title: 'Tổng số câu',
            dataIndex: 'totalQuestions',
            key: 'totalQuestions',
        },
        {
            title: 'Thời gian hoàn thành',
            dataIndex: 'completedTime',
            key: 'completedTime',
        },
        {
            title: 'Thời gian kết thúc bài thi',
            dataIndex: 'finishTime',
            key: 'finishTime',
        },
        {
            title: 'Hành động',
            dataIndex: 'idResult',
            key: 'action',
            render: (idResult) => (
                <Button type="link" onClick={() => navigate(`/result/${idResult}`)}>
                    Xem chi tiết
                </Button>
            ),
        }
    ];

    return (
        <div style={{ padding: '20px' }}>
            <h3 style={{ textAlign: 'left' }}>
                <BarChartOutlined style={{ color: "blue" }} /> Kết quả thi
            </h3>
            <Tabs defaultActiveKey="1" onChange={handleTabChange}>
                <Tabs.TabPane tab="Thi thử" key="1">
                    <Table columns={columns} dataSource={tableData} rowKey="idResult" />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Cuộc thi" key="2">
                    <Table columns={columns} dataSource={tableData} rowKey="idResult" />
                </Tabs.TabPane>
            </Tabs>
        </div>
    );
};

export default ReportQuizResult;
