import React, { useState } from 'react';
import { TextInput, TextArea, ItemList, ActionButton } from './SharedInputs';
import './Projects.css';

const ProjectItem = ({ item, index, updateItem, removeItem }) => {
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateItem(index, { ...item, [name]: value });
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateField = (name, value) => {
    if (name === 'title' && !value) {
      return 'Project title is required';
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
    <div className="project-item">
      <div className="item-header">
        <h4>Project #{index + 1}</h4>
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
          label="Project Title"
          name="title"
          value={item.title || ''}
          onChange={handleChange}
          placeholder="E-commerce Website"
          required={true}
          error={errors.title}
          onBlur={handleBlur}
        />
      </div>
      
      <div className="form-row two-col">
        <TextInput
          label="Role"
          name="role"
          value={item.role || ''}
          onChange={handleChange}
          placeholder="Lead Developer"
        />
        
        <TextInput
          label="Date"
          name="date"
          value={item.date || ''}
          onChange={handleChange}
          placeholder="May 2022 - Aug 2022"
        />
      </div>
      
      <div className="form-row">
        <TextInput
          label="Project URL"
          name="url"
          value={item.url || ''}
          onChange={handleChange}
          placeholder="https://example.com"
          type="url"
        />
      </div>
      
      <div className="form-row">
        <TextArea
          label="Description"
          name="description"
          value={item.description || ''}
          onChange={handleChange}
          placeholder="Describe the project, your role, technologies used, and key accomplishments."
          rows={4}
        />
      </div>
      
      <div className="form-row">
        <TextInput
          label="Technologies Used"
          name="technologies"
          value={item.technologies || ''}
          onChange={handleChange}
          placeholder="React, Node.js, MongoDB"
        />
      </div>
    </div>
  );
};

const Projects = ({ data, updateData }) => {
  const projectItems = data.projects || [];
  
  const addProject = () => {
    const newProject = {
      title: '',
      role: '',
      date: '',
      url: '',
      description: '',
      technologies: ''
    };
    
    updateData({
      ...data,
      projects: [...projectItems, newProject]
    });
  };
  
  const updateProjectItem = (index, updatedItem) => {
    const updatedProjects = [...projectItems];
    updatedProjects[index] = updatedItem;
    
    updateData({
      ...data,
      projects: updatedProjects
    });
  };
  
  const removeProjectItem = (index) => {
    const updatedProjects = projectItems.filter((_, i) => i !== index);
    
    updateData({
      ...data,
      projects: updatedProjects
    });
  };

  return (
    <div className="projects-form">
      <h3>Projects</h3>
      
      <ItemList
        items={projectItems}
        renderItem={(item, index) => (
          <ProjectItem
            item={item}
            index={index}
            updateItem={updateProjectItem}
            removeItem={removeProjectItem}
          />
        )}
        onAddItem={addProject}
        addButtonText="Add Project"
      />
      
      {projectItems.length === 0 && (
        <div className="empty-state">
          <p>No projects added yet. Showcase your work by adding relevant projects.</p>
          <ActionButton
            text="Add Project"
            onClick={addProject}
            variant="primary"
          />
        </div>
      )}
      
      <div className="projects-tips">
        <h4>Tips for Project Descriptions:</h4>
        <ul>
          <li>Focus on your specific contributions and impact.</li>
          <li>Include measurable results whenever possible.</li>
          <li>List the technologies and methodologies used.</li>
          <li>Keep descriptions concise but informative.</li>
        </ul>
      </div>
    </div>
  );
};

export default Projects;
