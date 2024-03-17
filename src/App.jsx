import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Spin, Flex } from 'antd';
import axios from 'axios';

const { Column } = Table;

const App = () => {
    const [cars, setCars] = useState([]);
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [editingCarId, setEditingCarId] = useState(null);
    const [originalCars, setOriginalCars] = useState([]);

    useEffect(() => {
        fetchCars();
    }, []);

    const fetchCars = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:3000/v1/cars');
            const responseData = response.data.data;
            setCars(responseData);
            setOriginalCars(responseData);
        } catch (error) {
            console.error('Error fetching cars:', error);
            message.error('Failed to fetch cars');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/v1/cars/${id}`);
            fetchCars();
            message.success('Car deleted successfully');
        } catch (error) {
            console.error('Error deleting car:', error);
            message.error('Failed to delete car');
        }
    };

    const handleCreate = async (values) => {
        try {
            await axios.post('http://localhost:3000/v1/cars', values);
            setVisible(false);
            fetchCars();
            message.success('Car created successfully');
            form.resetFields();
        } catch (error) {
            console.error('Error creating car:', error);
            message.error('Failed to create car');
        }
    };

    const handleEdit = (id) => {
        setEditingCarId(id);
        setVisible(true);
        const carToEdit = cars.find((car) => car.id === id);
        form.setFieldsValue(carToEdit);
    };

    const handleSaveEdit = async () => {
        try {
            const values = await form.validateFields();
            await axios.put(`http://localhost:3000/v1/cars/${editingCarId}`, values);
            setVisible(false);
            setEditingCarId(null)
            fetchCars();
            form.resetFields();
            message.success('Car updated successfully');
        } catch (error) {
            console.error('Error updating car:', error);
            message.error('Failed to update car');
        }
    };

    const handleCancel = () => {
        setVisible(false);
        setEditingCarId(null)
        form.resetFields();
    };

    const handleSearch = (value) => {
        if (value === '') {
            setCars(originalCars);
        } else {
            const filteredCars = originalCars.filter((car) =>
                car.merek.toLowerCase().includes(value.toLowerCase())
            );
            setCars(filteredCars);
        }
    };

    return (
        <>
            <Flex style={{ gap: '10px' }}>
                <Button type="primary" onClick={() => setVisible(true)} style={{ marginBottom: 16 }}>
                    Create
                </Button>
                <Input.Search
                    placeholder="Search by Merek"
                    onSearch={(value) => handleSearch(value)}
                    style={{ maxWidth: '100%', marginBottom: 16 }}
                />
            </Flex>
            <div>
                <Spin spinning={loading}>
                    <Table dataSource={cars} rowKey="id" scroll={{ x: true }}>
                        <Column title="ID" dataIndex="id" key="id" />
                        <Column title="Merek" dataIndex="merek" key="merek" />
                        <Column title="Jenis" dataIndex="jenis" key="jenis" />
                        <Column title="Stok" dataIndex="stok" key="stok" />
                        <Column title="Harga" dataIndex="harga" key="harga" />
                        <Column title="Keterangan" dataIndex="keterangan" key="keterangan" />
                        <Column
                            title="Action"
                            key="action"
                            render={(text, record) => (
                                <span>
                                    <Button type="link" onClick={() => handleEdit(record.id)}>
                                        Edit
                                    </Button>
                                    <Button type="link" onClick={() => handleDelete(record.id)}>
                                        Delete
                                    </Button>
                                </span>
                            )}
                        />
                    </Table>
                </Spin>
            </div>
            <Modal
                title={editingCarId ? "Edit Car" : "Create Car"}
                open={visible}
                onCancel={handleCancel}
                onOk={() => form.submit()}
            >
                <Form form={form} layout="vertical" onFinish={editingCarId ? handleSaveEdit : handleCreate}>
                    <Form.Item name="merek" label="Merek" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="jenis" label="Jenis" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="stok" label="Stok" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="harga" label="Harga" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="keterangan" label="Keterangan" rules={[{ required: true }]}>
                        <Input.TextArea />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default App;
