import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, message } from 'antd';
import Loading from '../../components/loading/loading';
import './favoriteQuizzes.css';
import { ClockCircleOutlined, HeartFilled } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title } = Typography;

const FavoriteQuizzes = () => {
    const [favoriteQuizzes, setFavoriteQuizzes] = useState([]);

    useEffect(() => {
        const fetchFavoriteQuizzes = async () => {
            try {
                const response = await axios.get('https://api.trandai03.online/api/v1/quizs/favorite/user', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem("token")}`,
                        'Content-Type': 'application/json',
                        'Accept': '*/*',
                    },
                });
                if (response.status === 200) {
                    setFavoriteQuizzes(response.data);
                }
            } catch (error) {
                message.error('Lỗi khi lấy danh sách yêu thích');
                console.error('Lỗi khi lấy danh sách yêu thích:', error);
            }
        };

        fetchFavoriteQuizzes();
    }, []);

    if (!favoriteQuizzes) {
        return <Loading />;
    }
    console.log(favoriteQuizzes);

    return (
        <div style={{ width: "100%" }}>
            <Title level={2} style={{ textAlign: 'center', color: '#000' }}><HeartFilled style={{ color: 'red' }} /> Danh sách đề thi yêu thích</Title>
            <div className="card-grid" >
                {favoriteQuizzes.map((quiz) => (
                    <Link style={{ color: "#fff" }} to={`/quizdetail/examcontent/${quiz.id}`}>
                        <div className="card" key={quiz.id}>
                            <img
                                src="https://images.unsplash.com/photo-1656618020911-1c7a937175fd?crop=entropy&cs=tinysrgb&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NTc1MzQyNTE&ixlib=rb-1.2.1&q=80"
                                alt="Quiz Banner"
                            />
                            <div className="card-content">
                                <h2>{quiz.title}</h2>
                                <p>{quiz.description || 'Không có mô tả'}</p>
                                <p>Người tạo: {quiz.usernameCreated}</p>
                                <p><ClockCircleOutlined /> {quiz.createdAt}</p>
                                <p>Câu hỏi: {quiz.totalQuestions}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default FavoriteQuizzes;
