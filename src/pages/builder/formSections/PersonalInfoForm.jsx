import React from 'react';
import { TextInput, TextArea } from '../SharedInputs';
import './FormSections.css';

const PersonalInfoForm = ({ data, onChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  return (
    <div className="form-section personal-info-form">
      <h3>Personal Information</h3>
      
      <div className="form-row">
        <TextInput
          label="First Name"
          name="firstName"
          value={data.firstName || ''}
          onChange={handleChange}
          placeholder="John"
          required={true}
        />
      </div>
      
      <div className="form-row">
        <TextInput
          label="Last Name"
          name="lastName"
          value={data.lastName || ''}
          onChange={handleChange}
          placeholder="Doe"
          required={true}
        />
      </div>
      
      <div className="form-row">
        <TextInput
          label="Professional Title"
          name="title"
          value={data.title || ''}
          onChange={handleChange}
          placeholder="Software Engineer"
        />
      </div>
      
      <div className="form-row two-col">
        <TextInput
          label="Email"
          name="email"
          type="email"
          value={data.email || ''}
          onChange={handleChange}
          placeholder="john@example.com"
          required={true}
        />
        
        <TextInput
          label="Phone"
          name="phone"
          value={data.phone || ''}
          onChange={handleChange}
          placeholder="+1 (555) 123-4567"
        />
      </div>
      
      <div className="form-row two-col">
        <TextInput
          label="City"
          name="city"
          value={data.city || ''}
          onChange={handleChange}
          placeholder="New York"
        />
        
        <TextInput
          label="State/Province"
          name="state"
          value={data.state || ''}
          onChange={handleChange}
          placeholder="NY"
        />
      </div>
      
      <div className="form-row">
        <TextInput
          label="Address"
          name="address"
          value={data.address || ''}
          onChange={handleChange}
          placeholder="123 Main St"
        />
      </div>
      
      <div className="form-row">
        <TextInput
          label="Zip/Postal Code"
          name="zipCode"
          value={data.zipCode || ''}
          onChange={handleChange}
          placeholder="10001"
        />
      </div>
      
      <div className="form-row">
        <TextInput
          label="LinkedIn"
          name="linkedin"
          value={data.linkedin || ''}
          onChange={handleChange}
          placeholder="linkedin.com/in/johndoe"
        />
      </div>
      
      <div className="form-row">
        <TextInput
          label="Website"
          name="website"
          value={data.website || ''}
          onChange={handleChange}
          placeholder="johndoe.com"
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

export default PersonalInfoForm;
