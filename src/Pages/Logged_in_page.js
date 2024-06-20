import React from 'react';
import { Layout, Menu } from 'antd';
import { HomeOutlined, LogoutOutlined, HeartFilled } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import Logout from '../components/Auth/Logout';
import CalorieCalculator from '../components/CalorieCalculator';
import './Logged_in_page.css'; // Import the custom CSS

const { Header, Content } = Layout;

const Logged_in_page = () => {
  const navigate = useNavigate();

  return (
    <Layout className="main-layout">
      <Header className="header">
        <div className="menu">
          <Menu theme="light" mode="horizontal" selectable={false}>
            <Menu.Item key="home" icon={<HomeOutlined />} onClick={() => navigate('/')}>
              Home
            </Menu.Item>
          </Menu>
        </div>
        <div className="logout-container">
          <Logout />
        </div>
      </Header>
      <Content className="content">
        <CalorieCalculator />
      </Content>
    </Layout>
  );
};

export default Logged_in_page;
