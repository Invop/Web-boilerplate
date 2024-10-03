import {FormattedUser} from './models/FormattedUser.js';
import {User} from './models/User.js';

const capitalize = (s: string) => s ? s[0].toUpperCase() + s.slice(1) : '';

const toFormattedUser = (user: User): Partial<FormattedUser> => {
    return {
        gender: capitalize(user.gender) as 'Male' | 'Female',
        title: user.name.title,
        full_name: `${user.name.first} ${user.name.last}`,
        city: user.location.city,
        state: user.location.state,
        country: user.location.country,
        postcode: `${user.location.postcode}`,
        coordinates: user.location.coordinates,
        timezone: user.location.timezone,
        email: user.email,
        b_day: user.dob.date,
        age: user.dob.age,
        phone: user.phone,
        picture_large: user.picture.large,
        picture_thumbnail: user.picture.thumbnail,
    };
};

const formatUsers = (users: User[]): Partial<FormattedUser>[] => {
    return users.map(toFormattedUser);
};

const capitalizeGenderAdditionalUsers = (users: Partial<FormattedUser>[]): Partial<FormattedUser>[] => {
    return users.map(user => ({
        ...user,
        gender: user.gender ? capitalize(user.gender) as 'Male' | 'Female' : undefined,
    }));
};

const combineUsers = (users1: Partial<FormattedUser>[], users2: Partial<FormattedUser>[]): Partial<FormattedUser>[] => {
    const uniqueUsers = new Map(users1.concat(users2).map(user => [user.email, user]));
    return Array.from(uniqueUsers.values());
};

const COURSES = [
    'Mathematics', 'Physics', 'English', 'Computer Science', 'Dancing',
    'Chess', 'Biology', 'Chemistry', 'Law', 'Art', 'Medicine', 'Statistics'
];

const addProperties = (user: Partial<FormattedUser>, index: number): FormattedUser => {
    return {
        ...user,
        id: user.id || `${index + 1}`,
        favorite: user.favorite !== undefined ? user.favorite : Math.random() >= 0.5,
        course: user.course || COURSES[Math.floor(Math.random() * COURSES.length)],
        bg_color: user.bg_color || '#ffffff',
        note: user.note || '',
    } as FormattedUser;
};

const enrichAllUsers = (users: Partial<FormattedUser>[]): FormattedUser[] => {
    return users.map(addProperties);
};

export const getFormatedUsers = (randomUsers: User[]): FormattedUser[] => {
    try {
        const formattedUsers = formatUsers(randomUsers);
        return enrichAllUsers(formattedUsers);
    } catch (error) {
        console.error('An error occurred:', error);
        return [];
    }
};
