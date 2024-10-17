import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

import axios from 'axios';
import { BASE_URL } from '../../../Utils/config';
import { useAuth } from '../../../context/AuthContext';
import Toaster from '../../../Utils/Toaster';

const EditEmployee = () => {
  const { user } = useAuth();
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [nic, setNic] = useState('');
  const [age, setAge] = useState('');
  const [salary, setSalary] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        console.log(employeeId);
        const response = await axios.get(`${BASE_URL}/employee/${employeeId}`);
        setEmployee(response.data);
        setName(response.data.name);
        setEmail(response.data.email);
        setType(response.data.type);
        setContact(response.data.contact);
        setAddress(response.data.address);
        setNic(response.data.nic);
        setSalary(response.data.salary);
        setAge(response.data.age);
      } catch (error) {
        console.error('Error fetching employee details:', error);
        Toaster.justToast('error', 'Failed to fetch employee details');
      }
    };

    fetchEmployeeDetails();
  }, [employeeId]);

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
      const updatedEmployee = {
          name,
          email,
          type,
          contact,
          address,
          nic,
          age,
          salary,
      };

      await axios.post(`${BASE_URL}/employee/${employeeId}`, updatedEmployee);
      Toaster.justToast('success', 'Employee updated successfully');
      navigate('/adminProfile');
    } catch (error) {
      console.error('Error updating employee:', error);
      Toaster.justToast('error', 'Failed to update employee');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="container my-5">
      <h2>Edit Employee</h2>
      {employee && (
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

            <button type="submit" className="btn btn-primary mr-2" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
      </Form>
      )}
    </div>
  );
};

export default EditEmployee;
