import React, { useState } from 'react';
import { Button, Form, Input, Typography, Row, Col, message, Card } from 'antd';
import axios from 'axios';
import './Register.css'; // Import the custom CSS for styling

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
    <Row justify="center" align="middle" className="register-container">
      <Col xs={22} sm={16} md={12} lg={8}>
        <Card className="register-card">
          <Title level={2} className="register-title">Register</Title>
          <Form
            onFinish={addData}
            autoComplete="off"
            layout="vertical"
            style={{ marginTop: '20px' }}
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input
                name="username"
                value={formData.username}
                onChange={handleChange}
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Please input your name!' }]}
            >
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Surname"
              name="surname"
              rules={[{ required: true, message: 'Please input your surname!' }]}
            >
              <Input
                name="surname"
                value={formData.surname}
                onChange={handleChange}
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Please input your email!', type: 'email' }]}
            >
              <Input
                name="email"
                value={formData.email}
                onChange={handleChange}
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password
                name="password"
                value={formData.password}
                onChange={handleChange}
                size="large"
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" size="large" className="register-button">
                Register
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default Register;
