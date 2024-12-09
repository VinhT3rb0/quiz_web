import { Button, Input } from 'antd';
import React, { useState } from 'react';

const Test = () => {
    const [list, setList] = useState([]);
    const [job, setJob] = useState('');
    const handleSubmit = () => {
        const newList = [...list, job];
        setList(newList)
        localStorage.setItem("lists", JSON.stringify(newList))
        return newList;
    }
    console.log(list);

    return (
        <div>
            <Input onChange={e => setJob(e.target.value)} value={job} style={{ width: "800px" }} />
            <Button onClick={handleSubmit}> Tạo</Button>
            <ul>
                {list.map((job, index) => {
                    return <li key={index}>{job}</li>
                })}
            </ul>
        </div>
    );
}

export default Test;
