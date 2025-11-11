import React, { useState } from 'react';
import { Form, Row, Col, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { createMember } from '../../features/members/membersAPI';

const AddMember = () => {
  const [loading, setLoading] = useState(false);
  const [memberType, setMemberType] = useState('student');
  
  const [formData, setFormData] = useState({
    memberType: 'student',
    name: '',
    fatherName: '',
    memberNumber: '',
    course: '',
    yearOfJoining: new Date().getFullYear(),
    mobile: '',
    email: '',
    address: '',
    photo: '',
  });

  const courses = ["MTECH", "MCA", "MBA"];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMemberTypeChange = (type) => {
    setMemberType(type);
    setFormData(prev => ({ 
      ...prev, 
      memberType: type,
      memberNumber: '',
      course: '',
      fatherName: '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = { ...formData };
      Object.keys(submitData).forEach(key => {
        if (submitData[key] === '' || submitData[key] === null) {
          delete submitData[key];
        }
      });

      const response = await createMember(submitData);
      
      if (response.success) {
        toast.success(`${memberType.charAt(0).toUpperCase() + memberType.slice(1)} member added successfully!`);
        toast.info(`Member ID: ${response.data.membershipId}`);
        
        setFormData({
          memberType: memberType,
          name: '',
          fatherName: '',
          memberNumber: '',
          course: '',
          yearOfJoining: new Date().getFullYear(),
          mobile: '',
          email: '',
          address: '',
          photo: '',
          notes: ''
        });
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to add member';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let i = currentYear + 1; i >= currentYear - 10; i--) {
    yearOptions.push(i);
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="title">Approved Member List</h1>
      </div>
    <div className="container mt-4">
      <Card>
        <Card.Body>
          <div className="mb-4">
            <h5>Select Member Type</h5>
            <div className="d-flex gap-3">
              <Button
                variant={memberType === 'student' ? 'primary' : 'outline-primary'}
                onClick={() => handleMemberTypeChange('student')}
              >
                Student
              </Button>
              <Button
                variant={memberType === 'faculty' ? 'primary' : 'outline-primary'}
                onClick={() => handleMemberTypeChange('faculty')}
              >
                Faculty
              </Button>
              <Button
                variant={memberType === 'special' ? 'primary' : 'outline-primary'}
                onClick={() => handleMemberTypeChange('special')}
              >
                Special (phd,jrf)
              </Button>
            </div>
          </div>

          <Form onSubmit={handleSubmit}>
            <h5 className="mb-3 text-primary">Personal Information</h5>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Full Name <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    required
                    placeholder="Enter full name"
                  />
                </Form.Group>
              </Col>

              {memberType === 'student' && (
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Father's Name <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.fatherName}
                      onChange={(e) => handleChange('fatherName', e.target.value)}
                      placeholder="Enter father's name"
                    />
                  </Form.Group>
                </Col>
              )}

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Year of Joining <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    value={formData.yearOfJoining}
                    onChange={(e) => handleChange('yearOfJoining', parseInt(e.target.value))}
                    required
                  >
                    {yearOptions.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            {memberType === 'student' && (
              <>
                <h5 className="mb-3 mt-4 text-primary">Academic Information</h5>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Roll Number <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.memberNumber}
                        onChange={(e) => handleChange('memberNumber', e.target.value.toUpperCase())}
                        required
                        placeholder="e.g., IT2K2228"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Course <span className="text-danger">*</span></Form.Label>
                      <Form.Select
                        value={formData.course}
                        onChange={(e) => handleChange('course', e.target.value)}
                        required
                      >
                        <option value="">Select Course</option>
                        {courses.map(course => (
                          <option key={course} value={course}>{course}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </>
            )}

            <h5 className="mb-3 mt-4 text-primary">Contact Information</h5>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Mobile <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => handleChange('mobile', e.target.value)}
                    required
                    placeholder="10-digit mobile number"
                    pattern="[6-9][0-9]{9}"
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="email@example.com"
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label>Photo URL <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.photo}
                    onChange={(e) => handleChange('photo', e.target.value)}
                    placeholder="Photo URL"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Address <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    required
                    placeholder="Complete address"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Alert variant="info">
              <small>
                <strong>Note:</strong> Membership ID will be automatically generated.
                <br />
                <strong>Format:</strong>
                {memberType === 'student' && ' STU[Year][Number] (e.g., STU20240001)'}
                {memberType === 'faculty' && ' FAC[Year][Number] (e.g., FAC20240001)'}
                {memberType === 'special' && ' SPE[Year][Number] (e.g., SPE20240001)'}
                <br />
                <strong>Book Limits:</strong>
                {memberType === 'student' && ' 3 books '}
                {memberType === 'faculty' && ' 10 books'}
                {memberType === 'special' && ' 5 books '}
              </small>
            </Alert>

            <div className="d-flex justify-content-end gap-2 mt-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => window.history.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Adding...
                  </>
                ) : (
                  `Add ${memberType.charAt(0).toUpperCase() + memberType.slice(1)} Member`
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
    </div>
  );
};

export default AddMember;