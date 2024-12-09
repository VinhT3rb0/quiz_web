import { Card, Image, List, notification, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from './courseCard.module.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ClockCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const CourseCard = () => {
    const [quizzes, setQuizzes] = useState([]);
    useEffect(() => {
        const fetchAllQuizs = async () => {
            try {
                const response = await axios.get('https://api.trandai03.online/api/v1/quizs/getAllQuiz');
                if (response.status === 200) {
                    setQuizzes(response.data);
                }
            } catch (error) {
                notification.error({
                    message: 'Lỗi khi tải danh sách đề',
                    description: 'Không thể tải danh sách đề, vui lòng thử lại sau.',
                });
            }
        };
        fetchAllQuizs();
    }, []);
    const settings = {
        dots: true,
        infinite: true,
        speed: 400,
        slidesToShow: 5,
        slidesToScroll: 2,
        arrows: true
    };
    const displayedData = quizzes.slice(0, 5);
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };
    return (
        <div>

            {/* <Slider {...settings} style={{ margin: '40px 0' }}>
                {displayedData.map((course) => {
                    return (
                        <div className={`${styles.item} animate__animated animate__fadeInDownBig`} key={course.id} style={{ padding: '0 10px' }}>
                            <Card
                                hoverable
                                style={{ width: 230, borderRadius: '10px', overflow: 'hidden' }}
                            >
                                <div style={{ height: 200, overflow: 'hidden', borderRadius: '10px 10px 0 0' }}>
                                    <a href={`/quizdetail/examcontent/${course.id}`}>
                                        <img
                                            alt={course.name}
                                            src={course.image}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
                                            className="product-image"
                                        />
                                    </a>
                                </div>

                                <div style={{ marginTop: '20px' }}>
                                    <Title
                                        level={4}
                                        style={{
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            width: '100%',
                                            fontSize: '18px',
                                            color: '#333',
                                            textAlign: 'center'
                                        }}
                                    >
                                        {course.title}
                                    </Title>

                                    <div style={{ textAlign: 'center', marginTop: '10px' }}>
                                        <Text style={{ fontSize: '16px', color: '#888', display: 'block', marginBottom: '5px' }}>
                                            Course ID: {course.id}
                                        </Text>
                                        <Text style={{ fontSize: '16px', color: '#888', display: 'block', marginBottom: '5px' }}>
                                            Câu hỏi: {course.questions.length}
                                        </Text>
                                        <Text style={{ fontSize: '16px', color: '#888', display: 'block', marginBottom: '5px' }}>
                                            Ngày tạo: {formatDate(course.createdAt)}
                                        </Text>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )
                })}
            </Slider> */}



            {/* <List
                grid={{ gutter: 16, column: 4 }}
                dataSource={quizzes}
                renderItem={quiz => (
                    <List.Item>
                        <Card
                            hoverable
                            style={{
                                width: 280,
                                borderRadius: '10px',
                                overflow: 'hidden',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                            }}
                        // bodyStyle={{ padding: '20px' }}
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
                                    <strong>Số câu hỏi:</strong> {quiz.questions?.length}
                                </p>

                                <p style={{ fontSize: '14px', color: '#888', marginBottom: '5px' }}>
                                    <strong>Môn học:</strong> {quiz?.category?.name || "Không có"}
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
            /> */}

        </div>
    );
}

export default CourseCard;
