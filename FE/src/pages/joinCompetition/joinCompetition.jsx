import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, Typography, Modal, message, Progress, Row, Col } from 'antd';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../../components/loading/loading';
import moment from 'moment';

const { Text } = Typography;

const JoinCompetition = () => {
    const [competitionData, setCompetitionData] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [remainingTime, setRemainingTime] = useState(0);
    const token = localStorage.getItem("token");
    const { code } = useParams();
    const [isSubmited, setSubmited] = useState(false);
    const [isStart, setIsStart] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchCompetitionData = async () => {
            try {
                const response = await axios.get(`https://api.trandai03.online/api/v1/competitions/getByCode/${code}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                setCompetitionData(response.data);
                setSubmited(response.data.submited)
                const startTime = new Date(response.data.startTime).getTime();
                const duration = response.data.time * 1000;
                const endTime = startTime + duration;
                const currentTime = Date.now();
                if (currentTime >= startTime) {
                    setIsStart(true);
                    const initialRemainingTime = Math.floor((endTime - currentTime) / 1000);

                    if (initialRemainingTime > 0) {
                        setRemainingTime(initialRemainingTime);

                        const interval = setInterval(() => {
                            const now = Date.now();
                            const newRemainingTime = Math.floor((endTime - now) / 1000);

                            if (newRemainingTime <= 0) {
                                clearInterval(interval);
                                setRemainingTime(0);
                            } else {
                                setRemainingTime(newRemainingTime);
                            }
                        }, 1000);

                        return () => clearInterval(interval);
                    }
                }
            } catch (error) {
                message.error("Failed to fetch competition data.");
            }
        };

        fetchCompetitionData();
    }, [token, code]);
    const handleJoin = () => {
        if (isSubmited === true) {
            message.error("Bài thi đã được hoàn thành");
            return;
        }
        if (remainingTime <= 0) {
            if (!isStart) {
                message.error("Chưa đến thời gian làm bài");
                return;
            }
            else {
                message.error("Đã hết thời gian làm bài.");
                return;
            }
        }
        // if (!isStart) {
        //     message.error("Chưa đến thời gian làm bài");
        //     return;
        // }
        if (code === competitionData?.code) {
            const endTime = Date.now() + remainingTime * 1000;
            localStorage.setItem('examEndTime', endTime);
            setIsModalVisible(true);
        } else {
            message.error("Incorrect code. Please try again.");
        }
    };
    const handleModalOk = () => {
        const startTime = new Date(competitionData.startTime).getTime();
        const endTime = startTime + competitionData.time * 1000;
        const remainingTime = (endTime - Date.now()) / 1000;
        if (competitionData?.competitionQuizResponses?.length > 0) {
            const randomQuiz = competitionData.competitionQuizResponses[Math.floor(Math.random() * competitionData.competitionQuizResponses.length)];
            navigate(`/examcompetition/${randomQuiz?.quizResponses.id}`, {
                state: {
                    quizData: randomQuiz.quizResponses,
                    remainingTime: remainingTime,
                    idCompetition: competitionData.id
                }
            });
        } else {
            message.error("Không có đề thi nào khả dụng.");
        }
        setIsModalVisible(false);
    };
    if (!competitionData) {
        return <Loading />;
    }
    const timeInMinutes = competitionData.time / 60;
    return (
        <Row>

            <Col span={5}>
                <Card bordered={false}>
                    <p>Thời gian còn lại: </p>
                    {remainingTime > 0 && (
                        <>
                            <Form.Item label="Remaining Time">
                                <Progress
                                    percent={(remainingTime / competitionData.time) * 100}
                                    format={() => `${Math.floor(remainingTime / 60)}:${remainingTime % 60}`}
                                    status="active"
                                />
                            </Form.Item>
                            <Text style={{ display: 'block', textAlign: 'center', fontSize: '16px' }}>
                                Time Left: {Math.floor(remainingTime / 60)}:{remainingTime % 60 < 10 ? '0' : ''}{remainingTime % 60} minutes
                            </Text>
                        </>
                    )}
                </Card>
            </Col>
            <Col span={16}>
                <Card style={{ margin: '0 30px', padding: '20px', borderRadius: '8px' }}>
                    <Form layout="vertical" onFinish={handleJoin}>
                        <Form.Item label="Tên cuộc thi">
                            <Input value={competitionData.name} disabled />
                        </Form.Item>
                        <Form.Item label="Tạo bởi">
                            <Input value={competitionData.organizedBy} disabled />
                        </Form.Item>
                        <Form.Item label="Mô tả">
                            <Input.TextArea value={competitionData.description} rows={3} disabled />
                        </Form.Item>
                        <Form.Item label="Thời gian bắt đầu">
                            <Input value={moment(competitionData.startTime).format('DD/MM/YYYY HH:mm:ss')} disabled />
                        </Form.Item>
                        <Form.Item label="Thời gian làm bài">
                            <Input value={`${timeInMinutes} phút`} disabled />
                        </Form.Item>

                        {isStart && remainingTime > 0 ? (
                            <>
                                <Form.Item label="Remaining Time">
                                    <Progress
                                        percent={(remainingTime / competitionData.time) * 100}
                                        format={() => `${Math.floor(remainingTime / 60)}:${remainingTime % 60}`}
                                        status="active"
                                    />
                                </Form.Item>
                                <Text style={{ display: 'block', textAlign: 'center', fontSize: '16px' }}>
                                    Time Left: {Math.floor(remainingTime / 60)}:{remainingTime % 60 < 10 ? '0' : ''}{remainingTime % 60} minutes
                                </Text>
                            </>
                        ) : (null)}

                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Bắt đầu làm bài
                            </Button>
                        </Form.Item>
                    </Form>

                    <Modal
                        title="Bắt đầu làm bài?"
                        visible={isModalVisible}
                        onOk={handleModalOk}
                        onCancel={() => setIsModalVisible(false)}>
                    </Modal>
                </Card>
            </Col>

        </Row>
    );
};

export default JoinCompetition;
