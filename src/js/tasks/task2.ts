
import { FormattedUser } from '../models/FormattedUser';
import { ValidationResult } from '../models/ValidationResult';

export function validateFormattedUser(user: FormattedUser): ValidationResult {
    const errors: string[] = [];
    const stringFields = ['full_name', 'gender', 'note', 'city', 'state', 'country'];
    const startWithUpperCase = (str: string | undefined) => str !== undefined && /^\p{Lu}/u.test(str);

    for (const field of stringFields) {
        const value = user[field];

        if (typeof value === 'string' && value.trim().length === 0) {
            continue;
        }

        if (typeof value === 'string' && value.trim().length > 0 && !startWithUpperCase(value)) {
            errors.push(`Field ${field} must start with an uppercase letter.`);
        }
    }
    if (user.age < 0 || user.age > 120) {
        errors.push(`Field age must be between 0 and 120.`);
    }

    const phoneRegex = /^\+?(\d{1,3})?[-.\s]?(\(?\d{1,4}\)?)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}( x\d{1,5})?$/;
    if (!phoneRegex.test(user.phone)) {
        errors.push(`Field phone must match pattern.`);
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(user.email)) {
        errors.push(`Field email must be a valid email address.`);
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}
