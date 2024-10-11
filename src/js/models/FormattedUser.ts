export interface Coordinates {
    latitude: string;
    longitude: string;
}

export interface Timezone {
    offset: string;
    description: string;
}

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
    coordinates?: Coordinates;
    timezone?: Timezone;
    email: string;
    b_day?: string;
    age: number;
    phone: string;
    picture_large?: string;
    picture_thumbnail?: string;
}
