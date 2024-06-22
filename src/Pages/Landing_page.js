import React from 'react';
import { Layout, Menu} from 'antd';
import { HomeOutlined, LoginOutlined, UserAddOutlined, LogoutOutlined, HeartFilled } from '@ant-design/icons';
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
      // Implement sign-out functionality here
      navigate("/")
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
        </Menu>
      </Sider>
      <Layout>
        <Header className="site-layout-background" style={{ padding: 0 }}>
          {/* You can add a header logo or title here if needed */}
        </Header>
        <Content style={{ margin: '16px' }}>
          <Routes>
            <Route path="/" element={<div style={{
                backgroundImage: 'url(background.png)',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: '',
                width: '100%',
                height: '100vh',
                margin: '0',
                padding: '0', 
                alignContent:'center'// Yazıyı eklemek ortalamk için
            }}>
              <h1 style={{
                fontSize: '4vw', // Responsive font boyutu için
                fontWeight: 'bold',
                color: '#4A90E2',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
                padding: '20px',
                borderRadius: '10px',
                textAlign: 'center',
                backgroundColor: 'rgba(240, 248, 255, 0.4)', // Yarı saydam arka plan
                margin: '0 auto', // Ortalamak için
                maxWidth: '50%', // Mobil cihazlar için kenarlardan taşmaması
                boxSizing: 'border-box', // Padding dahil hesaplama
      
              }}>
                Welcome to your Diet List Creator, Please Login to continue
              </h1>
            </div>} />
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
