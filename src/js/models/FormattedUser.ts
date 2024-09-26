export interface FormattedUser {
    id: string;
    favorite: boolean;
    course: string;
    bg_color: string;
    note: string;
    gender: 'Male' | 'Female';
    title?: string;
    full_name: string;
    city: string;
    state?: string;
    country: string;
    postcode?: string;
    coordinates?: { latitude: string; longitude: string };
    timezone?: { offset: string; description: string };
    email: string;
    b_day?: string;
    age: number;
    phone: string;
    picture_large?: string;
    picture_thumbnail?: string;
}
