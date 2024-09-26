export interface User {
    gender: 'male' | 'female';
    name: {
        title: string;
        first: string;
        last: string;
    };
    location: {
        city: string;
        state: string;
        country: string;
        postcode: string | number;
        coordinates: {
            latitude: string;
            longitude: string;
        };
        timezone: {
            offset: string;
            description: string;
        };
    };
    email: string;
    dob: {
        date: string;
        age: number;
    };
    phone: string;
    picture: {
        large: string;
        thumbnail: string;
    };
}
