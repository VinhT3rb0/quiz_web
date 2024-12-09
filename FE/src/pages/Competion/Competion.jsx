import React, { useState } from 'react';
import { Form, Input, Button, DatePicker, Select, InputNumber, message, Modal } from 'antd';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const Competion = () => {
    const [form] = Form.useForm();
    const token = localStorage.getItem("token");
    const [timeInMinutes, setTimeInMinutes] = useState(0);
    const [isModalOpen2, setIsModalOpen2] = useState(false);
    const [competition, setCompetition] = useState(null);
    const navigate = useNavigate();
    const [codeCompetition, setCodeCompetition] = useState(null);
    const convertToUTC = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString();
    };
    const onFinish = async (values) => {
        const timeInSeconds = timeInMinutes > 0 ? timeInMinutes * 60 : values.time;
        const payload = {
            time: timeInSeconds,
            name: values.name,
            description: values.description,
            startTime: convertToUTC(values.startTime),
        };

        try {
            const response = await axios.post('https://api.trandai03.online/api/v1/competitions/create', payload, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                },
            });
            if (response.status === 200) {
                message.success('Tạo bài thi thành công!');
                navigate(`/createcompetition/showquizcompe/${response.data.id}`)
            }
            setCodeCompetition(response.data.code);
            setIsModalOpen2(true);
        } catch (error) {
            message.error('Failed to create competition');
            console.error(error);
        }
    };

    return (
        <div>
            <Form style={{ maxWidth: "1000px" }} form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item
                    label="Tên cuộc thi"
                    name="name"
                    rules={[{ required: true, message: 'Please enter the competition name' }]}
                >
                    <Input placeholder="Enter competition name" />
                </Form.Item>

                <Form.Item
                    label="Mô tả"
                    name="description"
                    rules={[{ required: true, message: 'Please enter a description' }]}
                >
                    <Input.TextArea placeholder="Enter description" />
                </Form.Item>
                <Form.Item label="Ngày bắt đầu cuộc thi" name="startTime" rules={[{ required: true, message: 'Please select start time' }]}>
                    <DatePicker
                        showTime
                        format="YYYY-MM-DD HH:mm:ss"
                        style={{ width: '100%' }}
                        placeholder="Select date and time"
                    />
                </Form.Item>

                <Form.Item label="Thời gian làm bài">
                    <Input.Group compact>
                        <Form.Item name="time" style={{ width: '60%' }} rules={[{ required: timeInMinutes === 0, message: 'Please enter a time limit in seconds' }]}>
                            <InputNumber type={'number'} min={0} placeholder="Enter time in seconds" style={{ width: '100%' }} disabled={timeInMinutes > 0} />
                        </Form.Item>

                        <Select
                            defaultValue={0}
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
                        Create Competition
                    </Button>
                </Form.Item>
            </Form>
            {codeCompetition ? (
                <Form.Item>
                    <Button type="primary" onClick={() => setIsModalOpen2(true)}>
                        Mã code
                    </Button>
                </Form.Item>
            ) : (null)}
            <Modal
                title="Mã của đề thi"
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

export default Competion;
