import { Col, Layout, Row, Space, Modal, Image, Button, Tabs, Radio, Select, Popover, QRCode, message, notification } from 'antd';
import React, { useEffect, useState } from 'react';
import {
    QuestionCircleOutlined, CheckOutlined, SettingOutlined,
    LikeOutlined, HeartOutlined, DownloadOutlined, FacebookOutlined, TwitterOutlined, TwitchOutlined, HeartFilled
} from '@ant-design/icons';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import Headers from '../../components/headers/headers';
import axios from 'axios';
import Loading from '../../components/loading/loading';
const { Content } = Layout;
const QuizDetail = () => {
    const { id } = useParams();
    const token = localStorage.getItem("token");
    const items = [
        {
            key: '1',
            label: 'Nội dung đề thi',
            path: `/quizdetail/examcontent/${id}`,
        },
    ];
    const options = [
        {
            value: '15 phút',
            label: '15 phút',
        },
        {
            value: '30 phút',
            label: '30 phút',
        },
        {
            value: '45 phút',
            label: '45 phút',
        },
        {
            value: '60 phút',
            label: '60 phút',
        },
        {
            value: '90 phút',
            label: '90 phút',
        },
        {
            value: '120 phút',
            label: '120 phút',
        },
    ];
    const [favorquizzes, setFavorQuizzes] = useState([]);
    const [selectedTime, setSelectedTime] = useState('30 phút');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        const updatedQuiz = { ...quiz, selectedTime };
        localStorage.setItem('quizInfo', JSON.stringify(updatedQuiz));
        setIsModalOpen(false);
        navigate(`/doexam/${id}`)
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const [value, setValue] = useState(1);
    const onChangeRadio = (e) => {
        console.log('radio checked', e.target.value);
        setValue(e.target.value);
    };
    const [quiz, setQuiz] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        const fetchQuizData = async () => {
            try {
                const response = await axios.get(`https://api.trandai03.online/api/v1/quizs/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    }
                });

                if (response.status === 200) {
                    setQuiz(response.data);
                }
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu quiz:", error);
            }
        };

        fetchQuizData();
    }, [id]);
    useEffect(() => {
        const fetchFavorQuizzes = async () => {
            try {
                const response = await axios.get('https://api.trandai03.online/api/v1/users/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': '*/*'
                    }
                });
                if (response.status === 200) {
                    console.log(response.data);
                    const newFavorQuizzes = response.data.data.favoriteQuizResponse.map((res) => res.quiz.id);
                    const uniqueFavorQuizzes = [...new Set([...favorquizzes, ...newFavorQuizzes])];
                    setFavorQuizzes(uniqueFavorQuizzes);
                }
            } catch (error) {
                notification.error({
                    message: 'Lỗi khi tải danh sách yêu thích',
                    description: 'Không thể tải danh sách yêu thích, vui lòng thử lại sau.',
                });
            }
        };
        fetchFavorQuizzes();
    }, []);
    if (!quiz) {
        return <Loading />;
    }
    const onChange = (key) => {
        const selectedTab = items.find(item => item.key === key);
        if (selectedTab) {
            navigate(selectedTab.path);
        }
    };
    const handleTimeChange = (value) => {
        setSelectedTime(value);
        localStorage.setItem('Time', JSON.stringify(value));
    }
    console.log(quiz);

    const toggleFavorite = async (quizId) => {
        try {
            if (favorquizzes.includes(quizId)) {
                const res = await axios.delete(`https://api.trandai03.online/api/v1/quizs/unfavorite/${quizId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
                if (res.status === 200) {
                    const updatedFavor = favorquizzes.filter((id) => id !== quizId);
                    setFavorQuizzes(updatedFavor)
                    message.success('Đã bỏ yêu thích!');
                }
            } else {
                const res = await axios.post(`https://api.trandai03.online/api/v1/quizs/favorite/${quizId}`, {}, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
                if (res.status === 200) {
                    setFavorQuizzes([...favorquizzes, quizId])
                    message.success('Thêm vào mục yêu thích thành công!');
                }
            }
        } catch (error) {
            message.error('Lỗi khi cập nhật mục yêu thích, vui lòng thử lại.');
            console.log(error.message);

        }
    };

    const handleCopy = () => {
        const valueToCopy = `http://localhost:3000/quizdetail/examcontent/${id}`;
        navigator.clipboard.writeText(valueToCopy)
            .then(() => {
                console.log('Copied to clipboard:', valueToCopy);
            })
            .catch((err) => {
                // Xử lý lỗi nếu có
                console.error('Failed to copy:', err);
            });
    };
    return (

        <div style={{ background: "#F1F3F5" }}>
            <Headers />
            <Layout style={{ justifyContent: 'center' }}>
                <Content>
                    <Row justify="center">
                        <Col style={{ padding: "1.25rem!important" }}>
                            <div style={{
                                width: '1300px',
                                padding: '24px',
                                marginTop: "100px",
                                backgroundColor: '#fff',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                borderRadius: '8px'
                            }}>
                                <Space direction="vertical">
                                    <p style={{ fontSize: "22px", fontWeight: "bold" }}>Thông tin đề thi</p>
                                </Space>
                                <Row style={{ gap: "1rem" }}>
                                    <Col span={8}>
                                        <Image src='https://upload-api.eduquiz.io.vn/default/exam/exam-02.png' preview={false}></Image>
                                    </Col>
                                    <Col span={8} style={{ gap: '.75rem' }}>
                                        <div className='d-flex align-items-baseline'><b style={{ fontSize: 24 }}>Người tạo đề thi: </b><p className='fs-5 ps-2'>{quiz.usernameCreated}</p></div>
                                        <div className='d-flex align-items-baseline'><b style={{ fontSize: 24 }}>Tên bài thi: </b><p className='fs-5 ps-2'>{quiz.title}</p></div>
                                        <div className='d-flex align-items-baseline'><b style={{ fontSize: 24 }}>Chủ đề: </b><p className='fs-5 ps-2'>{quiz.categoryResponse.name}</p></div>
                                        <div style={{ display: 'flex', alignItems: "center", gap: '.5rem' }}>
                                            <QuestionCircleOutlined /> {quiz.questions?.length}
                                            <LikeOutlined />
                                            <DownloadOutlined />
                                        </div>
                                        <div style={{ display: 'flex', marginTop: '20px', alignItems: "center", gap: '1.2rem' }}>
                                            <LikeOutlined style={{ fontSize: '23px' }} />
                                            <Button
                                                icon={favorquizzes.includes(quiz.id) ? <HeartFilled style={{ color: 'red' }} /> : <HeartOutlined />}
                                                onClick={() => toggleFavorite(quiz.id)}
                                            />
                                            {/* <HeartOutlined style={{ fontSize: '23px' }} /> */}
                                        </div>
                                    </Col>
                                    <Col span={7}>
                                        <p style={{ fontSize: '20px' }}>Chia sẻ đề thi</p>
                                        <div style={{ fontSize: '20px', gap: '1rem !important' }}>
                                            <FacebookOutlined />
                                            <TwitterOutlined />
                                            <TwitchOutlined />
                                        </div>
                                        <div style={{ marginTop: '20px' }}>
                                            <Button type="primary" onClick={handleCopy} style={{ width: '100px' }}>Sao chép</Button>
                                            <Popover content={<QRCode value={`http://localhost:3000/quizdetail/examcontent/${id}`} bordered={false} />}>
                                                <Button type="primary" htmlType="submit" style={{ width: '200px', marginLeft: '20px' }}>Quét mã QRcode</Button>
                                            </Popover>
                                        </div>
                                    </Col>
                                </Row>
                                <Row style={{ marginTop: '20px', gap: "1rem" }}>
                                    <Col span={8}><Button type="primary" htmlType="submit" style={{ width: '100%' }}>Thẻ ghi nhớ</Button></Col>
                                    <Col span={8}><Button onClick={showModal} type="primary" htmlType="submit" style={{ width: '100%' }}>Bắt đầu ôn thi</Button></Col>
                                    <Modal style={{ fontSize: '16px' }} title="Chế độ luyện thi" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                                        <Radio.Group onChange={onChangeRadio} value={value}>
                                            <Radio value={2}>Thi thử</Radio>
                                        </Radio.Group> <br />
                                        <CheckOutlined /> Không giới hạn thời gian làm đề thi <br />
                                        <CheckOutlined /> Kết quả được hiển thị ngay sau khi kiểm tra
                                        <hr style={{ borderWidth: '0px 0px thin', borderStyle: 'solid', borderColor: 'rgba(0, 0, 0, 0.12)' }} />
                                        <div style={{ display: 'flex', gap: '.5rem' }}>
                                            <SettingOutlined />
                                            <h3>Cài đặt đề thi</h3>
                                        </div>
                                        <p style={{ fontWeight: 'bold' }}>Thời gian làm bài thi</p>
                                        <Space.Compact>
                                            <Select
                                                defaultValue={selectedTime || "30 phút"}
                                                onChange={handleTimeChange} options={options} />
                                        </Space.Compact>
                                    </Modal>
                                    <Col span={7}><Button type="primary" htmlType="submit" style={{ width: '100%' }}>Tải về</Button></Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </Content>
            </Layout>
            <Layout style={{ marginTop: '20px', minHeight: '100vh', justifyContent: 'center' }}>
                <Content>
                    <Row justify="center">
                        <Col>
                            <div style={{
                                width: '1300px',
                                padding: '24px',
                                backgroundColor: '#fff',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                borderRadius: '8px'
                            }}>
                                <Tabs activeKey={[location.pathname]}
                                    items={items.map(item => ({
                                        key: item.key,
                                        label: item.label
                                    }))} onChange={onChange}>
                                </Tabs>
                                <Outlet />
                            </div>
                        </Col>
                    </Row>
                </Content>
            </Layout>
        </div>
    );
};

export default QuizDetail;
