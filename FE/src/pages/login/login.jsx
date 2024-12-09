import React, { useContext, useState } from 'react';
import { Button, Form, Input, Checkbox, Card, notification } from 'antd';
import { UserOutlined, LockOutlined, GoogleOutlined } from '@ant-design/icons';
import './login.Module.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import GoogleButton from 'react-google-button'
const Login = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const onFinish = async (values) => {
        setLoading(true);
        try {
            const { username, password } = values;
            const res = await axios.post('https://api.trandai03.online/api/v1/users/login', {
                username,
                password
            });
            if (res.status === 200 && res.data.status === "success") {
                const { username, email, token } = res.data.data;
                localStorage.setItem('username', username);
                localStorage.setItem('email', email);
                localStorage.setItem('token', token);

                notification.success({
                    message: "Đăng nhập",
                    description: "Thành công!"
                })

                setTimeout(() => {
                    navigate('/');
                }, 1000);
            } else {
                notification.error({
                    message: "Đăng nhập",
                    description: "Không thành công!"
                })
            }
        } catch (error) {
            notification.error({
                message: "Đăng nhập",
                description: "Thông tin không chính xác!"
            })
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <Card className="login-card">
                <h2>Đăng Nhập</h2>
                <Form
                    name="login_form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    size="large"
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Tên đăng nhập"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            type="password"
                            placeholder="Mật khẩu"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>Ghi nhớ tôi</Checkbox>
                        </Form.Item>

                        <a className="login-form-forgot" href="/forgotpass">
                            Quên mật khẩu?
                        </a>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button" loading={loading}>
                            Đăng Nhập
                        </Button>
                        <br />
                    </Form.Item>
                    <Form.Item>

                        <GoogleButton
                            label='Đăng nhập bằng Google'
                            style={{ borderRadius: ".2rem", width: "100%" }}
                            onClick={() => { console.log('Google button clicked') }}
                        /> <br />
                        Hoặc <a href="/register">Đăng ký ngay!</a>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default Login;
