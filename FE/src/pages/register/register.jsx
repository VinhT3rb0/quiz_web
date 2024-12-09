import React, { useState } from 'react';
import { Button, Form, Input, Checkbox, Card, notification } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import axios from 'axios';
import './register.Module.css';
const Register = () => {
  const [loading, setLoading] = useState(false);
  const onFinish = async (values) => {
    try {
      const { email, username, password } = values;
      const data = {
        email,
        username,
        password
      };
      const res = await axios.post('https://api.trandai03.online/api/v1/users/create', data);
      if (res.status === 200) {
        notification.success({
          message: "Đăng ký thành công",
          description: "Success"
        });
        localStorage.setItem("email", data.email)
        setTimeout(() => {
          window.location.href = "/verify";
        }, 1500);
      } else {
        notification.error({
          message: "Đăng ký không thành công",
          description: "error"
        })
      }
    } catch (error) {
      console.error("Đã xảy ra lỗi khi đăng ký: ", error);
      notification.error({
        message: "Đăng ký không thành công",
        description: "Kết nối thất bại"
      })
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <Card className="register-card">
        <h2>Đăng Ký</h2>
        <Form
          name="register_form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
            />
          </Form.Item>

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
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mật khẩu"
            />
          </Form.Item>

          <Form.Item
            name="confirm"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Xác nhận mật khẩu"
            />
          </Form.Item>

          <Form.Item>
            <Form.Item name="agree" valuePropName="checked" noStyle>
              <Checkbox>Tôi đồng ý với các điều khoản</Checkbox>
            </Form.Item>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="register-form-button" loading={loading}>
              Đăng Ký
            </Button>
            <br />
            Đã có tài khoản? <a href="/login">Đăng nhập ngay!</a>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
