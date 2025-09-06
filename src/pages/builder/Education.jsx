import React, { useState } from 'react';
import { TextInput, DateInput, TextArea, CheckboxInput, ActionButton, ItemList } from './SharedInputs';
import './Education.css';

const EducationItem = ({ item, index, updateItem, removeItem }) => {
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateItem(index, { ...item, [name]: value });
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    updateItem(index, { ...item, [name]: checked });
  };

  const validateField = (name, value) => {
    if (name === 'school' && !value) {
      return 'School/University name is required';
    }
    return '';
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) {
      setErrors({ ...errors, [name]: error });
    }
  };

  return (
    <div className="education-item">
      <div className="item-header">
        <h4>Education #{index + 1}</h4>
        <button 
          type="button" 
          className="remove-button"
          onClick={() => removeItem(index)}
        >
          Remove
        </button>
      </div>
      
      <div className="form-row">
        <TextInput
          label="School/University"
          name="school"
          value={item.school || ''}
          onChange={handleChange}
          placeholder="University of Example"
          required={true}
          error={errors.school}
          onBlur={handleBlur}
        />
      </div>
      
      <div className="form-row two-col">
        <TextInput
          label="Degree"
          name="degree"
          value={item.degree || ''}
          onChange={handleChange}
          placeholder="Bachelor of Science"
        />
        
        <TextInput
          label="Field of Study"
          name="fieldOfStudy"
          value={item.fieldOfStudy || ''}
          onChange={handleChange}
          placeholder="Computer Science"
        />
      </div>
      
      <div className="form-row two-col">
        <DateInput
          label="Start Date"
          name="startDate"
          value={item.startDate || ''}
          onChange={handleChange}
        />
        
        <div className="end-date-wrapper">
          <DateInput
            label="End Date"
            name="endDate"
            value={item.endDate || ''}
            onChange={handleChange}
            disabled={item.current}
          />
          
          <CheckboxInput
            label="Currently Studying"
            name="current"
            checked={item.current || false}
            onChange={handleCheckboxChange}
          />
        </div>
      </div>
      
      <div className="form-row">
        <TextInput
          label="Location"
          name="location"
          value={item.location || ''}
          onChange={handleChange}
          placeholder="City, Country"
        />
      </div>
      
      <div className="form-row">
        <TextArea
          label="Description"
          name="description"
          value={item.description || ''}
          onChange={handleChange}
          placeholder="Describe your educational experience, achievements, relevant coursework, etc."
          rows={3}
        />
      </div>
    </div>
  );
};

const Education = ({ data, updateData }) => {
  const educationItems = data.education || [];
  
  const addEducation = () => {
    const newEducation = {
      school: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      current: false,
      location: '',
      description: ''
    };
    
    updateData({
      ...data,
      education: [...educationItems, newEducation]
    });
  };
  
  const updateEducationItem = (index, updatedItem) => {
    const updatedEducation = [...educationItems];
    updatedEducation[index] = updatedItem;
    
    updateData({
      ...data,
      education: updatedEducation
    });
  };
  
  const removeEducationItem = (index) => {
    const updatedEducation = educationItems.filter((_, i) => i !== index);
    
    updateData({
      ...data,
      education: updatedEducation
    });
  };

  return (
    <div className="education-form">
      <h3>Education</h3>
      
      <ItemList
        items={educationItems}
        renderItem={(item, index) => (
          <EducationItem
            item={item}
            index={index}
            updateItem={updateEducationItem}
            removeItem={removeEducationItem}
          />
        )}
        onAddItem={addEducation}
        addButtonText="Add Education"
      />
      
      {educationItems.length === 0 && (
        <div className="empty-state">
          <p>No education entries yet. Click the button below to add your education history.</p>
          <ActionButton
            text="Add Education"
            onClick={addEducation}
            variant="primary"
          />
        </div>
      )}
    </div>
  );
};

export default Education;
