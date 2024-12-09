import React, { useEffect, useState } from 'react';
import { List, Card, Button, Typography, message, Tag, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { EyeOutlined, DeleteOutlined, UnorderedListOutlined } from '@ant-design/icons';
import Loading from '../../components/loading/loading';
import './userCompetitions.css';

const { Title, Text } = Typography;

const UserCompetitions = () => {
    const [competitions, setCompetitions] = useState([]);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCompetitionId, setSelectedCompetitionId] = useState(null);

    useEffect(() => {
        const fetchCompetitions = async () => {
            try {
                const response = await axios.get('https://api.trandai03.online/api/v1/competitions/user', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (response.status === 200) {
                    setCompetitions(response.data);
                }
            } catch (error) {
                message.error("Không thể tải danh sách cuộc thi. Vui lòng thử lại sau.");
            }
        };
        fetchCompetitions();
    }, [token]);

    const handleDeleteCompetition = async () => {
        try {
            await axios.delete(`https://api.trandai03.online/api/v1/competitions/delete/${selectedCompetitionId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setCompetitions(competitions.filter(competition => competition.id !== selectedCompetitionId));
            message.success("Xóa cuộc thi thành công.");
            setIsModalOpen(false);
        } catch (error) {
            message.error("Không thể xóa cuộc thi. Vui lòng thử lại sau.");
        }
    };

    const showDeleteConfirm = (competitionId) => {
        setSelectedCompetitionId(competitionId);
        setIsModalOpen(true);
    };

    return (
        <div className="user-competitions-container">
            <Title level={3} className="user-competitions-title">Các Cuộc Thi của Bạn</Title>
            <List
                locale={{ emptyText: <Loading /> }}
                grid={{ gutter: 16, column: 3 }}
                dataSource={competitions}
                renderItem={competition => (
                    <List.Item>
                        <Card
                            className="competition-card"
                            title={<Text className="competition-title">{competition.name}</Text>}
                            extra={<Tag color="blue">Mã: {competition.code}</Tag>}
                            actions={[
                                <Button
                                    type="link"
                                    icon={<EyeOutlined />}
                                    onClick={() => navigate(`/createcompetition/showquizcompe/${competition.id}`)}
                                    className="view-details-button"
                                >
                                    Chi Tiết
                                </Button>,
                                <Button
                                    icon={<UnorderedListOutlined />}
                                    onClick={() => navigate(`/reportcompetition/${competition.id}`)}
                                    className="view-results-button"
                                >
                                    Xem kết quả
                                </Button>,
                                <Button
                                    danger
                                    icon={<DeleteOutlined />}
                                    onClick={() => showDeleteConfirm(competition.id)}
                                    className="delete-button"
                                >
                                    Xóa
                                </Button>
                            ]}
                        >
                            <p><Text strong>Người tạo:</Text> {competition.organizedBy}</p>
                            <p><Text strong>Thời gian bắt đầu:</Text> {new Date(competition.startTime).toLocaleString()}</p>
                            <p><Text strong>Mô tả:</Text> {competition.description || "Không có mô tả"}</p>
                        </Card>
                    </List.Item>
                )}
            />
            <Modal
                title="Bạn có chắc chắn muốn xóa cuộc thi?"
                open={isModalOpen}
                onOk={handleDeleteCompetition}
                onCancel={() => setIsModalOpen(false)}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
                className="delete-modal"
            />
        </div>
    );
};

export default UserCompetitions;
