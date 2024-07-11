export interface JWTPayload {
    user_id: string;
    name: string;
    exp: number;
}