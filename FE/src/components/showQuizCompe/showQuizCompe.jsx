import React, { useEffect, useState } from 'react';
import { Card, List, Tag, Typography, Button, Row, Col, Space, Divider } from 'antd';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import { PlusOutlined } from "@ant-design/icons";
import Loading from '../loading/loading';

const { Title, Text } = Typography;

const ShowQuizCompe = () => {
    const [competition, setCompetition] = useState(null);
    const { competitionId } = useParams();
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCompetition = async () => {
            try {
                const response = await axios.get(`https://api.trandai03.online/api/v1/competitions/getById/${competitionId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (response.status === 200) {
                    setCompetition(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch competition data", error);
            }
        };
        fetchCompetition();
    }, [competitionId, token]);

    if (!competition) return <Loading />;

    return (
        <div style={{ padding: '20px' }}>
            <Card
                style={{ marginBottom: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', padding: '20px' }}
                bordered={false}
            >
                <Title style={{ textAlign: "center", color: '#1890ff' }} level={3}>{competition.name}</Title>
                <Divider />
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <Row gutter={[0, 12]}>
                        <Col span={8}><Text strong>Mã Tham Gia:</Text></Col>
                        <Col span={16}><Tag color="blue">{competition.code}</Tag></Col>

                        <Col span={8}><Text strong>Người Tổ Chức:</Text></Col>
                        <Col span={16}><Text>{competition.organizedBy}</Text></Col>

                        <Col span={8}><Text strong>Mô Tả:</Text></Col>
                        <Col span={16}><Text>{competition.description}</Text></Col>

                        <Col span={8}><Text strong>Thời Gian Làm Bài:</Text></Col>
                        <Col span={16}><Text>{competition.time / 60} phút</Text></Col>

                        <Col span={8}><Text strong>Bắt Đầu Vào Lúc:</Text></Col>
                        <Col span={16}><Text>{moment(competition.startTime).format('DD/MM/YYYY HH:mm:ss')}</Text></Col>
                    </Row>

                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => navigate(`/update/updatecompetition/${competitionId}`)}
                        style={{ alignSelf: 'center' }}
                    >
                        Chỉnh sửa
                    </Button>
                </Space>
            </Card>

            <Title level={4} style={{ marginTop: '20px', color: '#595959' }}>Danh Sách Đề Thi</Title>
            <List
                grid={{ gutter: 16, column: 2 }}
                dataSource={competition.competitionQuizResponses}
                renderItem={(quizItem) => (
                    <List.Item key={quizItem.id}>
                        <Card
                            title={<Text style={{ color: "#fff" }}>{quizItem.quizResponses.title}</Text>}
                            style={{ backgroundColor: '#fafafa', borderRadius: '8px' }}
                            actions={[
                                <Button onClick={() => navigate(`/edit/editquiz/${quizItem?.quizResponses?.id}`)} type="primary">
                                    Xem Chi Tiết
                                </Button>
                            ]}
                        >
                            <Space direction="vertical" size="small">
                                <Text strong>Mô Tả:</Text><Text>{quizItem.quizResponses.description}</Text>
                                <Text strong>Người Tạo:</Text><Text>{quizItem.quizResponses.usernameCreated}</Text>
                                <Text strong>Ngày Tạo:</Text><Text>{moment(quizItem.quizResponses.createdAt).format('DD/MM/YYYY')}</Text>
                                <Text strong>Số Câu Hỏi:</Text><Text>{quizItem.quizResponses.totalQuestions}</Text>
                            </Space>
                        </Card>
                    </List.Item>
                )}
            />
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => navigate(`/createcompetition/createquizcompetition/${competitionId}`)}
                style={{ marginTop: '20px' }}
                block
            >
                Thêm Đề Thi
            </Button>
        </div>
    );
}

export default ShowQuizCompe;
