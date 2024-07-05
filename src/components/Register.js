import React, { useState } from 'react';
import { Button, Form, Input, Typography, Row, Col, message, Card } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useSpring, animated } from 'react-spring';
import './Register.css';

const { Title } = Typography;

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    surname: '',
    email: '',
    password: '',
  });

  const fadeIn = useSpring({
    from: { opacity: 0, transform: 'translateY(50px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { duration: 1000 },
  });

  const addData = () => {
    axios({
      method: "post",
      url: "https://v1.nocodeapi.com/yahay/google_sheets/FTSZzYvVegtGMAxl?tabId=sayfa1",
      data: [Object.values(formData)],
    })
      .then((response) => {
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
        <animated.div style={fadeIn}>
          <Card className="register-card" hoverable>
            <Title level={2} className="register-title">Join Us Today</Title>
            <Form
              onFinish={addData}
              autoComplete="off"
              layout="vertical"
              style={{ marginTop: '20px' }}
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: 'Please input your username!' }]}
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="name"
                rules={[{ required: true, message: 'Please input your name!' }]}
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  name="name"
                  placeholder="First Name"
                  value={formData.name}
                  onChange={handleChange}
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="surname"
                rules={[{ required: true, message: 'Please input your surname!' }]}
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  name="surname"
                  placeholder="Last Name"
                  value={formData.surname}
                  onChange={handleChange}
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="email"
                rules={[{ required: true, message: 'Please input your email!', type: 'email' }]}
              >
                <Input
                  prefix={<MailOutlined className="site-form-item-icon" />}
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input.Password
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  size="large"
                />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" size="large" className="register-button" block>
                  Register
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </animated.div>
      </Col>
    </Row>
  );
};

export default Register;