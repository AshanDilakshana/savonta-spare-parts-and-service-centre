import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../../Utils/config';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/AuthContext';
import * as Yup from 'yup';
import cusSwl from '../../../Utils/CustomSwal/CusSwal'
import Access from '../../../Components/AccessDenied/AccesDenid';
import { message } from 'antd';

const AddEmployee = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [nic, setNic] = useState('');
  const [age, setAge] = useState('');
  const [salary, setSalary] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    type: Yup.string().required('Employee type is required'),
    contact: Yup.string().required('Contact number is required'),
    address: Yup.string().required('Address is required'),
    nic: Yup.string().required('NIC number is required'),
    age: Yup.number().integer().positive().required('Age is required'),
    salary: Yup.number().positive().required('Salary is required'),
  });

  const handleTypeChange = (e) => {
    setType(e.target.value);
    let salaryValue;
    switch (e.target.value) {
      case 'detailer':
        salaryValue = '50000';
        break;
      case 'manager':
        salaryValue = '80000';
        break;
      case 'advisor':
        salaryValue = '85000';
        break;
      case 'technicians':
        salaryValue = '75000';
        break;
      case 'specialist':
        salaryValue = '88000';
        break;
      case 'administrative':
        salaryValue = '125000';
        break;
      default:
        salaryValue = '';
    }
    setSalary(salaryValue);
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await validationSchema.validate(
        {
          name,
          email,
          type,
          contact,
          address,
          nic,
          age,
          salary,
        },
        { abortEarly: false }
      );

      // Check if email already exists
    const emailResponse = await axios.get(`${BASE_URL}/employee/checkEmail/${email}`);
    if (emailResponse.data.exists) {
      message.error("Email already exists")
      setIsSubmitting(false);
      return;
    }

    // Check if NIC already exists
    const nicResponse = await axios.get(`${BASE_URL}/employee/checkNic/${nic}`);
    if (nicResponse.data.exists) {
      message.error("NIC already exists")
      setIsSubmitting(false);
      return;
    }

      const employeeData = {
        name,
        email,
        type,
        contact,
        address,
        nic,
        age,
        salary,
      };

      console.log('Submitting Employee data:', employeeData);
      const response = await axios.post(`${BASE_URL}/employee`, employeeData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
     
      console.log('Employee saved:', response.data);
      
      setName('');
      setEmail('');
      setType('');
      setContact('');
      setAddress('');
      setNic('');
      setSalary('');
      setAge('');

      
      toast.success('Employee saved successfully!');

    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errors = {};
        error.inner.forEach((validationError) => {
          errors[validationError.path] = validationError.message;
        });
        setFormErrors(errors);
        console.error('Validation errors:', errors);
        toast.error('Please fix the errors and try again.');
      } else {
        console.error('Error saving Employee:', error);
        if (error.response) {
          console.error('Server response:', error.response.data);
        }
        toast.error('Error submitting Employee. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (user.email !== 'admin@gmail.com') {
    return <Access/>;
}

  return (
    <Container className="Employee-container my-5 md-auto">
      <Row>
        <Col md={6} className="Employee-form mx-auto" style={{ backgroundColor: '#e6f7ff' }}>
          <h2>Add an Employee</h2>

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group controlId="name">
                  <Form.Label>Employee Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter employee name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="email">
                  <Form.Label>Employee Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter employee email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group controlId="type">
                  <Form.Label>Employee Type</Form.Label>
                  <Form.Control
                    as="select"
                    value={type}
                    onChange={handleTypeChange}
                    required
                  >
                    <option value="" disabled>
                      Select employee type
                    </option>
                    <option value="detailer">Detailer</option>
                    <option value="manager">Service Manager</option>
                    <option value="advisor">Service Advisor</option>
                    <option value="technicians">Technicians</option>
                    <option value="specialist">Parts Specialist</option>
                    <option value="administrative">Administrative Staff</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="contact">
                  <Form.Label>Contact Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter contact number"
                    onChange={(e) => setContact(e.target.value)}
                    value={contact}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group controlId="address">
                  <Form.Label>Employee Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter employee address"
                    onChange={(e) => setAddress(e.target.value)}
                    value={address}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group controlId="nic">
                  <Form.Label>NIC Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter employee nic"
                    onChange={(e) => setNic(e.target.value)}
                    value={nic}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="age">
                  <Form.Label>Employee age</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter employee age"
                    onChange={(e) => setAge(e.target.value)}
                    value={age}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group controlId="salary">
                  <Form.Label>Employee Salary in (LKR)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter salary"
                    onChange={(e) => setSalary(e.target.value)}
                    value={salary}
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>

            {Object.keys(formErrors).length > 0 && (
              <div className="mb-3 text-danger">
                {Object.values(formErrors).map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </div>
            )}

            <Button variant="primary" type="submit" className="mt-3" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Save Employee'}
            </Button>
                      <Button className=' btn-secondary mt-3 ml-3' onClick={() => navigate(-1)}>
                        <i className="fas fa-arrow-left mr-2"></i> Go back
                      </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default AddEmployee;