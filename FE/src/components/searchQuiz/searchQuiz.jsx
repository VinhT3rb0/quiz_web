import React, { useEffect, useRef, useState } from 'react';
import { Input, List, notification } from 'antd';
import axios from 'axios';
import debounce from 'lodash/debounce';
import './searchQuiz.module.css';
import { useNavigate } from 'react-router-dom';

const SearchQuiz = () => {
    const navigate = useNavigate();
    const [searchResults, setSearchResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const token = localStorage.getItem("token");
    const searchRef = useRef(null);

    const debounceSearch = debounce(async (value) => {
        try {
            const response = await axios.get(
                `https://api.trandai03.online/api/v1/quizs/search?page=0&size=5&sort=title&filter=${encodeURIComponent(value)}&onlyValid=false`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': '*/*',
                    },
                }
            );

            if (response.status === 200) {
                setSearchResults(response.data.content);
            }
        } catch (error) {
            notification.error({
                message: 'Lỗi khi tìm kiếm',
                description: 'Không thể tìm kiếm, vui lòng thử lại sau.',
            });
        }
    }, 300);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (!value) {
            debounceSearch.cancel();
            setSearchResults([]);
        } else {
            debounceSearch(value);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setSearchResults([]);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div style={{ position: "relative", width: "100%" }} ref={searchRef}>
            <Input.Search
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={handleSearchChange}
                enterButton="Tìm kiếm"
                size="middle"
                style={{ width: "100%", height: "40px" }}
                inputStyle={{ marginLeft: "20px", fontSize: "20px" }}
            />
            {searchResults.length > 0 && (
                <div style={{
                    margin: "10px 0",
                    position: "absolute",
                    zIndex: '999',
                    top: "45px",
                    width: '100%',
                    backgroundColor: '#fff',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    borderRadius: '8px',
                }}>
                    <List
                        itemLayout="vertical"
                        dataSource={searchResults}
                        renderItem={quiz => (
                            <List.Item
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    padding: '10px 20px',
                                    borderBottom: '1px solid #f0f0f0',
                                    cursor: "pointer",
                                    borderRadius: '8px',
                                }}
                                onClick={() => navigate(`/quizdetail/examcontent/${quiz.id}`)}
                                key={quiz.id}
                            >
                                <img 
                                    src={quiz.image} 
                                    alt={quiz.title} 
                                    style={{
                                        width: '60px',
                                        height: '60px',
                                        objectFit: 'cover',
                                        borderRadius: '8px',
                                        marginRight: '15px',
                                    }}
                                />
                                <div>
                                    <p style={{
                                        fontSize: "16px",
                                        fontWeight: "bold",
                                        margin: "0",
                                        color: '#333'
                                    }}>{quiz.title}</p>
                                    <p style={{
                                        fontSize: "14px",
                                        color: "#888",
                                        margin: "5px 0 0"
                                    }}>Số câu hỏi: {quiz.totalQuestions}</p>
                                </div>
                            </List.Item>
                        )}
                    />
                </div>
            )}
        </div>
    );
};

export default SearchQuiz;
