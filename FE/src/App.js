import React, { useEffect, useState } from "react";
import {
    AccountBookOutlined,
    UserOutlined,
    FormOutlined,
    BookOutlined,
    SettingOutlined,
    LogoutOutlined,
    FileOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    TabletOutlined
} from "@ant-design/icons";
import { Avatar, Card, Image, Layout, Menu, Modal, message, Form, Input, Space, Button, Dropdown } from "antd";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import MyFooter from "./components/footer/footer";
import Meta from "antd/es/card/Meta";
import SearchQuiz from "./components/searchQuiz/searchQuiz";
import axios from "axios";
import ListByCategory from "./components/listByCategory/listByCategory";

const { Header, Content, Sider } = Layout;

const App = () => {
    const menuItems = [
        {
            key: "1",
            icon: <BookOutlined />,
            label: "Khám phá",
            path: "/",
        },
        {
            key: "2",
            icon: <FormOutlined />,
            label: "Kết quả thi của tôi",
            path: "/reportquizresult",
        },
        {
            key: "3",
            icon: <UserOutlined />,
            label: "Đề thi yêu thích",
            path: "/favorexam",
        },
        {
            key: "4",
            icon: <FileOutlined />,
            label: "Quản lý đề thi",
            path: "/quizlist",
        },
        {
            key: "5",
            icon: <TabletOutlined />,
            label: "Cuộc thi",
            path: "/usercompetitions",
        },
    ];
    const location = useLocation();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [isLogin, setIsLogin] = useState('');
    const token = localStorage.getItem("token");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [code, setCode] = useState('');
    const showModalJoinCode = () => {
        setIsModalVisible(true);
    };
    const handleJoin = () => {
        if (code.trim() === '') {
            message.error('Vui lòng nhập mã code!');
            return;
        }
        setIsModalVisible(false);
        const fetchCompetitionData = async () => {
            try {
                const response = await axios.get(`https://api.trandai03.online/api/v1/competitions/getByCode/${code}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (response.status === 200) {
                    navigate(`/joincompetition/${code}`)

                }
            } catch (error) {
                message.error("Mã code không tồn tại!");
            }
        };
        fetchCompetitionData();
    };

    const handleCancelJoin = () => {
        setIsModalVisible(false);
    };
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const toggleCollapse = () => {
        setCollapsed(!collapsed);
    };
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("email");
        setTimeout(() => {
            navigate('/');
        }, 2000);
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://api.trandai03.online/api/v1/tokens/${token}`);
                setIsLogin(response.data.data);

                if (response.data.data == "false") {
                    window.location.href = '/login';

                }
            } catch (error) {
                window.location.href = '/login';
                console.error("Error fetching data", error);
            }
        };

        fetchData();
    }, []);

    // if (!isLogin) {
    //     return (<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading....</div>)
    // }
    const menu = (
        <Menu>
            {token && isLogin ? (
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
        <div>
            <Layout>
                <Sider
                    width={220}
                    collapsible
                    collapsed={collapsed}
                    onCollapse={setCollapsed}
                    style={{
                        backgroundColor: "#fff",
                        borderRight: "1px solid #f2f2f2",
                        padding: "20px 0",
                    }}
                >
                    <div style={{ textAlign: "center", marginBottom: "20px" }}>
                        <Link to='/'>
                            <Image
                                src="https://cf.quizizz.com/img/logos/Purple.webp"
                                preview={false}
                                width={collapsed ? 50 : 150}
                            />
                        </Link>
                    </div>

                    <Modal
                        title="Tạo đề thi mới?"
                        style={{ textAlign: "center" }}
                        open={isModalOpen}
                        onOk={handleOk}
                        onCancel={handleCancel}
                    >
                        <div style={{ display: "flex", justifyContent: "center", gap: "20px", }}>
                            <Card
                                hoverable
                                onClick={() => {
                                    if (token && isLogin) {
                                        navigate("/createquiz/inforquiz");
                                    } else {
                                        navigate("/login");
                                    }
                                    handleCancel();
                                }}
                                style={{
                                    width: 240,
                                    margin: "0 auto",
                                }}
                                cover={
                                    <img
                                        alt="example"
                                        src="https://templatelab.com/wp-content/uploads/2017/04/puzzle-piece-template-13.jpg"
                                    />
                                }
                            >
                                <Meta title="Quiz" description="Ôn tập các câu hỏi trắc nghiệm" />
                            </Card>
                            <Card
                                hoverable
                                onClick={() => {
                                    if (token && isLogin) {
                                        navigate("/createcompetition/competition");
                                    } else {
                                        navigate("/login");
                                    }
                                    handleCancel();
                                }}
                                style={{
                                    width: 240,
                                    margin: "0 auto",
                                }}
                                cover={
                                    <img
                                        alt="example"
                                        src="https://quizizz.com/media/resource/gs/quizizz-media/quizzes/1c22eeb6-0b9d-446e-aa03-9c21f3cb3c65?w=400&h=400"
                                    />
                                }
                            >
                                <Meta title="Cuộc thi" description="Đưa ra đánh giá và thực hành" />
                            </Card>
                        </div>
                    </Modal>

                    <Modal
                        title="Nhập mã code"
                        open={isModalVisible}
                        onOk={handleJoin}
                        onCancel={handleCancelJoin}
                        okText="Gia nhập"
                        cancelText="Hủy"
                    >
                        <Form layout="vertical">
                            <Form.Item label="Mã code">
                                <Input
                                    type="text"
                                    placeholder="Nhập mã code"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                />
                            </Form.Item>
                        </Form>
                    </Modal>
                    <Menu
                        defaultSelectedKeys={[location.pathname]}
                        mode="inline"
                        style={{ fontSize: "16px" }}
                    >
                        <div
                            style={{
                                textAlign: "left",
                                marginTop: "20px",
                            }}
                        >
                            <Button type="text" onClick={toggleCollapse} style={{
                                textAlign: "left"
                            }}>
                                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            </Button>
                        </div>
                        {menuItems.map((item) => (
                            <Menu.Item key={item.key} icon={item.icon}>
                                <Link to={item.path}>{collapsed ? null : item.label}</Link>
                            </Menu.Item>
                        ))}
                    </Menu>
                </Sider>

                <Layout>
                    <Header
                        style={{
                            gap: ".5rem",
                            display: "flex",
                            justifyContent: "space-between",
                            backgroundColor: "#f5f5f5",
                            padding: "10px 20px",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        <SearchQuiz />
                        <Button
                            type="primary"
                            onClick={showModal}
                            style={{
                                height: "40px",
                                lineHeight: "40px",
                                borderRadius: "1.2em",
                                backgroundImage:
                                    "linear-gradient(90deg, rgb(62, 101, 254) 0%, rgb(210, 60, 255) 100%)",
                                color: "#fff",
                                width: "150px",
                            }}
                        >
                            Tạo đề thi
                        </Button>
                        <Button
                            type="primary"
                            onClick={showModalJoinCode}
                            style={{
                                height: "40px",
                                lineHeight: "40px",
                                borderRadius: "1.2em",
                                backgroundImage: "linear-gradient(90deg, rgb(62, 101, 254) 0%, rgb(210, 60, 255) 100%)",
                                color: "#fff",
                                width: "150px",
                            }}
                        >
                            Gia nhập với code
                        </Button>
                        <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
                            <Space size="large" align="center">
                                <Avatar style={{ backgroundColor: "#87d068" }} icon={<UserOutlined />} />
                            </Space>
                        </Dropdown>
                    </Header>

                    <Content
                        style={{
                            minHeight: "100vh",
                            padding: "24px",
                        }}
                    >
                        <Outlet />
                    </Content>

                    <MyFooter />
                </Layout>
            </Layout>
        </div>
    );
};

export default App;
