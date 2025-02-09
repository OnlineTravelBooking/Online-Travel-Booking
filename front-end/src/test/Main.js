import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import Page from './Page';

const Main = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalType, setModalType] = useState('');
    const [isPageVisible, setIsPageVisible] = useState(false);

    const showModal = (type) => {
        setModalType(type);
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const showPage = () => {
        setIsPageVisible(true);
    };

    const goBack = () => {
        setIsPageVisible(false);
    };

    return (
        <div style={{ padding: '20px' }}>
            {!isPageVisible ? (
                // แสดงหน้าหลัก
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    {/* 3 ปุ่มที่เปิด modal */}
                    <Button onClick={() => showModal('create')} icon={<PlusOutlined />} block>Create</Button>
                    <Button onClick={() => showModal('edit')} icon={<EditOutlined />} block>Edit</Button>
                    <Button onClick={() => showModal('delete')} icon={<DeleteOutlined />} block>Delete</Button>

                    {/* 3 ปุ่มที่เปิด page */}
                    <Button onClick={showPage} block>Go to Page</Button>
                    <Button block>Button 5</Button>
                    <Button block>Button 6</Button>
                </div>
            ) : (
                // แสดงหน้า Page
                <Page goBack={goBack} />
            )}

            <Modal
                title={modalType.charAt(0).toUpperCase() + modalType.slice(1)}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>Close</Button>,
                    <Button key="submit" type="primary" onClick={handleOk}>Submit</Button>,
                ]}
            >
                <h3>{modalType.charAt(0).toUpperCase() + modalType.slice(1)} Header</h3>
                <p>Description of {modalType}</p>
            </Modal>
        </div>
    );
};

export default Main;
