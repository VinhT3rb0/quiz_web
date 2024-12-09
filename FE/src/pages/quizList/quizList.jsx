import React, { useEffect, useState } from 'react';
import { List, Card, notification, Popconfirm, Button, Image, message, Typography, Tooltip } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { ClockCircleOutlined, DeleteOutlined, EditOutlined, HeartFilled, HeartOutlined } from '@ant-design/icons';
import axios from 'axios';
import Loading from '../../components/loading/loading';

const { Title } = Typography;

const QuizList = () => {
    const [quizzes, setQuizzes] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [favorquizzes, setFavorQuizzes] = useState([]);
    const [publishedQuizzes, setPublishedQuizzes] = useState([]);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await axios.get('https://api.trandai03.online/api/v1/quizs/user', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': '*/*'
                    }
                });
                if (response.status === 200) {
                    const allQuizzes = response.data;
                    setQuizzes(allQuizzes);
                    const newPublishedQuizzes = allQuizzes.filter((quiz) => quiz.isPublished === true).map((quiz) => quiz.id);
                    setPublishedQuizzes(newPublishedQuizzes);
                }
            } catch (error) {
                notification.error({
                    message: 'Lỗi khi tải danh sách chủ đề',
                    description: 'Không thể tải danh sách chủ đề, vui lòng thử lại sau.',
                });
            }
        };
        fetchQuizzes();
    }, []);

    useEffect(() => {
        const fetchFavorQuizzes = async () => {
            try {
                const response = await axios.get('https://api.trandai03.online/api/v1/users/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': '*/*'
                    }
                });
                if (response.status === 200) {
                    const newFavorQuizzes = response.data.data.favoriteQuizResponse.map((res) => res.quiz.id);
                    const uniqueFavorQuizzes = [...new Set([...favorquizzes, ...newFavorQuizzes])];
                    setFavorQuizzes(uniqueFavorQuizzes);
                }
            } catch (error) {
                notification.error({
                    message: 'Lỗi khi tải danh sách yêu thích',
                    description: 'Không thể tải danh sách yêu thích, vui lòng thử lại sau.',
                });
            }
        };
        fetchFavorQuizzes();
    }, []);

    const handleEditQuiz = (quizId) => {
        navigate(`/edit/editquiz/${quizId}`);
    };

    const handleDeleteQuiz = async (quizId) => {
        try {
            const response = await axios.delete(`https://api.trandai03.online/api/v1/quizs/${quizId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': '*/*'
                }
            });

            if (response.status === 200) {
                notification.success({
                    message: 'Xóa thành công!',
                    description: 'Đề thi đã được xóa.',
                });
                setQuizzes(prevQuizzes => prevQuizzes.filter(quiz => quiz.id !== quizId));
            }
        } catch (error) {
            notification.error({
                message: 'Lỗi khi xóa đề thi',
                description: 'Không thể xóa đề thi, vui lòng thử lại sau.',
            });
        }
    };

    const toggleFavorite = async (quizId) => {
        try {
            if (favorquizzes.includes(quizId)) {
                const res = await axios.delete(`https://api.trandai03.online/api/v1/quizs/unfavorite/${quizId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
                if (res.status === 200) {
                    const updatedFavor = favorquizzes.filter((id) => id !== quizId);
                    setFavorQuizzes(updatedFavor)
                    message.success('Đã bỏ yêu thích!');
                }
            } else {
                const res = await axios.post(`https://api.trandai03.online/api/v1/quizs/favorite/${quizId}`, {}, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
                if (res.status === 200) {
                    setFavorQuizzes([...favorquizzes, quizId])
                    message.success('Thêm vào mục yêu thích thành công!');
                }
            }
        } catch (error) {
            message.error('Lỗi khi cập nhật mục yêu thích, vui lòng thử lại.');
            console.log(error.message);

        }
    };

    const togglePublish = async (quizId) => {
        try {
            const url = publishedQuizzes.includes(quizId)
                ? `https://api.trandai03.online/api/v1/quizs/unpublish/${quizId}`
                : `https://api.trandai03.online/api/v1/quizs/publish/${quizId}`;

            const res = await axios.post(url, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (res.status === 200) {
                if (publishedQuizzes.includes(quizId)) {
                    setPublishedQuizzes(publishedQuizzes.filter((id) => id !== quizId));
                    message.success('Đề thi đã chuyển sang trạng thái không công khai!');
                } else {
                    setPublishedQuizzes([...publishedQuizzes, quizId]);
                    message.success('Đề thi đã công khai thành công!');
                }
            } else {
                console.error(`API trả về mã lỗi: ${res.status}`);
                message.error('Lỗi khi thay đổi trạng thái công khai!');
            }
        } catch (error) {
            message.error('Lỗi khi thay đổi trạng thái public, vui lòng thử lại.');
            console.log(error.message);
        }
    };
    console.log(quizzes);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    };

    if (!quizzes) {
        return <Loading />;
    }

    return (
        <div>
            <Title level={2} style={{ textAlign: 'center', color: '#2A2A2A', marginBottom: '20px' }}> Đề thi của tôi</Title>
            <List
                grid={{ gutter: 16, column: 4 }}
                dataSource={quizzes}
                locale={{ emptyText: <Loading /> }}
                renderItem={quiz => (
                    <List.Item>
                        <Card
                            hoverable
                            actions={[
                                <Tooltip title="Chỉnh sửa">
                                    <Button onClick={() => handleEditQuiz(quiz.id)} icon={<EditOutlined />} />
                                </Tooltip>,
                                <Tooltip title="Xóa">
                                    <Popconfirm
                                        title="Bạn có chắc chắn muốn xóa đề thi này?"
                                        onConfirm={() => handleDeleteQuiz(quiz.id)}
                                        okText="Có"
                                        cancelText="Không"
                                    >
                                        <Button danger icon={<DeleteOutlined />} />
                                    </Popconfirm>
                                </Tooltip>,
                                <Tooltip title={favorquizzes.includes(quiz.id) ? "Bỏ yêu thích" : "Thêm vào yêu thích"}>
                                    <Button
                                        icon={favorquizzes.includes(quiz.id) ? <HeartFilled style={{ color: 'red' }} /> : <HeartOutlined />}
                                        onClick={() => toggleFavorite(quiz.id)}
                                    />
                                </Tooltip>,
                                <Tooltip title={publishedQuizzes.includes(quiz.id) ? "Hủy công khai" : "Công khai"}>
                                    <Button
                                        icon={publishedQuizzes.includes(quiz.id) ? <ClockCircleOutlined style={{ color: 'green' }} /> : <ClockCircleOutlined />}
                                        onClick={() => togglePublish(quiz.id)}
                                    />
                                </Tooltip>
                            ]}
                            style={{
                                width: 280,
                                borderRadius: '10px',
                                overflow: 'hidden',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                transition: 'transform 0.3s',
                                ':hover': { transform: 'scale(1.05)' }
                            }}
                        >
                            <Link to={`/quizdetail/examcontent/${quiz.id}`}>
                                <div style={{ height: 160, overflow: 'hidden', marginBottom: '15px', borderRadius: '8px' }}>
                                    <Image
                                        src={quiz.image}
                                        alt={quiz.title}
                                        preview={false}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            objectPosition: 'center',
                                            borderRadius: '8px'
                                        }}
                                    />
                                </div>
                                <p style={{
                                    fontSize: '18px',
                                    fontWeight: 'bold',
                                    color: '#333',
                                    marginBottom: '10px',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}>
                                    {quiz.title}
                                </p>
                                <p style={{ fontSize: '14px', color: '#888', marginBottom: '5px' }}>
                                    <ClockCircleOutlined style={{ marginRight: '5px' }} />
                                    {formatDate(quiz.createdAt)}
                                </p>
                                <p style={{ fontSize: '14px', color: '#888', marginBottom: '5px' }}>
                                    <strong>Người tạo:</strong> {quiz.usernameCreated}
                                </p>
                                <p style={{ fontSize: '14px', color: '#888', marginBottom: '5px' }}>
                                    <strong>Số câu hỏi:</strong> {quiz.totalQuestions}
                                </p>
                                <p style={{ fontSize: '14px', color: '#888', marginBottom: '5px' }}>
                                    <strong>Môn học:</strong> {quiz?.categoryResponse?.name || "Không có"}
                                </p>
                                <p style={{
                                    fontSize: '14px',
                                    color: '#888',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    marginBottom: '5px'
                                }}>
                                    <strong>Mô tả:</strong> {quiz.description || 'Không có mô tả'}
                                </p>
                            </Link>
                        </Card>
                    </List.Item>
                )}
            />
        </div>
    );
};

export default QuizList;
