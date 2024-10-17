import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, CardBody, CardTitle, CardText, Button, Form, FormGroup, Label, Input, Table } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaIdCard, FaCalendarCheck, FaCalendarAlt, FaIdBadge, FaSignOutAlt, FaCommentAlt, FaList } from 'react-icons/fa';
import axios from 'axios';
import { BASE_URL } from '../../Utils/config';
import '../../Styles/EmployeeProfile.css'
import {message} from 'antd'
const EmployeeProfile = () => {
  const [email, setEmail] = useState('');
  const [nic, setNic] = useState('');
  const [attendance, setAttendance] = useState('');
  const [leaveDate, setLeaveDate] = useState('');
  const [reason, setReason] = useState('');
  const navigate = useNavigate();
  const [employeeId, setEmployeeId] = useState('');

  useEffect(() => {
    const storedEmail = localStorage.getItem('employeeEmail');
    const storedNic = localStorage.getItem('employeeNic');
    const storedEmployeeId = localStorage.getItem('employeeId');
  
    if (storedEmail && storedNic && storedEmployeeId) {
      setEmail(storedEmail);
      setNic(storedNic);
      setEmployeeId(storedEmployeeId);
    } else {
      navigate('/employeeLogin');
    }
  }, [navigate]);
  
  const handleLogout = () => {
    localStorage.removeItem('employeeEmail');
    localStorage.removeItem('employeeNic');
    localStorage.removeItem('employeeId');
    navigate('/employeeLogin');
  };
  const handleAttendance = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/employee/${employeeId}`, { attendance });
      message.success("Attendance marked successfully!");
    } catch (error) {
      console.error('Error marking attendance:', error);
      message.error('Failed to mark attendance');
    }
  };
  
  const handleLeaveRequest = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/employee/${employeeId}`, { leaveDate, reason });
      message.success("Leave request submitted successfully!");
      setReason('')
      setLeaveDate('');
    } catch (error) {
      console.error('Error submitting leave request:', error);
      message.error('Failed to submit leave request');
    }
  };
    return (
      <div className="employee-profile-container">
        <Container fluid>
          <Row>
            <Col md={4}>
              <Card className="employee-profile-card">
                <CardBody>
                  <CardTitle tag="h2" className="text-center mb-4">
                    <FaUser className="profile-icon" />
                    Employee Profile
                  </CardTitle>
                  <div className="employee-info">
                    <CardText>
                      <FaIdBadge className="info-icon" />
                      <strong>Employee ID:</strong> {employeeId}
                    </CardText>
                    <CardText>
                      <FaEnvelope className="info-icon" />
                      <strong>Email:</strong> {email}
                    </CardText>
                    <CardText>
                      <FaIdCard className="info-icon" />
                      <strong>NIC:</strong> {nic}
                    </CardText>
                  </div>
                  <Button color="danger" block onClick={handleLogout} className="logout-btn">
                    <FaSignOutAlt className="me-2" />
                    Logout
                  </Button>
                </CardBody>
              </Card>
            </Col>
            <Col md={8}>
              <Card className="employee-profile-card">
                <CardBody>
                  <Form onSubmit={handleAttendance} className="mb-4">
                    <FormGroup>
                      <Label for="attendance" className="d-flex align-items-center">
                        <FaCalendarCheck className="form-icon" />
                        Mark Attendance
                      </Label>
                      <Input
                        type="select"
                        name="attendance"
                        id="attendance"
                        value={attendance}
                        onChange={(e) => setAttendance(e.target.value)}
                        required
                      >
                        <option value="">Select</option>
                        <option value="yes">Present</option>
                        <option value="no">Absent</option>
                      </Input>
                    </FormGroup>
                    <Button color="primary" type="submit" block className="mt-2">Mark Attendance</Button>
                  </Form>
                  <Form onSubmit={handleLeaveRequest} className="mb-4">
                    <FormGroup>
                      <Label for="leaveDate" className="d-flex align-items-center">
                        <FaCalendarAlt className="form-icon" />
                        Request Leave
                      </Label>
                      <div className="input-group mb-3">
                        <span className="input-group-text">
                          <FaCommentAlt />
                        </span>
                        <Input
                          type="text"
                          name="reason"
                          id="reason"
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          placeholder="Enter reason for leave"
                          required
                        />
                      </div>
                      <div className="input-group mb-3">
                        <span className="input-group-text">
                          <FaCalendarAlt />
                        </span>
                        <Input
                          type="date"
                          name="leaveDate"
                          id="leaveDate"
                          value={leaveDate}
                          onChange={(e) => setLeaveDate(e.target.value)}
                          required
                        />
                      </div>
                    </FormGroup>
                    <Button color="info" type="submit" block className="mt-2">Request Leave</Button>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  };

export default EmployeeProfile;
