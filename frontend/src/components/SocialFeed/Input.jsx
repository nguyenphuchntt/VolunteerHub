import React from 'react';
import PropTypes from 'prop-types';
import '../../css/Input.css';

const Input = ({ 
  type = 'text',
  placeholder,
  value,
  onChange,
  icon,
  hasIcon = false,
  multiline = false,
  rows = 3,
  className = ''
}) => {
  const InputComponent = multiline ? 'textarea' : 'input';

  return (
    <div className={`input-wrapper ${hasIcon ? 'has-icon' : ''} ${className}`}>
      {hasIcon && icon && (
        <span className="input-icon">{icon}</span>
      )}
      <InputComponent
        type={multiline ? undefined : type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={multiline ? rows : undefined}
        className="input-field"
      />
    </div>
  );
};

Input.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  icon: PropTypes.node,
  hasIcon: PropTypes.bool,
  multiline: PropTypes.bool,
  rows: PropTypes.number,
  className: PropTypes.string,
};

export default Input;
