import React, { useState } from 'react';
import { TextField, RadioGroup, FormControlLabel, Radio, Button, FormControl, FormLabel, FormHelperText, Box } from '@mui/material';

document.addEventListener("DOMContentLoaded", async function () {
  const form = document.getElementById("dynamic-form");
  const questionContainer = document.getElementById("questions");
  const submitBtn = document.getElementById("submit-btn");

  // API to fetch questions (using placeholder API for demonstration)
  const API_URL = "https://mocki.io/v1/84954ef5-462f-462a-b692-6531e75c220d";

  try {
      const response = await fetch(API_URL);
      if (!response.ok) {
          throw new Error("Failed to fetch questions.");
      }
      const formFields = await response.json();
    }
    catch (error) {
    console.error("Error fetching questions:", error);
    questionContainer.innerHTML = "<p>Failed to load questions. Please try again later.</p>";
}
}
  );

  const formFields  = [
  { id: '1111', label: 'First Name', name: 'nameFirst', type: 'text', required: 1 },
  { id: '2222', label: 'Last Name', name: 'nameLast', type: 'text', required: 1 },
  { id: '3333', label: 'Your Phone Number', name: 'contactPhone', type: 'tel', pattern: '[0-9]{10}', required: 0 },
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
      if (field.pattern && !new RegExp(field.pattern).test(formValues[field.name] || '')) {
        tempErrors[field.name] = `Invalid ${field.label}.`;
      }
    });

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch("https://0211560d-577a-407d-94ab-dc0383c943e0.mock.pstmn.io/submitform", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formValues),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Success:", result);
    } catch (error) {
        console.error("Error:", error);
    }
      console.log('Submitted Data:', formValues);
    } else {
      console.log('Please fix errors before submitting.');
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
