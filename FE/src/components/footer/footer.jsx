import { Col, Row } from 'antd';
import { Footer } from 'antd/es/layout/layout';
import Link from 'antd/es/typography/Link';
import React from 'react';
import './footer.module.css'
const MyFooter = () => {
    return (
        <div>
            <Footer style={{ backgroundColor: '#fff', color: 'black', padding: '40px 145px' }}>
                <Row gutter={[16, 16]}>
                    <Col span={6}>
                        <h3 style={{ color: '#000' }}>Tính năng, đặc điểm</h3>
                        <Link to=''><p>Trường học & Học khu</p></Link>
                        <Link>
                            <p>Quizziz cho công việc</p>
                        </Link>
                        <Link>
                            <p>Tạo một bài quiz</p>
                        </Link>
                        <Link>
                            <p>Tạo một bài học</p>
                        </Link>
                    </Col>
                    <Col span={6}>
                        <h3 style={{ color: 'black' }}>Môn học</h3>
                        <Link>
                            <p>Toán</p>
                        </Link>
                        <Link>
                            <p>Khoa học xã hội</p>
                        </Link>
                        <Link>
                            <p>Khoa học</p>
                        </Link>
                        <Link>
                            <p>Sinh học</p>
                        </Link>

                    </Col>
                    <Col span={6}>
                        <h3 style={{ color: 'black' }}>Về</h3>
                        <Link>
                            <p>Câu chuyện của chúng ta</p>
                        </Link>
                        <Link>
                            <p>Quizz blog</p>
                        </Link>
                        <Link>
                            <p>Bộ hình ảnh/âm thanh</p>
                        </Link>
                    </Col>
                    <Col span={6}>
                        <h3 style={{ color: 'black' }}>Hỗ trợ</h3>
                        <Link>
                            <p>Câu hỏi thường gặp</p>
                        </Link>
                        <Link>
                            <p>Trợ giúp & hỗ trợ</p>
                        </Link>
                        <Link>
                            <p>Chính sách bảo mật</p>
                        </Link>
                        <Link>
                            <p>Điều khoản dịch vụ</p>
                        </Link>
                    </Col>
                </Row>
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    © {new Date().getFullYear()} My Company. All rights reserved.
                </div>
            </Footer>
        </div>
    );
}

export default MyFooter;
