export function validatePassword(password: string): string | null {
    if (password.length < 8) {
        return "passwordRequirements";
    }
    if (!/\d/.test(password)) {
        return "passwordRequirements";
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return "passwordRequirements";
    }
    return null;
}
