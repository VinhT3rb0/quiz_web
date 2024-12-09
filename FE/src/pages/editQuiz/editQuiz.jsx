import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, notification } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Loading from '../../components/loading/loading';
const { TextArea } = Input;
const { Option } = Select;
const EditQuiz = () => {
    const [form] = Form.useForm();
    const [categories, setCategories] = useState([]);
    const [storedQuiz, setStoredQuiz] = useState(null);
    const token = localStorage.getItem("token");
    const { id } = useParams();
    const navigate = useNavigate();
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
    }, [token]);

    useEffect(() => {
        const fetchQuizData = async () => {
            try {
                const res = await axios.get(`https://api.trandai03.online/api/v1/quizs/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });

                if (res.status === 200) {
                    const quizData = res.data;
                    setStoredQuiz(quizData);
                    localStorage.setItem('storedQuiz', JSON.stringify(quizData));
                    form.setFieldsValue({
                        title: quizData.title,
                        description: quizData.description,
                        category_id: quizData.category_id,
                    });
                }
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu quiz:", error);
            }
        };
        fetchQuizData();
    }, [id, token, form]);
    if (!storedQuiz) {
        return <Loading />
    }
    const handleSave = async () => {
        const values = form.getFieldsValue();
        const userCreate = storedQuiz.usernameCreated;

        const quizData = {
            title: values.title,
            description: values.description,
            category_id: values.category_id,
            questions: [],
            isPublished: false,
            userCreate: userCreate,
        };
        localStorage.setItem('edit', JSON.stringify(quizData));
        navigate(`/edit/editquestion/${id}`);
    };

    return (
        <Form
            layout="vertical"
            form={form}
            onFinish={handleSave}
        >
            <Form.Item
                label="Tên đề thi"
                name="title"
                rules={[{ required: true, message: 'Vui lòng nhập tên đề thi!' }]}
            >
                <Input placeholder="Nhập tên đề thi" />
            </Form.Item>

            <Form.Item
                label="Chủ đề"
                name="category_id"
                rules={[{ required: true, message: 'Vui lòng chọn 1 chủ đề!' }]}
            >
                <Select placeholder="Chọn chủ đề" style={{ width: "400px" }}>
                    {categories.map(category => (
                        <Option key={category.id} value={category.id}>
                            {category.name}
                        </Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                label="Mô tả"
                name="description"
                rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
            >
                <TextArea rows={4} placeholder="Nhập mô tả về đề thi" />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: '150px' }}>
                    Lưu chỉnh sửa
                </Button>
            </Form.Item>
        </Form>
    );
};

export default EditQuiz;
