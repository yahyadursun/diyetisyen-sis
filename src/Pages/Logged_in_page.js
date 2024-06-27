import React from 'react';
import { Layout, Menu } from 'antd';
import Logout from '../components/Auth/Logout';
import CalorieCalculator from '../components/CalorieCalculator';
import './Logged_in_page.css'; // Import the custom CSS

const { Header, Content } = Layout;

const Logged_in_page = () => {

  return (
    <Layout className="main-layout">
      <Header className="header">
        <div className="menu">
          <Menu theme="light" mode="horizontal" selectable={false}>
            <Menu.Item >
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
