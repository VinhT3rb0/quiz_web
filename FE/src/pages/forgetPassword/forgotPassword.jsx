import React, { useState } from 'react';
import { Form, Input, Button, notification, Card } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import './forgotPassword.Module.css'
import { useNavigate } from 'react-router-dom';
const ForgotPassword = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const onFinish = async (values) => {
        const { email } = values;
        try {
            setLoading(true);
            const res = await axios.post(`https://api.trandai03.online/api/v1/users/forgot-password/${email}`);
            if (res.status === 200) {
                notification.success({
                    message: 'Đổi mật khẩu thành công!',
                    description: 'Mật khẩu mới của bạn đã được gửi vào email.',
                });
                navigate('/login');
            } else {
                notification.error({
                    message: 'Đổi mật khẩu không thành công!',
                    description: 'Có lỗi xảy ra, vui lòng thử lại.',
                });
            }
        } catch (error) {
            console.error('Lỗi khi đổi mật khẩu:', error);
            notification.error({
                message: 'Lỗi kết nối!',
                description: 'Không thể kết nối đến máy chủ, vui lòng thử lại sau.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <Card className="login-card">

                <h2>Xác nhận email</h2>
                <Form
                    name="change_password"
                    onFinish={onFinish}
                    layout="vertical"
                    size="large"
                >
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
                    >
                        <Input prefix={<LockOutlined />} placeholder="Email đăng ký" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" className="login-form-button" htmlType="submit" loading={loading}>
                            Đổi Mật Khẩu
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default ForgotPassword;
