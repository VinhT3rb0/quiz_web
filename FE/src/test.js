import React, { useState } from 'react';
import { Form, Input, Button, notification } from 'antd';
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';

const ChangePassword = () => {
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        const { email, username, password, newPassword, retypePassword } = values;

        if (newPassword !== retypePassword) {
            notification.error({
                message: 'Mật khẩu mới không khớp!',
                description: 'Vui lòng nhập lại đúng mật khẩu mới',
            });
            return;
        }

        const data = {
            email,
            username,
            password,
            newPassword,
            retypePassword
        };

        try {
            setLoading(true);
            const res = await axios.post('https://api.trandai03.online/api/v1/users/change-password', data);

            if (res.status === 200) {
                notification.success({
                    message: 'Đổi mật khẩu thành công!',
                    description: 'Mật khẩu của bạn đã được thay đổi thành công.',
                });
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
        <div className="change-password-container">
            <h2>Đổi Mật Khẩu</h2>
            <Form
                name="change_password"
                onFinish={onFinish}
                layout="vertical"
                size="large"
            >
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: 'Vui lòng nhập email!' },
                        { type: 'email', message: 'Email không hợp lệ!' }
                    ]}
                >
                    <Input prefix={<MailOutlined />} placeholder="Email" />
                </Form.Item>

                <Form.Item
                    name="username"
                    label="Tên đăng nhập"
                    rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
                >
                    <Input prefix={<UserOutlined />} placeholder="Tên đăng nhập" />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Mật khẩu cũ"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu cũ!' }]}
                >
                    <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu cũ" />
                </Form.Item>

                <Form.Item
                    name="newPassword"
                    label="Mật khẩu mới"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' }]}
                >
                    <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu mới" />
                </Form.Item>

                <Form.Item
                    name="retypePassword"
                    label="Nhập lại mật khẩu mới"
                    dependencies={['newPassword']}
                    rules={[
                        { required: true, message: 'Vui lòng nhập lại mật khẩu mới!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('newPassword') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Mật khẩu mới không khớp!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password prefix={<LockOutlined />} placeholder="Nhập lại mật khẩu mới" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Đổi Mật Khẩu
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default ChangePassword;
