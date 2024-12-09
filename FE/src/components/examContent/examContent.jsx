import React, { useEffect, useState } from 'react';
import './ExamContent.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Loading from '../loading/loading';

const ExamContent = () => {
    const [quiz, setQuiz] = useState(null);
    const { id } = useParams();
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
                    setQuiz(response.data);
                }
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu quiz:", error);
            }
        };

        fetchQuizData();
    }, [id]);

    if (!quiz) {
        return <Loading />;
    }
    return (
        <div className="exam-container">
            <h3>Các câu hỏi</h3>
            <ul className="questions-list">
                {quiz.questions && quiz.questions.map((q, index) => (
                    <li key={index} className="question-item">
                        <strong className="question-title">
                            Câu {index + 1}: {q.question}
                        </strong>
                        <div className="options-grid">
                            {q.questionChoice && q.questionChoice.map((option, idx) => (
                                <div key={option.id} className={`option-item ${option.isCorrect ? 'correct' : ''}`}>
                                    {String.fromCharCode(65 + idx)}. {option.text} {option.isCorrect && <span className="correct-text">(Đúng)</span>}
                                </div>
                            ))}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ExamContent;
