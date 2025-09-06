import React, { useState } from 'react';
import { TextInput, DateInput, TextArea, CheckboxInput, ActionButton, ItemList } from './SharedInputs';
import './Experience.css';

const ExperienceItem = ({ item, index, updateItem, removeItem }) => {
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
    if ((name === 'company' || name === 'position') && !value) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
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
    <div className="experience-item">
      <div className="item-header">
        <h4>Experience #{index + 1}</h4>
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
          label="Company/Organization"
          name="company"
          value={item.company || ''}
          onChange={handleChange}
          placeholder="Company Name"
          required={true}
          error={errors.company}
          onBlur={handleBlur}
        />
      </div>
      
      <div className="form-row">
        <TextInput
          label="Position"
          name="position"
          value={item.position || ''}
          onChange={handleChange}
          placeholder="Job Title"
          required={true}
          error={errors.position}
          onBlur={handleBlur}
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
            label="Currently Working Here"
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
          placeholder="Describe your responsibilities, achievements, and key projects. Use bullet points for better readability."
          rows={5}
        />
      </div>
    </div>
  );
};

const Experience = ({ data, updateData }) => {
  const experienceItems = data.experience || [];
  
  const addExperience = () => {
    const newExperience = {
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      location: '',
      description: ''
    };
    
    updateData({
      ...data,
      experience: [...experienceItems, newExperience]
    });
  };
  
  const updateExperienceItem = (index, updatedItem) => {
    const updatedExperience = [...experienceItems];
    updatedExperience[index] = updatedItem;
    
    updateData({
      ...data,
      experience: updatedExperience
    });
  };
  
  const removeExperienceItem = (index) => {
    const updatedExperience = experienceItems.filter((_, i) => i !== index);
    
    updateData({
      ...data,
      experience: updatedExperience
    });
  };

  return (
    <div className="experience-form">
      <h3>Work Experience</h3>
      
      <ItemList
        items={experienceItems}
        renderItem={(item, index) => (
          <ExperienceItem
            item={item}
            index={index}
            updateItem={updateExperienceItem}
            removeItem={removeExperienceItem}
          />
        )}
        onAddItem={addExperience}
        addButtonText="Add Experience"
      />
      
      {experienceItems.length === 0 && (
        <div className="empty-state">
          <p>No work experience entries yet. Click the button below to add your work history.</p>
          <ActionButton
            text="Add Experience"
            onClick={addExperience}
            variant="primary"
          />
        </div>
      )}
    </div>
  );
};

export default Experience;
