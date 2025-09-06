import React, { useState } from 'react';
import './ProfileDetails.css';

const ProfileDetails = ({ user, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    age: user.age
  });
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setIsEditing(false);
  };
  
  // Handle profile picture change
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, you would upload this file to a server
      // and get back a URL to the uploaded image
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateProfile({ profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="profile-details-card">
      <div className="card-header">
        <h2>Profile Details</h2>
        <button 
          className="edit-button" 
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      <div className="profile-content">
        <div className="profile-picture-container">
          <div className="profile-picture">
            {user.profilePicture ? (
              <img src={user.profilePicture} alt={user.name} />
            ) : (
              <div className="profile-picture-placeholder">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          {isEditing && (
            <div className="profile-picture-upload">
              <label htmlFor="profile-picture-input">Change Picture</label>
              <input 
                type="file" 
                id="profile-picture-input"
                accept="image/*"
                onChange={handleProfilePictureChange}
              />
            </div>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="age">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                min="16"
                max="100"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </div>
            
            <button type="submit" className="save-button">Save Changes</button>
          </form>
        ) : (
          <div className="profile-info">
            <div className="info-item">
              <span className="label">Name:</span>
              <span className="value">{user.name}</span>
            </div>
            
            <div className="info-item">
              <span className="label">Email:</span>
              <span className="value">{user.email}</span>
            </div>
            
            <div className="info-item">
              <span className="label">Age:</span>
              <span className="value">{user.age}</span>
            </div>
            
            <div className="info-item">
              <span className="label">Member Since:</span>
              <span className="value">{user.joined}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileDetails;
