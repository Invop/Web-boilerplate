export interface FilterParams {
    country?: string;
    ageRange?: Range<number>;
    gender?: 'Male' | 'Female';
    favorite?: boolean;
    hasPhoto?: boolean;
}
export interface Range<T> {
    min?: T;
    max?: T;
}
