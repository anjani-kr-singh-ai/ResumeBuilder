import React from 'react';
import './SharedInputs.css';

// Text input with label
export const TextInput = ({ 
  label, 
  name, 
  value, 
  onChange, 
  placeholder = '', 
  required = false,
  type = 'text',
  error = ''
}) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>
        {label} {required && <span className="required">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={error ? 'error' : ''}
      />
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

// Text area with label
export const TextArea = ({ 
  label, 
  name, 
  value, 
  onChange, 
  placeholder = '', 
  required = false,
  rows = 4,
  error = ''
}) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>
        {label} {required && <span className="required">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className={error ? 'error' : ''}
      ></textarea>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

// Date input with label
export const DateInput = ({ 
  label, 
  name, 
  value, 
  onChange, 
  required = false,
  error = ''
}) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>
        {label} {required && <span className="required">*</span>}
      </label>
      <input
        type="date"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={error ? 'error' : ''}
      />
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

// Select input with label
export const SelectInput = ({ 
  label, 
  name, 
  value, 
  onChange, 
  options = [], 
  required = false,
  placeholder = 'Select an option',
  error = ''
}) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>
        {label} {required && <span className="required">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={error ? 'error' : ''}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

// Checkbox input with label
export const CheckboxInput = ({
  label,
  name,
  checked,
  onChange
}) => {
  return (
    <div className="checkbox-group">
      <input
        type="checkbox"
        id={name}
        name={name}
        checked={checked}
        onChange={onChange}
      />
      <label htmlFor={name}>{label}</label>
    </div>
  );
};

// Action button
export const ActionButton = ({
  text,
  onClick,
  type = 'button',
  variant = 'primary'
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`action-button ${variant}`}
    >
      {text}
    </button>
  );
};

// Item list with add/remove functionality
export const ItemList = ({
  items,
  renderItem,
  onAddItem,
  addButtonText = 'Add Item'
}) => {
  return (
    <div className="item-list">
      {items.map((item, index) => (
        <div key={index} className="item-wrapper">
          {renderItem(item, index)}
        </div>
      ))}
      <button
        type="button"
        onClick={onAddItem}
        className="add-item-button"
      >
        + {addButtonText}
      </button>
    </div>
  );
};
