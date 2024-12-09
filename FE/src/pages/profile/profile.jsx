import React, { useState, useEffect } from 'react';
import { Form, Input, DatePicker, Button, Tabs, Upload, Avatar, notification } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';

const { TabPane } = Tabs;

const ProfileForm = () => {
    const [activeTab, setActiveTab] = useState('accountInfo');
    const [userData, setUserData] = useState({
        email: '',
        username: '',
        phoneNumber: '',
        fullName: '',
        dateOfBirth: null,
    });
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("token");
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const response = await axios.get('https://api.trandai03.online/api/v1/users/me', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const user = response.data.data;
                setUserData({
                    email: user.email,
                    username: user.username,
                    phoneNumber: user.phoneNumber || '',
                    fullName: user.fullname || '',
                    dateOfBirth: user.dateOfBirth ? moment(user.dateOfBirth) : null,
                });
                form.setFieldsValue({
                    email: user.email,
                    username: user.username,
                    phoneNumber: user.phoneNumber,
                    fullName: user.fullname,
                    dateOfBirth: user.dateOfBirth ? moment(user.dateOfBirth) : null,
                });
            } catch (error) {
                notification.error({
                    message: 'Lỗi',
                    description: 'Không thể lấy thông tin người dùng',
                });
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [token, form]);

    const onFinishAccountInfo = async () => {
        const values = form.getFieldsValue();
        const updatedUserData = {
            username: userData.username,
            email: userData.email,
            fullName: values.fullName,
            phoneNumber: values.phoneNumber,
            dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : null,
        };
        try {
            setLoading(true);
            const response = await axios.put('https://api.trandai03.online/api/v1/users/update', updatedUserData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                notification.success({
                    message: 'Thành công',
                    description: 'Cập nhật thông tin tài khoản thành công!',
                });
            }
        } catch (error) {
            notification.error({
                message: 'Lỗi',
                description: 'Không thể cập nhật thông tin người dùng',
            });
        } finally {
            setLoading(false);
        }
    };

    const onFinish = async (values) => {
        const { password, newPassword, retypePassword } = values;
        if (newPassword !== retypePassword) {
            notification.error({
                message: 'Mật khẩu mới không khớp!',
                description: 'Vui lòng nhập lại đúng mật khẩu mới',
            });
            return;
        }
        const data = {
            password,
            newPassword,
            retypePassword,
        };
        try {
            setLoading(true);
            const res = await axios.put('https://api.trandai03.online/api/v1/users/change-password', data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': '*/*'
                }
            });
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
        <div style={{
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            maxWidth: "1000px",
            margin: "0 auto",
        }}>
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
                <TabPane tab="Thông tin tài khoản" key="accountInfo">
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinishAccountInfo}
                    >
                        <Form.Item label="Ảnh đại diện">
                            <Upload listType="picture-card">
                                <Avatar size={100} icon={<UserOutlined />} />
                            </Upload>
                        </Form.Item>
                        <Form.Item label="Email">
                            <Input value={userData.email} disabled />
                        </Form.Item>
                        <Form.Item label="Tên người dùng">
                            <Input value={userData.username} disabled />
                        </Form.Item>
                        <Form.Item
                            label="Điện thoại di động"
                            name="phoneNumber"
                        >
                            <Input placeholder="Nhập số điện thoại" />
                        </Form.Item>
                        <Form.Item
                            label="Họ tên"
                            name="fullName"
                        >
                            <Input placeholder="Nhập họ tên" />
                        </Form.Item>
                        <Form.Item
                            label="Ngày sinh"
                            name="dateOfBirth"
                        >
                            <DatePicker format="DD/MM/YYYY" placeholder="Chọn ngày sinh" style={{ width: '200px' }} />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={{ width: '100px' }} loading={loading}>
                                Lưu
                            </Button>
                        </Form.Item>
                    </Form>
                </TabPane>

                <TabPane tab="Đổi mật khẩu" key="changePassword">
                    <Form layout="vertical" onFinish={onFinish}>
                        <div style={{ margin: '0 auto', padding: '50px' }}>
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
                                ]}
                            >
                                <Input.Password prefix={<LockOutlined />} placeholder="Nhập lại mật khẩu mới" />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={loading}>
                                    Đổi Mật Khẩu
                                </Button>
                            </Form.Item>
                        </div>
                    </Form>
                </TabPane>
            </Tabs>
        </div>
    );
};

export default ProfileForm;
