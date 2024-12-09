import React, { useState, useRef } from 'react';
import { Button, Form, Input, Card, notification, Modal } from 'antd';
import axios from 'axios';
import './verification.css';

const VerifyAccount = () => {
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [code, setCode] = useState(Array(6).fill(""));
  const email = localStorage.getItem("email");
  const inputRefs = useRef([]);

  const handleChange = (e, index) => {
    const newCode = [...code];
    const value = e.target.value;

    if (/^\d$/.test(value) || value === "") {  // Allow only digits or empty string
      newCode[index] = value;
      setCode(newCode);

      // Move to the next input if the current one is filled and we're not at the last input
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  // Handle backspace key to focus previous input
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && code[index] === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle form submission for verification
  const onFinish = async () => {
    const verificationCode = code.join(""); // Combine all digits into a single code

    try {
      setLoading(true);
      const dataCode = {
        email: email,  // Email as a string
        verificationCode: verificationCode // Verification code from the form
      };
      console.log("verify", dataCode);

      const res = await axios.post('https://api.trandai03.online/api/v1/users/verify', dataCode);

      if (res.status === 200) {
        notification.success({
          message: "Xác minh thành công",
          description: "Success"
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      } else {
        notification.error({
          message: "Xác minh không thành công",
          description: "Error"
        });
      }
    } catch (error) {
      console.error("Đã xảy ra lỗi khi xác minh: ", error);
      notification.error({
        message: "Xác minh không thành công",
        description: "Kết nối thất bại"
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle sending code after entering email in the modal
  const handleResendCode = async () => {
    try {
      setResending(true);
      const res = await axios.post(`https://api.trandai03.online/api/v1/users/resend-verification/${email}`);

      if (res.status === 200) {
        notification.success({
          message: "Mã xác minh đã được gửi lại",
          description: "Vui lòng kiểm tra email của bạn"
        });
      } else {
        notification.error({
          message: "Gửi mã xác minh không thành công",
          description: "Error"
        });
      }
    } catch (error) {
      console.error("Error while resending verification code: ", error);
      notification.error({
        message: "Gửi mã xác minh không thành công",
        description: "Kết nối thất bại"
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="verification-container">
      <Card className="verification-card">
        <h2 style={{ textTransform: 'uppercase' }}>Xác minh Email</h2>
        <Form name="verification_form" onFinish={onFinish} size="large">
          <div className="verification-inputs">
            {code.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => inputRefs.current[index] = el}
                className="verification-input"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                autoFocus={index === 0} // Auto-focus the first input when the form loads
              />
            ))}
          </div>

          <Form.Item className="verification-submit">
            <Button type="primary" htmlType="submit" loading={loading} block>
              Xác minh
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Button
            type="link"
            onClick={handleResendCode}
            loading={resending}
            disabled={resending} // Disable the button while sending the request
          >
            Gửi lại mã
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default VerifyAccount;
