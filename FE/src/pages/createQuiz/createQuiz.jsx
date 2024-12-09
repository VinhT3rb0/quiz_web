import { Col, Layout, Row, Space, Tabs } from 'antd';
import { Content } from 'antd/es/layout/layout';
import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
const items = [
    {
        key: '1',
        label: 'Thông tin cơ bản',
        path: "/createquiz/inforquiz",
    },
    {
        key: '2',
        label: 'Soạn câu hỏi',
        path: '/createquiz/createquestion',
    },
];
const CreateQuiz = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const onChange = (key) => {
        const selectedTab = items.find(item => item.key === key);
        if (selectedTab) {
            navigate(selectedTab.path);
        }
    };
    return (
        <Layout style={{ minHeight: '100vh', justifyContent: 'center' }}>
            <Content>
                <Row justify="center">
                    <Col span={20}>
                        <div style={{
                            padding: '24px',
                            backgroundColor: '#fff',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            borderRadius: '8px'
                        }}>
                            <Space direction="vertical">
                                <p style={{ fontSize: "22px", fontWeight: "bold" }}>Tạo một đề thi</p>
                            </Space>
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
    );
}

export default CreateQuiz;
