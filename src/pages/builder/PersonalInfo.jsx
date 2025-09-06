import React, { useState } from 'react';
import { TextInput, TextArea } from './SharedInputs';
import './PersonalInfo.css';

const PersonalInfo = ({ data, updateData }) => {
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateData({ ...data, [name]: value });
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? '' : 'Please enter a valid email address';
      case 'phone':
        const phoneRegex = /^\+?[\d\s()-]{10,15}$/;
        return value ? (phoneRegex.test(value) ? '' : 'Please enter a valid phone number') : '';
      case 'website':
        const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/;
        return value ? (urlRegex.test(value) ? '' : 'Please enter a valid URL') : '';
      default:
        return '';
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    if (name === 'fullName' && !value) {
      setErrors({ ...errors, [name]: 'Full name is required' });
      return;
    }
    
    const error = validateField(name, value);
    if (error) {
      setErrors({ ...errors, [name]: error });
    }
  };

  return (
    <div className="personal-info-form">
      <h3>Personal Information</h3>
      
      <div className="form-row">
        <TextInput
          label="Full Name"
          name="fullName"
          value={data.fullName || ''}
          onChange={handleChange}
          placeholder="John Doe"
          required={true}
          error={errors.fullName}
          onBlur={handleBlur}
        />
      </div>
      
      <div className="form-row two-col">
        <TextInput
          label="Job Title"
          name="jobTitle"
          value={data.jobTitle || ''}
          onChange={handleChange}
          placeholder="Software Engineer"
        />
        
        <TextInput
          label="Email"
          name="email"
          type="email"
          value={data.email || ''}
          onChange={handleChange}
          placeholder="john@example.com"
          required={true}
          error={errors.email}
          onBlur={handleBlur}
        />
      </div>
      
      <div className="form-row two-col">
        <TextInput
          label="Phone"
          name="phone"
          value={data.phone || ''}
          onChange={handleChange}
          placeholder="+1 (555) 123-4567"
          error={errors.phone}
          onBlur={handleBlur}
        />
        
        <TextInput
          label="Location"
          name="location"
          value={data.location || ''}
          onChange={handleChange}
          placeholder="New York, NY"
        />
      </div>
      
      <div className="form-row two-col">
        <TextInput
          label="LinkedIn"
          name="linkedin"
          value={data.linkedin || ''}
          onChange={handleChange}
          placeholder="linkedin.com/in/johndoe"
        />
        
        <TextInput
          label="Website"
          name="website"
          value={data.website || ''}
          onChange={handleChange}
          placeholder="johndoe.com"
          error={errors.website}
          onBlur={handleBlur}
        />
      </div>
      
      <div className="form-row">
        <TextArea
          label="Professional Summary"
          name="summary"
          value={data.summary || ''}
          onChange={handleChange}
          placeholder="A brief summary of your professional background and key qualifications..."
          rows={4}
        />
      </div>
    </div>
  );
};

export default PersonalInfo;
