import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';

const MultiSelectField = ({ options, onChange, name, label, defaultValue }) => {
    console.log('MultiSelectField options', options);
    console.log('MultiSelectField defaultValue', defaultValue);
    const handleChange = (value) => {
        onChange({ name: name, value });
    };
    return (
        <div className='mb-4'>
            <label className='form-label'>{label}</label>
            <Select
                isMulti
                closeMenuOnSelect={false}
                defaultValue={defaultValue}
                options={options}
                className='basic-multi-select'
                classNamePrefix='select'
                onChange={handleChange}
                name={name}
            />
        </div>
    );
};

MultiSelectField.propTypes = {
    options: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    onChange: PropTypes.func,
    name: PropTypes.string,
    label: PropTypes.string,
    defaultValue: PropTypes.array
};

export default MultiSelectField;
