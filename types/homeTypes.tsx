export interface Location {
    latitude: number;
    longitude: number;
    id: string,
    name: string
}

export interface Feature {
    id: string;
    full_address: string;
    center: [number, number];
}