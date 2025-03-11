/**
 * Utility functions for input validation
 */

/**
 * Validates if a string is a valid email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Checks if a password meets strength requirements
 */
export const isPasswordStrong = (password: string): boolean => {
  // At least 8 characters, with uppercase, lowercase, and number
  return password.length >= 8 && 
    /[A-Z]/.test(password) && 
    /[a-z]/.test(password) && 
    /[0-9]/.test(password);
};

/**
 * Returns password strength feedback
 */
export const getPasswordStrengthFeedback = (password: string): { isStrong: boolean; feedback: string } => {
  if (!password) {
    return { isStrong: false, feedback: 'Password is required' };
  }
  
  if (password.length < 8) {
    return { isStrong: false, feedback: 'Password must be at least 8 characters' };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { isStrong: false, feedback: 'Password must include an uppercase letter' };
  }
  
  if (!/[a-z]/.test(password)) {
    return { isStrong: false, feedback: 'Password must include a lowercase letter' };
  }
  
  if (!/[0-9]/.test(password)) {
    return { isStrong: false, feedback: 'Password must include a number' };
  }
  
  return { isStrong: true, feedback: 'Password strength: Strong' };
};

/**
 * Validates if a value is a positive number
 */
export const isPositiveNumber = (value: string | number): boolean => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return !isNaN(num) && num >= 0;
};

/**
 * Validates if a project name is valid
 */
export const isValidProjectName = (name: string): boolean => {
  return name.trim().length > 0;
};