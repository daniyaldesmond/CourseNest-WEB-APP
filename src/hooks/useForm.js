import { useState } from 'react';

export const useForm = (initialValues, validate) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    
    setValues({
      ...values,
      [name]: val
    });

    // Clear error for this field if active
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const setFieldValue = (name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e, onSubmit) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);

    const validationErrors = validate ? validate(values) : {};
    const hasErrors = Object.keys(validationErrors).some(key => validationErrors[key]);

    if (hasErrors) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    setErrors({});
    try {
      await onSubmit(values);
    } catch (err) {
      console.error('Form submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
  };

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    setFieldValue,
    handleSubmit,
    setValues,
    setErrors,
    resetForm
  };
};

export default useForm;
