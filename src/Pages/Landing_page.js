import React from 'react';
import { Layout, Menu, Typography, Button, Card, Row, Col, Drawer } from 'antd';
import { HomeOutlined, LoginOutlined, UserAddOutlined, CalculatorOutlined, ArrowRightOutlined, MenuOutlined } from '@ant-design/icons';
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { useSpring, animated } from 'react-spring';
import Login from '../components/Auth/Login';
import Register from '../components/Register';
import Logged_in_page from './Logged_in_page';
import CalorieCalculator from '../components/CalorieCalculator';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

const DietHealthIllustration = () => {
  const animationProps = useSpring({
    from: { opacity: 0, transform: 'scale(0.8)' },
    to: { opacity: 1, transform: 'scale(1)' },
    config: { duration: 1000 },
  });

  return (
    <animated.svg style={animationProps} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
      <rect width="200" height="200" fill="#f0f8ff"/>
      <circle cx="100" cy="110" r="70" fill="#ffffff" stroke="#333333" stroke-width="3"/>
      <circle cx="70" cy="90" r="20" fill="#ff6347"/>
      <path d="M 70 70 Q 75 65, 80 70" fill="none" stroke="#2e8b57" stroke-width="2"/>
      <path d="M 110 100 L 130 80 L 150 100 Z" fill="#ffa500"/>
      <path d="M 130 80 L 130 70" fill="none" stroke="#2e8b57" stroke-width="2"/>
      <path d="M 40 150 L 60 130 M 50 150 L 70 130 M 60 150 L 80 130 M 70 130 L 70 180" fill="none" stroke="#333333" stroke-width="2"/>
      <path d="M 140 130 L 160 150 L 165 145 L 145 125 Z" fill="#333333"/>
      <line x1="140" y1="130" x2="120" y2="180" stroke="#333333" stroke-width="2"/>
      <path d="M 100 40 C 90 30, 80 40, 80 50 C 80 60, 100 70, 100 80 C 100 70, 120 60, 120 50 C 120 40, 110 30, 100 40" fill="#ff69b4"/>
    </animated.svg>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerVisible, setDrawerVisible] = React.useState(false);

  const handleMenuClick = ({ key }) => {
    if (key === "Logout") {
      navigate("/");
      console.log("User signed out");
    } else {
      navigate(key);
    }
    setDrawerVisible(false);
  };

  const fadeIn = useSpring({
    from: { opacity: 0, transform: 'translateY(50px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { duration: 1000 },
  });

  const HomeContent = () => (
    <div className="home-content">
      <Row gutter={[24, 24]} align="middle" justify="center" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <Col xs={24} lg={12}>
          <animated.div style={fadeIn}>
            <Title level={1}>Welcome to Diet List Creator</Title>
            <Paragraph>
              Create personalized diet plans, track your calories, and achieve your health goals with our easy-to-use platform.
            </Paragraph>
            <Button type="primary" size="large" icon={<ArrowRightOutlined />} onClick={() => navigate('/Register')}>
              Get Started
            </Button>
          </animated.div>
        </Col>
        <Col xs={24} lg={12}>
          <DietHealthIllustration />
        </Col>
      </Row>
      
      <Row gutter={[24, 24]} style={{ marginTop: '64px' }}>
        <Col span={24}>
          <animated.div style={fadeIn}>
            <Title level={2} style={{ textAlign: 'center' }}>Our Features</Title>
          </animated.div>
        </Col>
        {['Personalized Diet Plans', 'Calorie Calculator', 'Progress Tracking', 'Expert Nutritional Advice'].map((feature, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <animated.div style={{ ...fadeIn, delay: 200 * (index + 1) }}>
              <Card
                hoverable
                style={{ height: '100%' }}
                cover={<DietHealthIllustration />}
              >
                <Card.Meta title={feature} description="Lorem ipsum dolor sit amet, consectetur adipiscing elit." />
              </Card>
            </animated.div>
          </Col>
        ))}
      </Row>
    </div>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ position: 'fixed', zIndex: 1, width: '100%', padding: '0 24px' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <div style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>
              Diet List Creator
            </div>
          </Col>
          <Col xs={0} sm={16}>
            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={['/']}
              selectedKeys={[location.pathname]}
              onClick={handleMenuClick}
              style={{ justifyContent: 'flex-end' }}
            >
              <Menu.Item key="/" icon={<HomeOutlined />}>Home</Menu.Item>
              <Menu.Item key="/Login" icon={<LoginOutlined />}>Login</Menu.Item>
              <Menu.Item key="/Register" icon={<UserAddOutlined />}>Register</Menu.Item>
              <Menu.Item key="/User_health_info" icon={<CalculatorOutlined />}>Calorie Calculator</Menu.Item>
            </Menu>
          </Col>
          <Col xs={2} sm={0}>
            <Button type="primary" icon={<MenuOutlined />} onClick={() => setDrawerVisible(true)} />
          </Col>
        </Row>
      </Header>
      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
      >
        <Menu
          mode="vertical"
          defaultSelectedKeys={['/']}
          selectedKeys={[location.pathname]}
          onClick={handleMenuClick}
        >
          <Menu.Item key="/" icon={<HomeOutlined />}>Home</Menu.Item>
          <Menu.Item key="/Login" icon={<LoginOutlined />}>Login</Menu.Item>
          <Menu.Item key="/Register" icon={<UserAddOutlined />}>Register</Menu.Item>
          <Menu.Item key="/User_health_info" icon={<CalculatorOutlined />}>Calorie Calculator</Menu.Item>
        </Menu>
      </Drawer>
      <Content style={{ padding: '0 24px', marginTop: 64 }}>
        <Routes>
          <Route path="/" element={<HomeContent />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Logged_in_page" element={<Logged_in_page />} />
          <Route path="/User_health_info" element={<CalorieCalculator />} />
        </Routes>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Diet List Creator ©{new Date().getFullYear()} Created with Ant Design
      </Footer>
    </Layout>
  );
};


export default LandingPage;