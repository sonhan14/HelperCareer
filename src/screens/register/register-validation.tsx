// passwordValidation.ts
export const isValidPassword = (password: string): boolean => {
    const minLength = /.{8,}/;
    const hasLower = /[a-z]/;
    const hasUpper = /[A-Z]/;
    const hasDigit = /\d/;
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/;

    return minLength.test(password) && hasLower.test(password) && hasUpper.test(password) && hasDigit.test(password) && hasSpecial.test(password);
};

export const validateVietnamesePhoneNumber = (phoneNumber: string) => {
    // Vietnamese phone numbers start with '0' and followed by a 9 or 10 digit number
    const regex = /^(0?)(3[2-9]|5[6|8|9]|7[0|6|7|8|9]|8[1-6|8|9]|9[0-4|6-9])[0-9]{7}$/;
    return regex.test(phoneNumber);
};

export const doPasswordsMatch = (password: string, rePassword: string): boolean => {
    return password === rePassword;
};

export const __isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};