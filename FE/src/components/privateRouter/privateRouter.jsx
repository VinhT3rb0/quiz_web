import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
    const token = localStorage.getItem("token");

    // Nếu không có token, chuyển hướng đến trang đăng nhập
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Nếu có token, cho phép truy cập vào các trang khác
    return <Outlet />;
};

export default PrivateRoute;
