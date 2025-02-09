import React from 'react';
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const Page = ({ goBack }) => {
    return (
        <div style={{ padding: '20px' }}>
            <Button onClick={goBack} icon={<ArrowLeftOutlined />} style={{ marginBottom: '20px' }}>Back</Button>
            <h1>Page Header</h1>
            <p>Page Description</p>
            <div style={{ display: 'flex', gap: '10px' }}>
                <img src="https://via.placeholder.com/150" alt="Image 1" />
                <img src="https://via.placeholder.com/150" alt="Image 2" />
            </div>
        </div>
    );
};

export default Page;
