import React, { useEffect, useState } from 'react';
import { Button, Input, Form, Card, Row, Col, Radio, Anchor, notification, Checkbox } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
const EditQuestion = () => {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    useEffect(() => {
        const storedQuiz = localStorage.getItem('storedQuiz');
        if (storedQuiz) {
            const parsedQuiz = JSON.parse(storedQuiz);
            if (parsedQuiz.questions) {
                setQuestions(parsedQuiz.questions);
            } else {
                notification.error({
                    message: 'Lỗi',
                    description: 'Không tìm thấy câu hỏi trong quiz đã lưu',
                });
            }
        } else {
            notification.error({
                message: 'Lỗi',
                description: 'Không tìm thấy quiz đã lưu trong localStorage',
            });
        }
    }, []);

    const [setCurrentQuestionIndex] = useState(0);

    const saveToLocalStorage = (updatedQuestions) => {
        const storedQuiz = JSON.parse(localStorage.getItem('storedQuiz'));
        storedQuiz.questions = updatedQuestions;
        localStorage.setItem('storedQuiz', JSON.stringify(storedQuiz));
    };

    const addNewQuestion = () => {
        const newQuestion = {
            question: '',
            questionChoice: [
                { id: 1, text: '', isCorrect: false },
                { id: 2, text: '', isCorrect: false },
                { id: 3, text: '', isCorrect: false },
                { id: 4, text: '', isCorrect: false },
            ],
        };
        const updatedQuestions = [...questions, newQuestion];
        setQuestions(updatedQuestions);
        saveToLocalStorage(updatedQuestions);
    };

    const deleteQuestion = (qIndex) => {
        const updatedQuestions = questions.filter((_, index) => index !== qIndex);
        setQuestions(updatedQuestions);
        saveToLocalStorage(updatedQuestions);
    }
    const handleQuestionChange = (qIndex, e) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].question = e.target.value;
        setQuestions(newQuestions);
        saveToLocalStorage(newQuestions);
    };

    const handleOptionChange = (qIndex, optionIndex, e) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].questionChoice[optionIndex].text = e.target.value;
        setQuestions(newQuestions);
        saveToLocalStorage(newQuestions);
    };

    const handleAddOption = (qIndex) => {
        const newQuestions = [...questions];
        const newOption = { id: newQuestions[qIndex].questionChoice.length + 1, text: '', isCorrect: false };
        newQuestions[qIndex].questionChoice.push(newOption);
        setQuestions(newQuestions);
        saveToLocalStorage(newQuestions);
    };

    const handleDeleteOption = (qIndex, optionIndex) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].questionChoice = newQuestions[qIndex].questionChoice.filter((_, i) => i !== optionIndex);
        setQuestions(newQuestions);
        saveToLocalStorage(newQuestions);
    };

    const handleCorrectChange = (qIndex, optionIndex, checked) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].questionChoice[optionIndex].isCorrect = checked;
        setQuestions(newQuestions);
        saveToLocalStorage(newQuestions);
    };
    const handleSubmit = async () => {
        const storedQuiz = JSON.parse(localStorage.getItem('edit')) || {};
        const oldQuiz = JSON.parse(localStorage.getItem('storedQuiz')) || {};
        const currentDate = new Date().toISOString();
        const formattedQuestions = questions.map((question) => {
            return {
                id: question.id,
                question: question.question,
                createdAt: currentDate,
                questionChoice: question.questionChoice.map((option) => {
                    return {
                        id: option.id,
                        text: option.text,
                        isCorrect: option.isCorrect,
                    };
                }),
            };
        });

        const updatedQuiz = {
            id: oldQuiz.id,
            title: storedQuiz.title,
            description: storedQuiz.description,
            categoryId: storedQuiz.category_id,
            questions: formattedQuestions,
            isPublished: storedQuiz.isPublished || false,
        };
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                notification.error({
                    message: 'Lỗi',
                    description: 'Không tìm thấy token, vui lòng đăng nhập lại.',
                });
                return;
            }
            const response = await axios.put(`https://api.trandai03.online/api/v1/quizs/update/${oldQuiz.id}`, updatedQuiz, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 200) {

                notification.success({
                    message: 'Thành công',
                    description: 'Quiz đã được sửa thành công.',
                });
                localStorage.removeItem("edit")
                localStorage.removeItem("storedQuiz")
                navigate('/')
            }
        } catch (error) {
            notification.error({
                message: 'Lỗi khi sửa quiz',
                description: 'Không thể sửa quiz, vui lòng thử lại sau.',
            });
            console.log(error.response);
        }
    };

    const handleAnchorClick = (qIndex) => {
        setCurrentQuestionIndex(qIndex);
    };
    console.log(questions);

    return (
        <div>
            <div style={{ display: 'flex' }}>
                <Col span={2}>
                    <div style={{ height: "400px", overflowY: 'auto', whiteSpace: 'nowrap', paddingBottom: '10px' }}>
                        <Anchor style={{ display: 'block', maxHeight: "100%", overflowY: 'auto' }}
                            replace
                            affix={false}
                            items={questions.map((_, qIndex) => ({
                                key: `part-${qIndex + 1}`,
                                href: `#part-${qIndex + 1}`,
                                title: `Câu ${qIndex + 1}`,
                                onClick: () => handleAnchorClick(qIndex),
                            }))}
                        />
                    </div>
                </Col>
                <Col span={20}>
                    {questions.map((question, qIndex) => (
                        <Card key={qIndex} style={{ marginBottom: '20px' }}>
                            <div id={`part-${qIndex + 1}`}>
                                <Form layout="vertical">
                                    <Form.Item
                                        label={`Câu hỏi ${qIndex + 1}`}
                                        rules={[{ required: true, message: 'Vui lòng nhập câu hỏi' }]}
                                    >
                                        <Input.TextArea
                                            value={question.question}
                                            onChange={(e) => handleQuestionChange(qIndex, e)}
                                            placeholder="Nhập nội dung câu hỏi..."
                                            style={{ height: '100px', fontSize: '16px' }}
                                        />
                                    </Form.Item>

                                    <Form.Item label="Tùy chọn trả lời">
                                        {question.questionChoice.map((option, optionIndex) => (
                                            <Row key={option.id} align="middle" style={{ marginBottom: '10px' }}>
                                                <Col span={18}>
                                                    <Input
                                                        placeholder={`Tùy chọn ${optionIndex + 1}`}
                                                        value={option.text}
                                                        onChange={(e) => handleOptionChange(qIndex, optionIndex, e)}
                                                    />
                                                </Col>
                                                <Col span={2} style={{ marginLeft: "15px" }}>
                                                    <Checkbox
                                                        checked={option.isCorrect}
                                                        onChange={(e) => handleCorrectChange(qIndex, optionIndex, e.target.checked)}
                                                    >
                                                        Đúng
                                                    </Checkbox>
                                                </Col>
                                                <Col span={2}>
                                                    <Button
                                                        style={{ color: "red" }}
                                                        icon={<DeleteOutlined />}
                                                        type="danger"
                                                        onClick={() => handleDeleteOption(qIndex, optionIndex)}
                                                    />
                                                </Col>
                                            </Row>
                                        ))}
                                    </Form.Item>
                                </Form>
                            </div>
                            <div style={{ display: "flex", gap: ".5rem" }}>

                                <Button
                                    type="danger"
                                    icon={<DeleteOutlined />}
                                    onClick={() => deleteQuestion(qIndex)}
                                    style={{ marginTop: '10px', background: '#ff4d4f', color: '#fff' }}
                                >
                                    Xóa câu hỏi
                                </Button>
                                <Button
                                    icon={<PlusOutlined />}
                                    onClick={() => handleAddOption(qIndex)}
                                    style={{
                                        width: '150px', marginTop: '10px',
                                        backgroundImage: 'linear-gradient(90deg, rgb(255, 127, 206) 0%, rgb(252, 149, 110) 100%)',
                                        color: '#fff'
                                    }}
                                >
                                    Thêm đáp án
                                </Button>
                            </div>
                        </Card>
                    ))}
                </Col>
            </div>

            <Button type="dashed" onClick={addNewQuestion} icon={<PlusOutlined />} style={{ width: '100%' }}>
                Thêm câu hỏi
            </Button>

            <Button type="primary" onClick={handleSubmit} style={{ width: '100%', marginTop: '20px' }}>
                Lưu tất cả câu hỏi
            </Button>
        </div>
    );
};

export default EditQuestion;
