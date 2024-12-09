import React, { useEffect, useRef, useState } from 'react';
import { Card, Checkbox, Button, Menu, Col, Row, message, Modal, Image, notification } from 'antd';
import { CheckCircleOutlined, CheckCircleFilled } from '@ant-design/icons';
import { replace, useLocation, useNavigate } from 'react-router-dom';
import Loading from '../../components/loading/loading';
import axios from 'axios';

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};


const ExamCompetition = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [answeredQuestions, setAnsweredQuestions] = useState([]);
    const { quizData, remainingTime: initialRemainingTime, idCompetition } = location.state || {};
    const calculateRemainingTime = () => {
        const examEndTime = localStorage.getItem('examEndTime');
        if (examEndTime) {
            const timeRemaining = Math.floor((examEndTime - Date.now()) / 1000);
            return timeRemaining > 0 ? timeRemaining : 0;
        }
        return initialRemainingTime || 0;
    };
    const [selectedAnswers, setSelectedAnswers] = useState(() => {
        const savedAnswers = localStorage.getItem('selectedAnswers');
        return savedAnswers ? JSON.parse(savedAnswers) : {};
    });
    const [remainingTime, setRemainingTime] = useState(calculateRemainingTime || 0);
    const remainingTimeRef = useRef(remainingTime);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpen2, setIsModalOpen2] = useState(false);
    const [scoreExam, setScoreExam] = useState(0);
    const [submittedTime, setSubmittedTime] = useState(null);
    const [questions, setQuestions] = useState(quizData?.questions || []);

    const [tabChangeCount, setTabChangeCount] = useState(() => {
        return parseInt(localStorage.getItem("tabChangeCount")) || 0;
    });


    const [isModalVisible, setIsModalVisible] = useState(false);
    useEffect(() => {
        if (quizData) {
            const shuffledQuestions = shuffleArray(quizData.questions);
            shuffledQuestions.forEach((question) => {
                question.questionChoice = shuffleArray(question.questionChoice);
            });
            setQuestions(shuffledQuestions);
        }
    }, [quizData]);

    const handleVisibilityChange = () => {
        if (document.hidden) {
            setTabChangeCount((prevCount) => prevCount + 1);
        }
    };

    useEffect(() => {
        document.addEventListener("visibilitychange", handleVisibilityChange);
        console.log("đã đi vào");
        
    }, []);

    useEffect(() => {
        localStorage.setItem("tabChangeCount", tabChangeCount);
        if (tabChangeCount === 1) {
            setIsModalVisible(true);
        } else if (tabChangeCount >= 2) {
            handleSubmit();
        }
    }, [tabChangeCount]);

    useEffect(() => {
        remainingTimeRef.current = remainingTime;
    }, [remainingTime]);

    useEffect(() => {
        const examEndTime = localStorage.getItem('examEndTime');
        if (examEndTime) {
            const timeRemaining = Math.floor((examEndTime - Date.now()) / 1000);
            setRemainingTime(timeRemaining > 0 ? timeRemaining : 0);
        }
        const interval = setInterval(() => {
            if (remainingTimeRef.current > 0) {
                setRemainingTime((prevTime) => prevTime - 1);
            } else {
                clearInterval(interval);
                message.info('Hết thời gian!');
                handleSubmit();
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    const handleAnswerChange = (questionId, selectedChoices) => {
        setSelectedAnswers((prevAnswers) => {
            const newAnswers = { ...prevAnswers, [questionId]: selectedChoices };

            if (selectedChoices.length > 0) {
                setAnsweredQuestions((prevAnswered) => [...new Set([...prevAnswered, questionId])]);
            } else {
                setAnsweredQuestions((prevAnswered) => prevAnswered.filter(id => id !== questionId));
            }


            return newAnswers;
        });
    };


    const handleSubmit = async () => {
        let score = 0;
        let numberOfCorrect = 0;
        const remaintimeInMinutes = Math.floor(initialRemainingTime / 60 - (remainingTime / 60));
        const timeInSeconds = ((initialRemainingTime - remainingTime) % 60);
        const calculatedTime = remaintimeInMinutes < 1
            ? `0 phút ${Math.floor(timeInSeconds)} giây`
            : `${remaintimeInMinutes} phút ${Math.floor(timeInSeconds)} giây`;

        const timeSubmit = Math.floor(remaintimeInMinutes * 60 + timeInSeconds);
        setSubmittedTime(calculatedTime);
        const resultDetails = questions.map((question) => {
            const selectedChoices = selectedAnswers[question.id] || [];
            const correctChoices = question.questionChoice.filter(opt => opt.isCorrect).map(opt => opt.id);
            const isCorrect = selectedChoices.sort().toString() === correctChoices.sort().toString();

            if (isCorrect) {
                numberOfCorrect++;
            }
            score = (numberOfCorrect / questions.length * 10).toFixed(2);
            return {
                questionId: question.id,
                selectedChoiceIds: selectedChoices,
            };
        });

        setScoreExam(numberOfCorrect);
        setIsModalOpen(false);
        setIsModalOpen2(true);

        const quizResult = {
            quizId: quizData.id,
            questionResultDTOS: resultDetails,
            score,
            totalCorrect: numberOfCorrect,
            submittedTime: timeSubmit,
            competitionId: idCompetition
        };
        try {
            const response = await axios.post('https://api.trandai03.online/api/v1/quizs/submit', quizResult, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                }
            });
            if (response.status === 200) {
                notification.success({
                    message: "Nộp bài thành công",
                    description: "Bài thi đã được nộp thành công!"
                });
                localStorage.removeItem("selectedAnswers");
                localStorage.removeItem("tabChangeCount");
                setIsModalOpen(false);
                setIsModalOpen2(true);
            }
        } catch (error) {
            console.error("Lỗi submit:", error.response);
            notification.error({
                message: "Nộp bài không thành công",
                description: "Có lỗi xảy ra khi nộp bài, vui lòng thử lại."
            });
        }
    };

    const scrollToQuestion = (index) => {
        const element = document.getElementById(`question-${index}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    if (!questions || questions.length === 0) {
        return <Loading />;
    }

    return (
        <div className="quiz-exam mt-5" style={{
            maxWidth: "100%", position: "relative",
            margin: "20px auto", zIndex: "999", padding: "20px",
            backgroundColor: "#f9f9f9", borderRadius: "10px",
        }}>

            {console.log("selectedAnswers", selectedAnswers[478])}
            <Row style={{ display: "flex", justifyContent: "space-around" }}>
                <Col span={5}>
                    <Card title={quizData?.title} bordered={false} style={{ width: 300, boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", borderRadius: "8px" }}>
                        <p>Chế độ: Cuộc thi</p>
                        <p>Thời gian còn lại: </p>
                        <p style={{ fontSize: "18px", fontWeight: "bold", color: "#3E65FE" }}>{formatTime(Math.floor(remainingTime))}</p>
                        <Button type="primary" onClick={() => setIsModalOpen(true)}>
                            Nộp bài thi
                        </Button>
                        <Modal title="Bạn có chắc chắn muốn nộp bài thi?" open={isModalOpen} onOk={handleSubmit} onCancel={() => setIsModalOpen(false)} />
                        <Modal
                            style={{ textAlign: "center" }}
                            title="Hoàn thành"
                            open={isModalOpen2}
                            onCancel={() => { navigate('/', { replace: true }); }}
                            onOk={() => { navigate(`/`, { replace: true }) }}
                            cancelText="Trở về"
                        >
                            <div style={{ maxWidth: "300px", marginLeft: "auto", marginRight: "auto" }}>
                                <Image src='https://studio.eduquiz.vn/assets/images/exam/img_hoanthanh@2x.png' preview={false} />
                            </div>
                            <p>Bạn đã hoàn thành bài thi</p>
                            <h3>{(scoreExam * (10 / questions.length)).toFixed(2)} điểm</h3>
                            <div>
                                <p>Số câu đúng: {scoreExam}/{questions.length}</p>
                                <p>Thời gian: {submittedTime}</p>
                            </div>
                        </Modal>
                    </Card>
                    <p style={{
                        fontStyle: "italic",
                        color: "red"
                    }}>Lưu ý: Luôn giữ tab trong suốt quá trình làm bài (vi phạm sẽ 0 điểm)</p>
                </Col>

                <Col span={13}>
                    {questions.map((question, index) => (
                        <Card
                            style={{
                                marginBottom: "20px",
                                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                                borderRadius: "8px",
                            }}
                            className="mb-4"
                            key={index}
                            id={`question-${index}`}
                            title={`Câu hỏi ${index + 1}`}
                        >
                            <h4>{question.question}</h4>
                            <Checkbox.Group style={{ display: "flex", flexDirection: "column" }}
                                onChange={(values) => handleAnswerChange(question.id, values)}
                                value={selectedAnswers[question.id] || []}
                            >
                                {question.questionChoice.map((option, idx) => (
                                    <Checkbox style={{ fontSize: "25px" }} key={option.id} value={option.id}>
                                        {option.text}
                                    </Checkbox>
                                ))}
                            </Checkbox.Group>
                            <Modal
                                title="Cảnh báo"
                                visible={isModalVisible}
                                onOk={() => setIsModalVisible(false)}
                                onCancel={() => setIsModalVisible(false)}
                            >
                                <p>Bạn vừa chuyển tab. Nếu tiếp tục, bài thi sẽ được nộp tự động.</p>
                            </Modal>
                        </Card>
                    ))}
                </Col>

                <Col span={4} style={{ maxHeight: "500px", overflowY: "auto" }}>
                    <Menu mode="inline" style={{ height: "100%", overflowY: "auto", boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", borderRadius: "8px" }}>
                        {questions.map((question, index) => (
                            <Menu.Item
                                key={question.id}
                                onClick={() => scrollToQuestion(index)}
                                icon={
                                    answeredQuestions.includes(question.id) ? (
                                        <CheckCircleFilled style={{ color: "green" }} />
                                    ) : (
                                        <CheckCircleOutlined />
                                    )
                                }
                            >
                                Câu {index + 1}
                            </Menu.Item>
                        ))}
                    </Menu>
                </Col>
            </Row>
        </div>
    );
};

export default ExamCompetition;
