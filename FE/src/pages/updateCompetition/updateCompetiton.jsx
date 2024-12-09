import React, { useEffect, useState } from 'react';
import { Form, Input, Button, DatePicker, Select, InputNumber, message, Modal } from 'antd';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';

const UpdateCompetition = () => {
    const { competitionId } = useParams();
    const [form] = Form.useForm();
    const token = localStorage.getItem("token");
    const [timeInMinutes, setTimeInMinutes] = useState(0);
    const [isModalOpen2, setIsModalOpen2] = useState(false);
    const [codeCompetition, setCodeCompetition] = useState(null);
    const navigate = useNavigate();

    // Hàm chuyển thời gian thành UTC
    const convertToUTC = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString();
    };

    // Lấy dữ liệu competition và điền vào form
    useEffect(() => {
        const fetchCompetitionData = async () => {
            try {
                const res = await axios.get(`https://api.trandai03.online/api/v1/competitions/getById/${competitionId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });

                if (res.status === 200) {
                    const compeData = res.data;
                    setCodeCompetition(compeData.code);
                    setTimeInMinutes(compeData.time / 60);

                    form.setFieldsValue({
                        name: compeData.name,
                        description: compeData.description,
                        startTime: moment(compeData.startTime),
                        time: compeData.time,
                    });
                }
            } catch (error) {
                message.error("Lỗi khi lấy dữ liệu cuộc thi.");
            }
        };
        fetchCompetitionData();
    }, [competitionId, token, form]);

    // Gọi API cập nhật competition khi người dùng submit form
    const onFinish = async (values) => {
        const timeInSeconds = timeInMinutes > 0 ? timeInMinutes * 60 : values.time;
        const payload = {
            time: timeInSeconds,
            name: values.name,
            description: values.description,
            startTime: convertToUTC(values.startTime),
        };

        try {
            const response = await axios.put(`https://api.trandai03.online/api/v1/competitions/update/${competitionId}`, payload, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 200) {
                message.success('Chỉnh sửa cuộc thi thành công!');
                navigate(`/usercompetitions`);
            }
        } catch (error) {
            message.error('Không thể cập nhật cuộc thi.');
        }
    };

    return (
        <div>
            <Form style={{ maxWidth: "1000px" }} form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item
                    label="Tên cuộc thi"
                    name="name"
                    rules={[{ required: true, message: 'Vui lòng nhập tên cuộc thi' }]}
                >
                    <Input placeholder="Tên cuộc thi" />
                </Form.Item>

                <Form.Item
                    label="Mô tả"
                    name="description"
                    rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
                >
                    <Input.TextArea placeholder="Mô tả cuộc thi" />
                </Form.Item>
                <Form.Item label="Ngày bắt đầu cuộc thi" name="startTime" rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}>
                    <DatePicker
                        showTime
                        format="YYYY-MM-DD HH:mm:ss"
                        style={{ width: '100%' }}
                        placeholder="Chọn ngày và giờ bắt đầu"
                    />
                </Form.Item>

                <Form.Item label="Thời gian làm bài">
                    <Input.Group compact>
                        <Form.Item name="time" style={{ width: '60%' }} rules={[{ required: timeInMinutes === 0, message: 'Vui lòng nhập thời gian làm bài' }]}>
                            <InputNumber type={'number'} min={0} placeholder="Nhập thời gian làm bài (giây)" style={{ width: '100%' }} disabled={timeInMinutes > 0} />
                        </Form.Item>
                        <Select
                            value={timeInMinutes}
                            onChange={(value) => setTimeInMinutes(value)}
                            style={{ width: '40%' }}
                            options={[
                                { value: 0, label: 'Chọn thời gian làm bài' },
                                { value: 5, label: '5 phút' },
                                { value: 10, label: '10 phút' },
                                { value: 15, label: '15 phút' },
                                { value: 30, label: '30 phút' },
                                { value: 45, label: '45 phút' },
                                { value: 60, label: '60 phút' }
                            ]}
                        />
                    </Input.Group>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Cập nhật cuộc thi
                    </Button>
                </Form.Item>
            </Form>

            {codeCompetition && (
                <Form.Item>
                    <Button type="primary" onClick={() => setIsModalOpen2(true)}>
                        Xem mã code
                    </Button>
                </Form.Item>
            )}

            <Modal
                title="Mã của cuộc thi"
                open={isModalOpen2}
                onOk={() => setIsModalOpen2(false)}
                onCancel={() => setIsModalOpen2(false)}
                footer={[
                    <Button key="close" type="primary" onClick={() => setIsModalOpen2(false)}>
                        Đóng
                    </Button>
                ]}
            >
                <h2>{codeCompetition}</h2>
            </Modal>
        </div>
    );
};

export default UpdateCompetition;
