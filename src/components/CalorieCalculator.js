// CalorieCalculator.js

import React, { useState } from 'react';
import { Form, Input, Button, Typography, Row, Col, Select, Card, Divider, message, Modal, Checkbox } from 'antd';
import './CalorieCalculator.css'; // Import custom CSS for styling
import axios from 'axios';

const { Title } = Typography;
const { Option } = Select;

const CalorieCalculator = () => {
  const [form] = Form.useForm();
  const [bmi, setBMI] = useState(null);
  const [calories, setCalories] = useState(null);
  const [bmiCategory, setBMICategory] = useState('');
  const username = localStorage.getItem('username');
  const [formData, setFormData] = useState({
    username: username,
    weight: '',
    height: '',
    age: '',
  });

  const [isFetching, setIsFetching] = useState(false);
  const [breakfastList, setBreakfastList] = useState([]);
  const [lunchList, setLunchList] = useState([]);
  const [dinnerList, setDinnerList] = useState([]);
  const [snacksList, setSnacksList] = useState([]);
  const [visibleModal, setVisibleModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [mealOptions, setMealOptions] = useState([]);
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [totalSelectedCalories, setTotalSelectedCalories] = useState(0);
  const [calorieLimit, setCalorieLimit] = useState(0);
  const [disabledOptions, setDisabledOptions] = useState([]);

  const AlertButton = () => {
    const showAlert = () => {
      message.success('Lists Mail Sent');
    };

    return (
      <div className="alert-button-container">
        <Button type="primary" onClick={showAlert}>
          Send Lists As A Mail
        </Button>
      </div>
    );
  };

  const AlertButtonUser_info = () => {
    const showAlert = () => {
      message.success('User physique info Mail Sent');
    };

    return (
      <div className="alert-button-container">
        <Button type="primary" onClick={showAlert}>
          Send Physique Info Mail
        </Button>
      </div>
    );
  };

  const validateInputs = () => {
    try {
      form.validateFields();
      return true;
    } catch (error) {
      message.error('Please enter valid values for weight, height, and age.');
      return false;
    }
  };

  const calculateCalories = (values) => {
    const { weight, height, age, gender } = values;

    const calculatedBMI = weight / ((height / 100) * (height / 100));
    setBMI(calculatedBMI.toFixed(2));

    let category = '';
    if (calculatedBMI < 18.5) {
      category = 'Underweight';
    } else if (calculatedBMI >= 18.5 && calculatedBMI <= 24.9) {
      category = 'Normal weight';
    } else if (calculatedBMI >= 25 && calculatedBMI <= 29.9) {
      category = 'Overweight';
    } else {
      category = 'Obese';
    }
    setBMICategory(category);

    const bmr = gender === 'male'
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

    const calculatedCalories =
      calculatedBMI < 18.5
        ? bmr * 1.2
        : calculatedBMI >= 18.5 && calculatedBMI <= 24.9
        ? bmr * 1.375
        : calculatedBMI >= 25 && calculatedBMI <= 29.9
        ? bmr * 1.55
        : bmr * 1.725;

    setCalories(calculatedCalories.toFixed(2));

    addData();
  };

  const addData = () => {
    axios({
      method: "post",
      url: "https://v1.nocodeapi.com/yahay/google_sheets/gqWwMrQxAsUTFzRo?tabId=sayfa1",
      data: [Object.values(formData)],  // Fix the format here
    })
      .then((response) => {
        console.log(response);  // Log the response for debugging
        message.success("Data added successfully");
      })
      .catch((error) => {
        console.error('Error adding data:', error.response ? error.response.data : error.message);  // Log detailed error
        message.error("Failed to add data");
      });
  };

  const onFinish = (values) => {
    if (validateInputs()) {
      calculateCalories(values);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const fetchMeals = (url, type, limitCalories) => {
    if (isFetching) return;
    setIsFetching(true);
    setCalorieLimit((limitCalories + 25).toFixed(2)); // Set calorie limit for the modal // additional +25 calorie for making things easy

    axios({
      method: 'get',
      url,
    })
      .then((response) => {
        const meals = response.data.data;

        if (meals && meals.length > 0) {
          message.success(`API fetched for ${type}`);
          setMealOptions(meals);
          setModalType(type);
          setVisibleModal(true);
        } else {
          message.error('No meals found or invalid data');
        }
      })
      .catch(() => {
        message.error('Login failed');
      })
      .finally(() => {
        setIsFetching(false);
      });
  };

  const handleMealSelection = (selected) => {
    let totalCalories = 0;
    selected.forEach(meal => {
      totalCalories += parseInt(meal.Kalori_Miktari);
    });

    if (totalCalories <= calorieLimit) {
      setSelectedMeals(selected);
      setTotalSelectedCalories(totalCalories);
      setDisabledOptions([]);
    } else {
      message.error('Selected meals exceed the calorie limit!');
      const disabledMealLabels = selected.filter(meal => !selectedMeals.includes(meal)).map(meal => meal.Besin);
      setDisabledOptions(disabledMealLabels);
    }
  };

  const handleOk = () => {
    if (modalType === 'Breakfast') {
      setBreakfastList(selectedMeals);
    } else if (modalType === 'Lunch') {
      setLunchList(selectedMeals);
    } else if (modalType === 'Dinner') {
      setDinnerList(selectedMeals);
    } else if (modalType === 'Snacks') {
      setSnacksList(selectedMeals);
    }
    setVisibleModal(false);
    setSelectedMeals([]);
    setTotalSelectedCalories(0);
  };

  const handleCancel = () => {
    setVisibleModal(false);
    setSelectedMeals([]);
    setTotalSelectedCalories(0);
  };

  return (
    <div className="calorie-calculator-container">
      <h1>Welcome {username}!</h1>
      <Card className="calorie-calculator-card" bordered={false}>
        <Title level={3} className="title">Daily Calorie Calculator</Title>
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Row gutter={[16, 16]} className="input-row">
            <Col xs={24} sm={12} md={6}>
              <Form.Item
                label="Weight (kg)"
                name="weight"
                rules={[{ required: true, message: 'Please input your weight!' }]}
              >
                <Input name="weight" value={formData.weight} onChange={handleChange} className="input-number" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item
                label="Height (cm)"
                name="height"
                rules={[{ required: true, message: 'Please input your height!' }]}
              >
                <Input name="height" value={formData.height} onChange={handleChange} className="input-number" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item
                label="Age"
                name="age"
                rules={[{ required: true, message: 'Please input your age!' }]}
              >
                <Input name="age" value={formData.age} onChange={handleChange} className="input-number" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
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
          <Divider />
          <Form.Item>
            <Button type="primary" htmlType="submit" className="calculate-button">
              Calculate
            </Button>
          </Form.Item>
        </Form>
        {bmi && (
          <div className="result">
            <p><strong>Body Mass Index (BMI):</strong> {bmi}</p>
            <p><strong>Weight Category:</strong> {bmiCategory}</p>
          </div>
        )}
        {calories && (
          <div className="result">
            <div>
            <p><strong>Breakfast:</strong> {(calories * 0.25).toFixed(2)} kcal 
              <p><Button onClick={() => fetchMeals('https://v1.nocodeapi.com/yahay/google_sheets/KsgLmdaJtmoQSSWI?tabId=sayfa1', 'Breakfast', calories * 0.25)} className="calculate-button">
                Make Breakfast List
              </Button></p>
              {breakfastList.length > 0 && (
                <ul style={{ fontSize: '15px' }}>
                  {breakfastList.map((meal, index) => (
                    <li key={index}>{meal.Besin}: {meal.Porsiyon_Miktari}: {meal.Kalori_Miktari} kcal</li>
                  ))}
                </ul>
              )}
            </p>
            </div>
            <div><p><strong>Lunch:</strong> {(calories * 0.30).toFixed(2)} kcal
              <p><Button onClick={() => fetchMeals('https://v1.nocodeapi.com/yahay/google_sheets/pqHSFrSugOJqIfCt?tabId=sayfa1', 'Lunch', calories * 0.30)} className="calculate-button">
                Make Lunch List
              </Button></p>
              {lunchList.length > 0 && (
                <ul style={{ fontSize: '15px' }}>
                  {lunchList.map((meal, index) => (
                    <li key={index}>{meal.Besin}: {meal.Porsiyon_Miktari}:  {meal.Kalori_Miktari} kcal</li>
                  ))}
                </ul>
              )}
            </p>
            </div>
            <div>
            <p><strong>Dinner:</strong> {(calories * 0.30).toFixed(2)} kcal
              <p><Button onClick={() => fetchMeals('https://v1.nocodeapi.com/yahay/google_sheets/SUmYpLRIPwrUEijD?tabId=sayfa1', 'Dinner', calories * 0.30)} className="calculate-button">
                Make Dinner List
              </Button></p>
              {dinnerList.length > 0 && (
                <ul style={{ fontSize: '15px' }}>
                  {dinnerList.map((meal, index) => (
                    <li key={index}>{meal.Besin}:  {meal.Porsiyon_Miktari}:  {meal.Kalori_Miktari} kcal</li>
                  ))}
                </ul>
              )}
            </p>
            </div>
            <div>
            <p><strong>Snacks:</strong> {(calories * 0.15).toFixed(2)} kcal
              <p><Button onClick={() => fetchMeals('https://v1.nocodeapi.com/yahay/google_sheets/AznBYZtifIeenXaf?tabId=sayfa1', 'Snacks', calories * 0.15)} className="calculate-button">
                Make Snacks List
              </Button></p>
              {snacksList.length > 0 && (
                <ul style={{ fontSize: '15px' }}>
                  {snacksList.map((meal, index) => (
                    <li key={index}>{meal.Besin}:  {meal.Porsiyon_Miktari}:  {meal.Kalori_Miktari} kcal</li>
                  ))}
                </ul>
              )}
            </p>
            </div>
            <p><strong>Daily Calorie Requirement:</strong> {calories} kcal</p>
            <p><AlertButton></AlertButton></p>
            <p><AlertButtonUser_info></AlertButtonUser_info></p>
          </div>
        )}
      </Card>
      <Modal
        title={`Select ${modalType}`}
        visible={visibleModal}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Save"
        cancelText="Cancel"
      >
        <p>Calorie Limit: {calorieLimit} kcal</p>
        <Checkbox.Group
          value={selectedMeals}
          onChange={handleMealSelection}
        >
          {mealOptions.map((meal) => (
            <Checkbox 
              key={meal.Besin} 
              value={meal} 
              disabled={disabledOptions.includes(meal.Besin)}
            >
              {<p>{meal.Besin}: {meal.Porsiyon_Miktari}: {meal.Kalori_Miktari} kcal</p>}
            </Checkbox>
          ))}
        </Checkbox.Group>
        <p>Total Calories: {totalSelectedCalories} kcal</p>
      </Modal>
    </div>
  );
};

export default CalorieCalculator;
