import React, { useContext, useState } from 'react';
import mammoth from 'mammoth';
import { PDFDocument } from 'pdf-lib';
import { Button, message, notification } from 'antd';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
const CompeWithFile = () => {
    const [questions, setQuestions] = useState([]);
    const { competitionId } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const parseQuestions = (text) => {
        const questionRegex = /Câu \d+:/g;
        const questionParts = text.split(questionRegex).slice(1);

        const parsedQuestions = questionParts.map((part, index) => {
            const lines = part.trim().split('\n').filter(line => line);
            const questionText = `${lines[0]}`;
            const options = lines.slice(1).map((line) => {
                const isCorrect = line.endsWith('*');
                const cleanedLine = line.replace(/^\*?\s*[A-Z]\.\s*/, '').replace(/\*$/, '').trim();

                return {
                    text: cleanedLine,
                    isCorrect: isCorrect
                };
            });

            return { question: questionText, questionChoiceDTOS: options };
        });

        setQuestions(parsedQuestions);
    };

    const handlePDF = async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        let text = '';
        for (let i = 0; i < pdfDoc.getPageCount(); i++) {
            const page = pdfDoc.getPage(i);
            const pageText = await page.getTextContent(); // Hàm này có thể không hoạt động trực tiếp với pdf-lib, bạn có thể sử dụng pdf.js nếu cần
            text += pageText.items.map(item => item.str).join(' ');
        }
        parseQuestions(text);
    };
    const handleWord = async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        const text = result.value;
        parseQuestions(text);
    };
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (file.type === "application/pdf") {
            await handlePDF(file);
        } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            await handleWord(file);
        } else {
            alert("Chỉ hỗ trợ PDF và Word.");
        }
    }
    console.log(questions);

    const handleSubmit = async () => {
        const storedQuiz = JSON.parse(localStorage.getItem('quizCompe')) || {};
        const newQuiz = {
            title: storedQuiz.title || '',
            description: storedQuiz.description || '',
            category_id: storedQuiz.category_id || 2,
            questions: questions,
            isPublished: storedQuiz.isPublished || false,
        };
        console.log(newQuiz);
        try {
            const response = await axios.post(`https://api.trandai03.online/api/v1/competitions/quiz/create/${competitionId}`, newQuiz, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                },
            });
            if (response.status === 200) {
                notification.success({
                    message: 'Thành công',
                    description: 'Quiz đã được tạo thành công.',
                });
                localStorage.removeItem("quizCompe")
                localStorage.removeItem("quizQuestionsCompe")
                navigate(`/createcompetition/showquizcompe/${competitionId}`)
            }
        } catch (error) {
            notification.error({
                message: 'Lỗi khi tạo quiz',
                description: 'Không thể tạo quiz, vui lòng thử lại sau.',
            });
            console.log(error.response);
        }
    };
    return (
        <div>
            <input type="file" onChange={handleFileUpload} />
            {questions.length === 0 ? (
                <p style={{
                    fontStyle: "italic",
                    color: "red"
                }}>Lưu ý: đề thi upload bắt đầu câu bằng chữ "Câu (số):", có dấu • ở mỗi đáp án và đánh dấu * ở đầu hoặc cuối đáp án đúng</p>
            ) : (null)}
            {questions.length > 0 && (
                <div>
                    {questions.map((q, index) => (
                        <div key={index}>
                            <h3>{q.question}</h3>
                            <ul>
                                {q.questionChoiceDTOS.map((option, i) => (
                                    <li key={i} style={{ color: option.isCorrect ? 'green' : 'black' }}>
                                        {option.isCorrect && '*'} {option.text}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
            <Button type="primary" onClick={handleSubmit} style={{ width: '100%', marginTop: '20px' }}>
                Lưu tất cả câu hỏi
            </Button>
        </div>
    );
}

export default CompeWithFile;
