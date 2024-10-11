import { FormattedUser } from './models/FormattedUser';
import { ValidationResult } from './models/ValidationResult';

import _ from 'lodash';

export function validateFormattedUser(user: FormattedUser): ValidationResult {
    const errors: string[] = [];
    const stringFields = ['full_name', 'gender', 'note', 'city', 'state', 'country'];
    const startWithUpperCase = (str: string | undefined) => str !== undefined && /^\p{Lu}/u.test(str);

    // Validate string fields to start with an uppercase letter
    _.forEach(stringFields, (field) => {
        const value = user[field as keyof FormattedUser];

        if (_.isString(value) && value.trim().length > 0 && !startWithUpperCase(value)) {
            errors.push(`Field ${field} must start with an uppercase letter.`);
        }
    });

    // Validate age
    if (!_.isUndefined(user.age) && (user.age < 0 || user.age > 120)) {
        errors.push(`Field age must be between 0 and 120.`);
    }

    // Validate phone number format
    const phoneRegex = /^\+?(\d{1,3})?[-.\s]?(\(?\d{1,4}\)?)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}( x\d{1,5})?$/;
    if (!_.isUndefined(user.phone) && !phoneRegex.test(user.phone)) {
        errors.push(`Field phone must match pattern.`);
    }

    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!_.isUndefined(user.email) && !emailPattern.test(user.email)) {
        errors.push(`Field email must be a valid email address.`);
    }

    return {
        isValid: _.isEmpty(errors),
        errors
    };
}
