import React, { useState } from 'react';
import { Form, Input, Button, Typography, Row, Col, Select, Card, Divider, message } from 'antd';
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

  const AlertButton = () => {
    const showAlert = () => {
      message.success('Lists Mail Sended');
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
      message.success('User physique info Mail Sended');
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

  const makeBreakfastList = (breakfastcalorie) => {
    if (isFetching) return;
    setIsFetching(true);
    
    axios({
      method: 'get',
      url: 'https://v1.nocodeapi.com/yahay/google_sheets/KsgLmdaJtmoQSSWI?tabId=sayfa1',
    })
      .then((response) => {
        const meals = response.data.data;
  
        if (meals && meals.length > 0) {
          message.success('Apıye Breakfast ulaşıldı');
          const list = [];
          let totalCalories = 0;
          
          for (var i = 0; i < meals.length; i++) {
            let cal = parseInt(meals[i].Kalori_Miktari);
            if (totalCalories + cal <= breakfastcalorie+25) {
              list.push(meals[i]);
              totalCalories += cal;
            }
          }
          setBreakfastList(list);
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

  const makeLaunchList = (lunchcalorie) => {
    if (isFetching) return;
    setIsFetching(true);

    axios({
      method: 'get',
      url: 'https://v1.nocodeapi.com/yahay/google_sheets/pqHSFrSugOJqIfCt?tabId=sayfa1',
    })
      .then((response) => {
        const meals = response.data.data;
  
        if (meals && meals.length > 0) {
          message.success('Apıye launch ulaşıldı');
          const list = [];
          let totalCalories = 0;
          
          for (var i = 0; i < meals.length; i++) {
            let cal = parseInt(meals[i].Kalori_Miktari);
            if (totalCalories + cal <= lunchcalorie+25) {
              list.push(meals[i]);
              totalCalories += cal;
            }
          }
          setLunchList(list);
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
  
  const makeDinnerList = (dinnercalorie) => {
    if (isFetching) return;
    setIsFetching(true);

    axios({
      method: 'get',
      url: 'https://v1.nocodeapi.com/yahay/google_sheets/SUmYpLRIPwrUEijD?tabId=sayfa1',
    })
      .then((response) => {
        const meals = response.data.data;
  
        if (meals && meals.length > 0) {
          message.success('Apıye Dinner ulaşıldı');
          const list = [];
          let totalCalories = 0;
          
          for (var i = 0; i < meals.length; i++) {
            let cal = parseInt(meals[i].Kalori_Miktari);
            if (totalCalories + cal <= dinnercalorie+25) {
              list.push(meals[i]);
              totalCalories += cal;
            }
          }
          setDinnerList(list);
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
  
  const makeSnacksList = (snackscalorie) => {
    if (isFetching) return;
    setIsFetching(true);

    axios({
      method: 'get',
      url: 'https://v1.nocodeapi.com/yahay/google_sheets/AznBYZtifIeenXaf?tabId=sayfa1',
    })
      .then((response) => {
        const meals = response.data.data;
  
        if (meals && meals.length > 0) {
          message.success('Apıye Snacks ulaşıldı');
          const list = [];
          let totalCalories = 0;
          
          for (var i = 0; i < meals.length; i++) {
            let cal = parseInt(meals[i].Kalori_Miktari);
            if (totalCalories + cal <= snackscalorie) {
              list.push(meals[i]);
              totalCalories += cal;
            }
          }
          setSnacksList(list);
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

  return (
    <div className="calorie-calculator-container">
      <h1>Welcome, {username}!</h1>
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
                <Select className="select">
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
            <p><strong>Breakfast:</strong> {(calories * 0.25).toFixed(2)} kcal 
              <p><Button onClick={() => makeBreakfastList(calories * 0.25)}>
                makeBreakfastList
              </Button></p>
              {breakfastList.length > 0 && (
                <ul>
                  {breakfastList.map((meal, index) => (
                    <li key={index}>{meal.Besin}: {meal.Kalori_Miktari} kcal</li>
                  ))}
                </ul>
              )}
            </p>
            <p><strong>Lunch:</strong> {(calories * 0.30).toFixed(2)} kcal
              <p><Button onClick={() => makeLaunchList(calories * 0.30)}>
                makeLaunchList
              </Button></p>
              {lunchList.length > 0 && (
                <ul>
                  {lunchList.map((meal, index) => (
                    <li key={index}>{meal.Besin}: {meal.Kalori_Miktari} kcal</li>
                  ))}
                </ul>
              )}
            </p>
            <p><strong>Dinner:</strong> {(calories * 0.30).toFixed(2)} kcal
              <p><Button onClick={() => makeDinnerList(calories * 0.30)}>
                makeDinnerList
              </Button></p>
              {dinnerList.length > 0 && (
                <ul>
                  {dinnerList.map((meal, index) => (
                    <li key={index}>{meal.Besin}: {meal.Kalori_Miktari} kcal</li>
                  ))}
                </ul>
              )}
            </p>
            <p><strong>Snacks:</strong> {(calories * 0.15).toFixed(2)} kcal
              <p><Button onClick={() => makeSnacksList(calories * 0.15)}>
                makeSnacksList
              </Button></p>
              {snacksList.length > 0 && (
                <ul>
                  {snacksList.map((meal, index) => (
                    <li key={index}>{meal.Besin}: {meal.Kalori_Miktari} kcal</li>
                  ))}
                </ul>
              )}
            </p>
            <p><strong>Daily Calorie Requirement:</strong> {calories} kcal</p>
            <p><AlertButton></AlertButton></p>
            <p><AlertButtonUser_info></AlertButtonUser_info></p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CalorieCalculator;
