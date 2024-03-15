import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Spin } from 'antd';
import axios from 'axios';

const { Column } = Table;

const App = () => {
  const [cars, setCars] = useState([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/v1/cars');
      const responseData = response.data.data; // Accessing the 'data' property of the response
      setCars(responseData);
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
    } catch (error) {
      console.error('Error creating car:', error);
      message.error('Failed to create car');
    }
  };

  const handleEdit = async (id, values) => {
    try {
      await axios.put(`http://localhost:3000/v1/cars/${id}`, values);
      fetchCars();
      message.success('Car updated successfully');
    } catch (error) {
      console.error('Error updating car:', error);
      message.error('Failed to update car');
    }
  };

  const handleSearch = (value) => {
    if (value === '') {
      fetchCars();
    } else {
      const filteredCars = cars.filter((car) =>
        car.merek.toLowerCase().includes(value.toLowerCase())
      );
      setCars(filteredCars);
    }
  };

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <div>
      <Button type="primary" onClick={showModal} style={{ marginBottom: 16 }}>
        Create
      </Button>
      <Input.Search
        placeholder="Search by Merek"
        onSearch={handleSearch}
        style={{ width: 200, marginBottom: 16 }}
      />
      <Spin spinning={loading}>
        <Table dataSource={cars} rowKey="id">
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
                <Button type="link" onClick={() => handleEdit(record.id, record)}>
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
      <Modal
        title="Create Car"
        visible={visible}
        onCancel={handleCancel}
        onOk={() => {
          form.validateFields().then((values) => {
            form.resetFields();
            handleCreate(values);
          });
        }}
      >
        <Form form={form} layout="vertical">
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
    </div>
  );
};

export default App;
