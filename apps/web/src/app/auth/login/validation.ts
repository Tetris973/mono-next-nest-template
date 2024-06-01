export const validateLoginForm = (username: string, password: string): { username: string; password: string } => {
  const errors = { username: '', password: '' };

  if (!username) {
    errors.username = 'You must enter the username.';
  } else if (username.length < 6) {
    errors.username = 'Username must be at least 6 characters.';
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  if (!password) {
    errors.password = 'You must enter the password.';
  } else if (!passwordRegex.test(password)) {
    errors.password =
      'Password must be at least 8 characters long, including at least one uppercase letter, one lowercase letter, one number, and one special character.';
  }

  return errors;
};
