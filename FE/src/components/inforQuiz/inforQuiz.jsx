import React, { useContext, useEffect, useState } from 'react';
import { Form, Input, Button, Select, Upload, notification, message, Image, Switch } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { ContextFileImage } from '../context/ContextFileImage'
import axios from 'axios';
const { TextArea } = Input;
const { Option } = Select;
const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};
const InforQuiz = () => {
    const { setFileImage } = useContext(ContextFileImage);
    const [form] = Form.useForm();
    const [quizTitle, setQuizTitle] = useState('');
    const [quizCategory, setQuizCategory] = useState(null);
    const [isPublished, setIsPublished] = useState(false);
    const [quizDescription, setQuizDescription] = useState('');
    const [categories, setCategories] = useState([]);
    const storedQuiz = localStorage.getItem('quizInfo');
    const parsedQuiz = JSON.parse(storedQuiz);
    const token = localStorage.getItem("token");
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
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

        if (storedQuiz) {
            setQuizTitle(parsedQuiz.title || '');
            setQuizCategory(parsedQuiz.category_id || null);
            setQuizDescription(parsedQuiz.description || '');
        }
    }, [storedQuiz]);

    const handlePreview = async (file) => {
        const base64Url = await getBase64(file);
        setPreviewUrl(base64Url);
        setFile(file);
    };

    const handleUpload = async () => {
        if (!file) {
            message.warning("Chưa có hình ảnh nào được chọn!");
            return;
        }
        setFileImage(file)
    };


    const handleRemove = () => {
        setPreviewUrl(null);
        setFile(null);
    };
    const handleSave = async () => {
        handleUpload()
        const values = form.getFieldsValue();
        const userCreate = localStorage.getItem("username");
        const quizData = {
            title: values.title,
            description: values.description,
            category_id: values.category_id,
            questions: [],
            isPublished: isPublished,
            userCreate: userCreate,
        };
        localStorage.setItem('quizInfo', JSON.stringify(quizData));
        navigate('/createquiz/createquestion');
    };
    const handleSaveWithFile = async () => {
        const values = form.getFieldsValue();
        const userCreate = localStorage.getItem("username");
        const quizData = {
            title: values.title,
            description: values.description,
            category_id: values.category_id,
            questions: [],
            isPublished: isPublished,
            userCreate: userCreate,
        };
        localStorage.setItem('quizInfo', JSON.stringify(quizData));
        navigate('/createquiz/createquizAI');
    };
    return (
        <Form
            layout="vertical"
            form={form}
            onFinish={handleSave}
            initialValues={{
                category_id: quizCategory,
                description: quizDescription,
            }}
        >
            <Form.Item
                label="Tên đề thi"
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
            <Form.Item
                value={quizDescription}
                onChange={(e) => setQuizDescription(e.target.value)}
                label="Mô tả"
                name="description"
                rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
            >
                <TextArea rows={4} placeholder="Nhập mô tả về đề thi" />
            </Form.Item>
            <Form.Item label="Công khai">
                <Switch
                    checked={isPublished}
                    onChange={(checked) => setIsPublished(checked)}
                />
            </Form.Item>
            <Form.Item>

                <Upload
                    beforeUpload={(file) => {
                        handlePreview(file);
                        return false;
                    }}
                    showUploadList={false}
                >
                    <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
                </Upload>
                {previewUrl && (
                    <div style={{ marginTop: 20 }}>
                        <Image
                            src={previewUrl}
                            alt="Xem trước ảnh"
                            style={{ maxWidth: "200px", marginBottom: 20 }}
                        />
                        <div>
                            {/* Nút Xóa ảnh */}
                            <Button type="default" onClick={handleRemove} icon={<DeleteOutlined />}>
                                Xóa ảnh
                            </Button>
                        </div>
                    </div>
                )}
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: '150px' }}
                    onClick={handleSave}>
                    Tạo đề thi
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

export default InforQuiz;
