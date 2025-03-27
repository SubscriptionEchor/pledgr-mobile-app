// Email validation
export const emailRegex = /^(?=.{1,254}$)[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password validation
export const passwordRegex = {
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  digit: /[0-9]/,
  special: /[!@#$%^&*(),.?":{}|<>]/
};

export function validatePassword(password: string): { isValid: boolean; error?: string } {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }

  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters long' };
  }

  if (!passwordRegex.uppercase.test(password)) {
    return { isValid: false, error: 'Password must contain at least one uppercase letter' };
  }

  if (!passwordRegex.lowercase.test(password)) {
    return { isValid: false, error: 'Password must contain at least one lowercase letter' };
  }

  if (!passwordRegex.digit.test(password)) {
    return { isValid: false, error: 'Password must contain at least one number' };
  }

  if (!passwordRegex.special.test(password)) {
    return { isValid: false, error: 'Password must contain at least one special character' };
  }

  return { isValid: true };
}