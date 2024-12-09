import React, { useState } from 'react';
import SearchCategory from '../searchCategory/searchCategory';
import axios from 'axios';
import styles from './listByCategory.module.css';
import Slider from 'react-slick';
import { Card, Typography } from 'antd';
import Loading from '../loading/loading';
const { Title, Text } = Typography;

const ListByCategory = () => {
    const [quizzes, setQuizzes] = useState([]);
    const handleCategorySelect = async (categoryId) => {
        try {
            const response = await axios.get(`https://api.trandai03.online/api/v1/quizs/category/${categoryId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                    'Content-Type': 'application/json',
                    'Accept': '*/*'
                }
            });
            setQuizzes(response.data);
            console.log(222222222, response.data);

        } catch (error) {
            console.error('Error fetching quiz data:', error);
        }
    };
    if (!quizzes) {
        return <Loading />
    }
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
            <SearchCategory onSelectCategory={handleCategorySelect} />
            <Slider {...settings} style={{ margin: '40px 0' }}>
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
            </Slider>

        </div>
    );
};

export default ListByCategory;
