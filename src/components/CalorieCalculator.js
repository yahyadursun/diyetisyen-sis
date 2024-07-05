import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, Row, Col, Select, Card, Divider, message, Modal, Checkbox, Spin } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const { Title } = Typography;
const { Option } = Select;

const CalorieCalculator = () => {
  const [form] = Form.useForm();
  const [bmi, setBMI] = useState(null);
  const [calories, setCalories] = useState(null);
  const [bmiCategory, setBMICategory] = useState('');
  const [username, setUsername] = useState('');
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    age: '',
  });

  const [isFetching, setIsFetching] = useState(false);
  const [mealLists, setMealLists] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
  });
  const [visibleModal, setVisibleModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [mealOptions, setMealOptions] = useState([]);
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [totalSelectedCalories, setTotalSelectedCalories] = useState(0);
  const [calorieLimit, setCalorieLimit] = useState(0);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const calculateCalories = (values) => {
    const { weight, height, age, gender } = values;

    const calculatedBMI = weight / ((height / 100) * (height / 100));
    setBMI(calculatedBMI.toFixed(2));

    let category = '';
    if (calculatedBMI < 18.5) category = 'Underweight';
    else if (calculatedBMI >= 18.5 && calculatedBMI <= 24.9) category = 'Normal weight';
    else if (calculatedBMI >= 25 && calculatedBMI <= 29.9) category = 'Overweight';
    else category = 'Obese';
    setBMICategory(category);

    const bmr = gender === 'male'
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

    const calculatedCalories = bmr * (calculatedBMI < 18.5 ? 1.2 : calculatedBMI <= 24.9 ? 1.375 : calculatedBMI <= 29.9 ? 1.55 : 1.725);

    setCalories(calculatedCalories.toFixed(2));
    addData(values);
  };

  const addData = (values) => {
    const dataToAdd = { ...values, username };
    axios.post("https://v1.nocodeapi.com/yahay/google_sheets/gqWwMrQxAsUTFzRo?tabId=sayfa1", [Object.values(dataToAdd)])
      .then(() => message.success("Data added successfully"))
      .catch((error) => {
        console.error('Error adding data:', error);
        message.error("Failed to add data");
      });
  };

  const onFinish = (values) => {
    calculateCalories(values);
  };

  const fetchMeals = (url, type) => {
    if (isFetching) return;
    setIsFetching(true);
    const limitCalories = calories * (type === 'Breakfast' ? 0.25 : type === 'Snacks' ? 0.15 : 0.30);
    setCalorieLimit((limitCalories + 25).toFixed(2));

    axios.get(url)
      .then((response) => {
        const meals = response.data.data;
        if (meals && meals.length > 0) {
          setMealOptions(meals);
          setModalType(type);
          setVisibleModal(true);
        } else {
          message.error('No meals found or invalid data');
        }
      })
      .catch(() => message.error('Failed to fetch meals'))
      .finally(() => setIsFetching(false));
  };

  const handleMealSelection = (selected) => {
    const totalCalories = selected.reduce((sum, meal) => sum + parseInt(meal.Kalori_Miktari), 0);
    if (totalCalories <= calorieLimit) {
      setSelectedMeals(selected);
      setTotalSelectedCalories(totalCalories);
    } else {
      message.error('Selected meals exceed the calorie limit!');
    }
  };

  const handleModalOk = () => {
    setMealLists(prev => ({ ...prev, [modalType.toLowerCase()]: selectedMeals }));
    setVisibleModal(false);
    setSelectedMeals([]);
    setTotalSelectedCalories(0);
  };

  const handleModalCancel = () => {
    setVisibleModal(false);
    setSelectedMeals([]);
    setTotalSelectedCalories(0);
  };

  const sendEmail = (type) => {
    // Implement email sending logic here
    message.success(`${type} sent as an email`);
  };

  const mealData = [
    { name: 'Breakfast', calories: calories ? calories * 0.25 : 0 },
    { name: 'Lunch', calories: calories ? calories * 0.30 : 0 },
    { name: 'Dinner', calories: calories ? calories * 0.30 : 0 },
    { name: 'Snacks', calories: calories ? calories * 0.15 : 0 },
  ];

  return (
    <div className="calorie-calculator-container">
      <Title level={2}>Welcome {username}!</Title>
      <Card className="calorie-calculator-card" bordered={false}>
        <Title level={3}>Daily Calorie Calculator</Title>
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Row gutter={[16, 16]}>
            {['weight', 'height', 'age'].map(field => (
              <Col xs={24} sm={12} md={8} key={field}>
                <Form.Item
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  name={field}
                  rules={[{ required: true, message: `Please input your ${field}!` }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            ))}
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                label="Gender"
                name="gender"
                initialValue="male"
                rules={[{ required: true, message: 'Please select your gender!' }]}
              >
                <Select>
                  <Option value="male">Male</Option>
                  <Option value="female">Female</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Calculate
            </Button>
          </Form.Item>
        </Form>
        
        {calories && (
          <>
            <Divider />
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card title="Results" bordered={false}>
                  <p><strong>Body Mass Index (BMI):</strong> {bmi}</p>
                  <p><strong>Weight Category:</strong> {bmiCategory}</p>
                  <p><strong>Daily Calorie Requirement:</strong> {calories} kcal</p>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card title="Calorie Distribution" bordered={false}>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={mealData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="calories" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
            </Row>
            
            <Divider />
            <Title level={4}>Meal Planning</Title>
            <Row gutter={[16, 16]}>
              {['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map(meal => (
                <Col xs={24} sm={12} md={6} key={meal}>
                  <Card 
                    title={`${meal} (${(calories * (meal === 'Snacks' ? 0.15 : meal === 'Breakfast' ? 0.25 : 0.30)).toFixed(2)} kcal)`} 
                    extra={<Button onClick={() => fetchMeals(`https://v1.nocodeapi.com/yahay/google_sheets/KsgLmdaJtmoQSSWI?tabId=sayfa1`, meal)}>Plan</Button>}
                    style={{ height: '100%' }}
                  >
                    {mealLists[meal.toLowerCase()].length > 0 ? (
                      <ul>
                        {mealLists[meal.toLowerCase()].map((item, index) => (
                          <li key={index}>{item.Besin}: {item.Porsiyon_Miktari} - {item.Kalori_Miktari} kcal</li>
                        ))}
                      </ul>
                    ) : (
                      <p>No meals planned yet</p>
                    )}
                  </Card>
                </Col>
              ))}
            </Row>
            
            <Divider />
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Button onClick={() => sendEmail('Meal lists')} block>
                  Send Meal Lists As Email
                </Button>
              </Col>
              <Col xs={24} sm={12}>
                <Button onClick={() => sendEmail('Physique info')} block>
                  Send Physique Info As Email
                </Button>
              </Col>
            </Row>
          </>
        )}
      </Card>
      
      <Modal
        title={`Select ${modalType}`}
        visible={visibleModal}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Save"
        cancelText="Cancel"
      >
        <p>Calorie Limit: {calorieLimit} kcal</p>
        <Checkbox.Group
          value={selectedMeals}
          onChange={handleMealSelection}
        >
          {mealOptions.map((meal) => (
            <Checkbox key={meal.Besin} value={meal}>
              {meal.Besin}: {meal.Porsiyon_Miktari} - {meal.Kalori_Miktari} kcal
            </Checkbox>
          ))}
        </Checkbox.Group>
        <p>Total Calories: {totalSelectedCalories} kcal</p>
      </Modal>
    </div>
  );
};

export default CalorieCalculator;