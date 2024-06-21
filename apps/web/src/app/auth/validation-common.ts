export const validateUsername = (username: string): string => {
  if (!username) {
    return 'You must enter the username.';
  } else if (username.length < 6) {
    return 'Username must be at least 6 characters.';
  }
  return '';
};

export const validatePassword = (password: string): string => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  if (!password) {
    return 'You must enter the password.';
  } else if (!passwordRegex.test(password)) {
    return 'Password must be at least 8 characters long, including at least one uppercase letter, one lowercase letter, one number, and one special character.';
  }
  return '';
};

export const validateConfirmPassword = (confirmPassword: string, password: string): string => {
  if (confirmPassword !== password) {
    return 'Passwords do not match.';
  }
  return '';
};
