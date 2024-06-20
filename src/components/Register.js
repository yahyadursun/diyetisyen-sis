import React, { useState } from 'react';
import { Button, Form, Input, Typography, Row, Col, message } from 'antd';
import axios from 'axios';

const { Title } = Typography;

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    surname: '',
    email: '',
    password: '',
  });
  const addData = () => {
    axios({
      method: "post",
      url: "https://v1.nocodeapi.com/yahay/google_sheets/FTSZzYvVegtGMAxl?tabId=sayfa1",
      data: [Object.values(formData)],
    })
      .then((response) => {
        // Registration successful
        message.success("Registration successful");
        setFormData({
            username: '',
            name: '',
            surname: '',
            email: '',
            password: '',
        });
      })
      .catch((error) => {
        // Registration failed
        message.error("Registration failed");
      });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <Row justify="center" align="middle" style={{ height: '100vh' }}>
      <Col>
        <div style={{ padding: '40px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', backgroundColor: '#fff' }}>
          <Title level={2} style={{ textAlign: 'center' }}>Register</Title>
          <Form 
          onFinish={addData} 
          autoComplete="off">
            <Form.Item label="Username" name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
              <Input name="username" value={formData.username} onChange={handleChange} />
            </Form.Item>

            <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input your name!' }]}>
              <Input name="name" value={formData.name} onChange={handleChange} />
            </Form.Item>

            <Form.Item label="Surname" name="surname" rules={[{ required: true, message: 'Please input your surname!' }]}>
              <Input  name="surname" value={formData.surname} onChange={handleChange} />
            </Form.Item>

            <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input your email!', type: 'email' }]}>
              <Input name="email" value={formData.email} onChange={handleChange} />
            </Form.Item>

            <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
              <Input.Password name="password" value={formData.password} onChange={handleChange} />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary"  htmlType="submit" style={{ width: '100%' }}>
                Register
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Col>
    </Row>
  );
};

export default Register;
