import React from 'react';
import { Layout, Menu, Typography } from 'antd';
import { UserOutlined, CalculatorOutlined } from '@ant-design/icons';
import Logout from '../components/Auth/Logout';
import CalorieCalculator from '../components/CalorieCalculator';
import './Logged_in_page.css';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const Logged_in_page = () => {
  return (
    <Layout className="main-layout">
      <Header className="header">
        <div className="logo">
          <Title level={3} style={{ color: 'white', margin: 0 }}>Calorie Calculator</Title>
        </div>
        <div className="logout-container">
          <Logout />
        </div>
      </Header>
      <Layout>
        <Sider
          width={200}
          className="site-layout-background"
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={broken => {
            console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type);
          }}
        >
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%', borderRight: 0 }}
          >
            <Menu.Item key="1" icon={<CalculatorOutlined />}>
              Calorie Calculator
            </Menu.Item>
            <Menu.Item key="2" icon={<UserOutlined />}>
              Profile
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Content
            className="site-layout-background"
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
            <CalorieCalculator />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Logged_in_page;