// passwordValidation.ts
export const isValidPassword = (password: string): boolean => {
    const minLength = /.{8,}/;
    const hasLower = /[a-z]/;
    const hasUpper = /[A-Z]/;
    const hasDigit = /\d/;
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/;

    return minLength.test(password) && hasLower.test(password) && hasUpper.test(password) && hasDigit.test(password) && hasSpecial.test(password);
};

export const doPasswordsMatch = (password: string, rePassword: string): boolean => {
    return password === rePassword;
};

export const __isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};