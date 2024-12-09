import { Col, Layout, Row, Space, Tabs } from 'antd';
import { Content } from 'antd/es/layout/layout';
import React from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
const Update = () => {
    const { id } = useParams();
    const items = [
        {
            key: '1',
            label: 'Thông tin cơ bản',
        },
    ];
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
                    <Col>
                        <div style={{
                            width: '1300px',
                            padding: '24px',
                            backgroundColor: '#fff',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            borderRadius: '8px'
                        }}>
                            <Space direction="vertical">
                                <p style={{ fontSize: "22px", fontWeight: "bold" }}>Chỉnh sửa thông tin cuộc thi</p>
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

export default Update;
