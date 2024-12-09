import React from 'react';
import { Spin } from 'antd';
const Loading = () => <Spin style={{
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)"
}} />;
export default Loading;
