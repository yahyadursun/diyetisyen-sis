import React, { useContext,useState } from 'react';
import { Button, Form, Input, Typography, Row, Col, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const { Title } = Typography;

const Login = () => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const navigate = useNavigate();

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
    <Row justify="center" align="middle" style={{ height: '100vh' }}>
      <Col>
        <div style={{ padding: '40px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', backgroundColor: '#fff' }}>
          <Title level={2} style={{ textAlign: 'center' }}>Login</Title>
          <Form
            onFinish={handleLogin}
            autoComplete="off"
          >
            <Form.Item label="Username" name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
              <Input name="username" value={formData.username} onChange={handleChange} />
            </Form.Item>

            <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
              <Input.Password name="password" value={formData.password} onChange={handleChange} />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                Login
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Col>
    </Row>
  );
};

export default Login;
