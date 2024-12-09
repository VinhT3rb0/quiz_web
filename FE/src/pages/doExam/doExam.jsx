import React, { useEffect, useState, useRef } from 'react';
import { Card, Checkbox, Button, Menu, Col, Row, message, Modal, Image, notification } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Loading from '../../components/loading/loading';
import { CheckCircleOutlined, CheckCircleFilled } from '@ant-design/icons';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './doExam.css'
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const QuizExam = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [idResult, setIdResult] = useState(null);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [remainingTime, setRemainingTime] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpen2, setIsModalOpen2] = useState(false);
    const [scoreExam, setScoreExam] = useState(0);
    const [storedQuiz, setQuiz] = useState(null);
    const [submittedTime, setSubmittedTime] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [answeredQuestions, setAnsweredQuestions] = useState([]);
    const selectedTime = JSON.parse(localStorage.getItem('Time')) || '30 phút';
    const timeInMinutes = parseInt(selectedTime.split(" ")[0], 10);
    let timeInSeconds = timeInMinutes * 60;
    const handleSubmit = async () => {
        const token = localStorage.getItem('token');
        let score = 0;
        let numberOfCorrect = 0;
        const remaintimeInMinutes = Math.floor(timeInMinutes - (remainingTime / 60));
        const timeInSeconds = (60 - remainingTime % 60);
        const calculatedTime = remaintimeInMinutes < 1
            ? `0 phút ${timeInSeconds} giây`
            : `${remaintimeInMinutes} phút ${timeInSeconds} giây`;
        const timeSubmit = remaintimeInMinutes * 60 + timeInSeconds;
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
            quizId: storedQuiz.id,
            questionResultDTOS: resultDetails,
            score,
            totalCorrect: numberOfCorrect,
            submittedTime: timeSubmit,
        };
        try {
            const response = await axios.post('https://api.trandai03.online/api/v1/quizs/submit', quizResult, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            if (response.status === 200) {
                notification.success({
                    message: "Nộp bài thành công",
                    description: "Bài thi đã được nộp thành công!"
                });
                setIdResult(response.data.id);
                localStorage.removeItem("Time");
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
    useEffect(() => {
        setRemainingTime(timeInSeconds);
        const interval = setInterval(() => {
            setRemainingTime((prevTime) => {
                if (prevTime > 0) {
                    return prevTime - 1;
                } else {
                    clearInterval(interval);
                    message.info('Hết thời gian!');
                    return 0;
                }
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [timeInSeconds]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    useEffect(() => {
        const fetchQuizData = async () => {
            try {
                const response = await axios.get(`https://api.trandai03.online/api/v1/quizs/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    }
                });
                if (response.status === 200) {
                    const quizData = response.data;
                    quizData.questions = shuffleArray(quizData.questions);
                    quizData.questions.forEach((question) => {
                        question.questionChoice = shuffleArray(question.questionChoice);
                    });
                    setQuestions(quizData.questions);
                    setQuiz(quizData);
                }
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu quiz:", error);
            }
        };

        fetchQuizData();
    }, []);
    if (!questions || questions.length === 0) {
        return <Loading />;
    }

    const handleAnswerChange = (questionId, selectedChoices) => {
        setSelectedAnswers((prevAnswers) => {
            const newAnswers = { ...prevAnswers, [questionId]: selectedChoices };

            if (selectedChoices.length > 0) {
                setAnsweredQuestions((prevAnswered) => [...new Set([...prevAnswered, questionId])]);
            } else {
                setAnsweredQuestions((prevAnswered) => prevAnswered.filter(id => id !== questionId));
            }
            console.log(newAnswers);

            return newAnswers;
        });
    };





    const scrollToQuestion = (index) => {
        const element = document.getElementById(`question-${index}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="quiz-exam mt-5" style={{
            maxWidth: "100%", position: "relative",
            margin: "20px auto", zIndex: "999", padding: "20px",
            backgroundColor: "#f9f9f9", borderRadius: "10px",
        }}>
            <Row style={{ display: "flex", justifyContent: "space-around" }}>
                <Col span={5}>
                    <CSSTransition in={true} appear={true} timeout={500} classNames="slide">
                        <Card title={storedQuiz?.title} bordered={false} style={{ width: 300, boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", borderRadius: "8px" }}>
                            <p>Chế độ: {storedQuiz?.level}</p>
                            <p>Thời gian còn lại: </p>
                            <p style={{ fontSize: "18px", fontWeight: "bold", color: "#3E65FE" }}>{formatTime(remainingTime)}</p>
                            <Button type="primary" onClick={() => setIsModalOpen(true)}>
                                Nộp bài thi
                            </Button>
                            <Modal title="Bạn có chắc chắn muốn nộp bài thi?" open={isModalOpen} onOk={handleSubmit} onCancel={() => setIsModalOpen(false)} />
                            <Modal
                                style={{ textAlign: "center" }}
                                title="Hoàn thành"
                                open={isModalOpen2}
                                onCancel={() => { navigate(`/quizdetail/examcontent/${storedQuiz.id}`); }}
                                onOk={() => navigate(`/result/${idResult}`)}
                                okText="Xem kết quả"
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
                    </CSSTransition>

                </Col>

                <Col span={13}>
                    <TransitionGroup>
                        {questions.map((question, index) => (
                            <CSSTransition key={index} timeout={500} classNames="slide">

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
                                </Card>
                            </CSSTransition>

                        ))}
                    </TransitionGroup>

                </Col>

                <Col span={4} style={{ maxHeight: "500px", overflowY: "auto" }}>
                    <Menu mode="inline" style={{ height: "100%", overflowY: "auto", boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", borderRadius: "8px" }}>
                        <TransitionGroup component={null}>
                            {questions.map((question, index) => (
                                <CSSTransition key={question.id} timeout={300} classNames="slide">
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
                                </CSSTransition>
                            ))}
                        </TransitionGroup>
                    </Menu>
                </Col>
            </Row>
        </div>
    );
};

export default QuizExam;
