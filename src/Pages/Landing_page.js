import React from 'react';
import { Layout, Menu } from 'antd';
import { HomeOutlined, LoginOutlined, UserAddOutlined, CalculatorOutlined } from '@ant-design/icons';
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import Login from '../components/Auth/Login';
import Register from '../components/Register';
import Logged_in_page from './Logged_in_page';
import CalorieCalculator from '../components/CalorieCalculator';
import './Landing_page.css'; // Import custom CSS for styling

const { Sider, Content, Header } = Layout;

const LandingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick = ({ key }) => {
    if (key === "Logout") {
      navigate("/");
      console.log("User signed out");
    } else {
      navigate(key);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible>
        <Menu
          onClick={handleMenuClick}
          defaultSelectedKeys={[location.pathname]}
          selectedKeys={[location.pathname]}
          mode="inline"
          theme="dark"
        >
          <Menu.Item key="/" icon={<HomeOutlined />}>Home</Menu.Item>
          <Menu.Item key="/Login" icon={<LoginOutlined />}>Login</Menu.Item>
          <Menu.Item key="/Register" icon={<UserAddOutlined />}>Register</Menu.Item>
          <Menu.Item key="/User_health_info" icon={<CalculatorOutlined />}>Calorie Calculator</Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header className="site-layout-background">
          {/* Add a header logo or title here if needed */}
        </Header>
        <Content className="site-content">
          <Routes>
            <Route path="/" element={
              <div className="home-container">
                <div className="overlay"></div>
                <div className="welcome-message">
                  Welcome to the Diet List Creator. Please navigate using the sidebar.
                </div>
              </div>
            } />
            <Route path="/Login" element={<Login />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/Logged_in_page" element={<Logged_in_page />} />
            <Route path="/User_health_info" element={<CalorieCalculator />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default LandingPage;
