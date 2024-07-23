export interface Location {
    latitude: number;
    longitude: number;
    id: string,
    name: string,
    avatar: string
}

export interface Feature {
    id: string;
    full_address: string;
    center: [number, number];
}