import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, notification } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
const { TextArea } = Input;
const { Option } = Select;
const CreateQuizCompetition = () => {
    const [form] = Form.useForm();
    const [quizTitle, setQuizTitle] = useState('');
    const [quizCategory, setQuizCategory] = useState(null);
    const [categories, setCategories] = useState([]);
    const storedQuiz = localStorage.getItem('quizInfo');
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const { competitionId } = useParams()
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('https://api.trandai03.online/api/v1/category/getAll', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': '*/*'
                    }
                });
                if (response.status === 200) {
                    setCategories(response.data);
                }
            } catch (error) {
                notification.error({
                    message: 'Lỗi khi tải danh sách chủ đề',
                    description: 'Không thể tải danh sách chủ đề, vui lòng thử lại sau.',
                });
            }
        };
        fetchCategories();
    }, [storedQuiz]);

    const handleSave = async () => {
        const values = form.getFieldsValue();
        const userCreate = localStorage.getItem("username");
        const quizData = {
            title: values.title,
            description: ' ',
            category_id: values.category_id,
            questions: [],
            isPublished: true,
            userCreate: userCreate,
        };
        localStorage.setItem('quizCompe', JSON.stringify(quizData));
        navigate(`/createcompetition/questioncompe/${competitionId}`);
    };
    const handleSaveWithFile = async () => {
        const values = form.getFieldsValue();
        const userCreate = localStorage.getItem("username");
        const quizData = {
            title: values.title,
            description: ' ',
            category_id: values.category_id,
            questions: [],
            isPublished: true,
            userCreate: userCreate,
        };
        localStorage.setItem('quizCompe', JSON.stringify(quizData));
        navigate(`/createcompetition/withfile/${competitionId}`);
    }
    return (
        <Form
            layout="vertical"
            form={form}
            onFinish={handleSave}
            initialValues={{
                category_id: quizCategory,
            }}
        >
            <Form.Item
                label="Mã đề"
                name="title"
                rules={[{ required: true, message: 'Vui lòng nhập tên đề thi!' }]}
            >
                <Input
                    placeholder="Nhập tên đề thi"
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                />
            </Form.Item>
            <Form.Item
                label="Chủ đề"
                name="category_id"
                rules={[{ required: true, message: 'Vui lòng chọn 1 chủ đề!' }]}
            >
                <Select
                    value={quizCategory}
                    onChange={(value) => setQuizCategory(value)}
                    placeholder="Chọn chủ đề" style={{ width: "400px" }}>
                    {categories.map(category => (
                        <Option key={category.id} value={category.id}>
                            {category.name}
                        </Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: '150px' }}
                    onClick={handleSave}>
                    Tạo câu hỏi
                </Button>
                <Button
                    type="default"
                    style={{ width: '200px', marginLeft: '10px' }}
                    onClick={handleSaveWithFile}
                >
                    Tạo đề thi với file
                </Button>
            </Form.Item>
        </Form>
    );
};

export default CreateQuizCompetition;
