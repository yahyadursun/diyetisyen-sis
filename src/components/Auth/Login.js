import React, { useContext, useState } from 'react';
import { Button, Form, Input, Typography, Row, Col, message, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { useSpring, animated } from 'react-spring';
import './Login.css';

const { Title } = Typography;

const Login = () => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const navigate = useNavigate();

  const fadeIn = useSpring({
    from: { opacity: 0, transform: 'translateY(50px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { duration: 1000 },
  });

  const handleLogin = () => {
    axios({
      method: 'get',
      url: 'https://v1.nocodeapi.com/yahay/google_sheets/FTSZzYvVegtGMAxl?tabId=sayfa1',
    })
      .then((response) => {
        const users = response.data.data;
        const user = users.find(user => user.username === formData.username && user.password === formData.password);

        if (user) {
          message.success('Login successful');
          login(); // Set the auth state to true
          localStorage.setItem('username', formData.username); // Set the username in localStorage
          navigate('/Logged_in_page');
        } else {
          message.error('Invalid username or password');
        }
      })
      .catch(() => {
        message.error('Login failed');
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <Row justify="center" align="middle" className="login-container">
      <Col xs={22} sm={16} md={12} lg={8}>
        <animated.div style={fadeIn}>
          <Card className="login-card" hoverable>
            <Title level={2} className="login-title">Welcome Back</Title>
            <Form
              onFinish={handleLogin}
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
                <Button type="primary" htmlType="submit" size="large" className="login-button" block>
                  Log in
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </animated.div>
      </Col>
    </Row>
  );
};

export default Login;