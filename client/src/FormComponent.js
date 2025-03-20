import React, { useState } from 'react';
import { TextField, RadioGroup, FormControlLabel, Radio, Button, FormControl, FormLabel, FormHelperText, Box } from '@mui/material';

  const formFields  = [
  { id: '1111', label: 'First Name', name: 'nameFirst', type: 'text', required: 1, Pattern: '[A-Z, a-z]' },
  { id: '2222', label: 'Last Name', name: 'nameLast', type: 'text', required: 1, Pattern: '[A-Z, a-z]' },
  { id: '3333', label: 'Your Phone Number', name: 'contactPhone', type: 'tel', required: 0, Pattern: '[0-9]{10}' },
  { id: '4444', label: 'Your Email', name: 'contactEmail', type: 'email', required: 0 },
  { 
    id: '5555', legend: 'Your preferred contact', name: 'contactPreferred', type: 'radio', required: 1,
    options: [
      { id: '5555-1', label: 'Phone', value: 'phone' },
      { id: '5555-2', label: 'Email', value: 'email' }
    ]
  }
];

const FormComponent = () => {
  const [formValues, setFormValues] = useState({});
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    
  };

  const validateForm = () => {
    let tempErrors = {};

    formFields.forEach((field) => {
      if (field.required && !formValues[field.name]) {
        tempErrors[field.name] = `${field.label} is required.`;
      }
      
      if (field.Pattern && !new RegExp(field.Pattern).test(formValues[field.name] || '')) {
        tempErrors[field.name] = `Invalid ${field.label}.`;
      }
    });

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  function convertToArrayFormat(obj) {
    return Object.entries(obj).map(([name, value]) => ({
        name: name,
        value: value
    }));
}

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch("https://0211560d-577a-407d-94ab-dc0383c943e0.mock.pstmn.io/submitform", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(convertToArrayFormat(formValues)),
        });
        if(response.status == 200) {
          alert("Form Submitted");
        }
        console.log(response.data);
    } catch (error) {
        console.error("Error:", error);
    }
    } 
  };

  return (
    <Box
      sx={{
        padding: "16px 20px",
        overflow: "auto",
        flex: "1 1 auto",
        display: "flex",
        flexFlow: "column",
      }}>
      <h3>Contact US form</h3>
      <Box sx={{ flex: "0 1 auto" }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxWidth: '400px' }}>
          {formFields.map((field) => (
            <div key={field.id}>
              {field.type === 'radio' ? (
                <FormControl component="fieldset" error={!!errors[field.name]}>
                  <FormLabel>{field.legend}</FormLabel>
                  <RadioGroup
                    name={field.name}
                    value={formValues[field.name] || ''}
                    onChange={handleChange}
                  >
                    {field.options.map((option) => (
                      <FormControlLabel
                        key={option.id}
                        value={option.value}
                        control={<Radio />}
                        label={option.label}
                      />
                    ))}
                  </RadioGroup>
                  {errors[field.name] && <FormHelperText>{errors[field.name]}</FormHelperText>}
                </FormControl>
              ) : (
                <TextField
                  label={field.label}
                  name={field.name}
                  type={field.type}
                  value={formValues[field.name] || ''}
                  onChange={handleChange}
                  error={!!errors[field.name]}
                  helperText={errors[field.name] || ''}
                  fullWidth
                />
              )}
            </div>
          ))}

          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default FormComponent;
