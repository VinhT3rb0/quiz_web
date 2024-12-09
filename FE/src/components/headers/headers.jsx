import { Avatar, Dropdown, Image, Layout, Menu, Space } from 'antd';
import { Header } from 'antd/es/layout/layout';
import React, { useState } from 'react';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link, useLocation, useNavigate } from "react-router-dom";
const Headers = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const username = localStorage.getItem("username")
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const handleLogout = () => {
        localStorage.removeItem("username");
        localStorage.removeItem("email");
        setIsAuthenticated(false);
        setTimeout(() => {
            navigate('/');
        }, 2000);
    };
    const menu = (
        <Menu>
            {username ? (
                <>
                    <Menu.Item key="1" icon={<UserOutlined />}>
                        <a href="/profile">Hồ sơ</a>
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item key="2" icon={<LogoutOutlined />} onClick={handleLogout}>
                        Đăng xuất
                    </Menu.Item>
                </>
            ) : (
                <Menu.Item key="3" icon={<UserOutlined />}>
                    <a href="/login">Đăng nhập</a>
                </Menu.Item>
            )}
        </Menu>
    );
    return (
        <Layout>
            <Header style={{
                gap: ".5rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#fff",
                padding: "10px 20px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}>
                <Link to='/'>
                    <Image src="https://cf.quizizz.com/img/logos/Purple.webp"
                        preview={false}
                        width={150} style={{ float: 'left' }}>
                    </Image>
                </Link>
                <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
                    <Space size="large" align="center">
                        <Avatar style={{ backgroundColor: "#87d068" }} icon={<UserOutlined />} />
                    </Space>
                </Dropdown>
                {/* <Avatar style={{ float: 'right', backgroundColor: '#87d068' }} icon={<UserOutlined />} /> */}
            </Header>
        </Layout>
    );
}

export default Headers;
