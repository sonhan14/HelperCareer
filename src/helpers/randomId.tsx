import CryptoJS from 'crypto-js';
import { JWTPayload } from '../../types/JwtPayload';
import base64url from "base64url";
import axios from 'axios';

export function generateRandomId() {
    // Tạo một chuỗi ngẫu nhiên
    const randomString = Math.random().toString(36).substr(2);

    // Băm chuỗi ngẫu nhiên đó bằng SHA-256
    const hash = CryptoJS.SHA256(randomString).toString(CryptoJS.enc.Hex);

    return hash;
}

export const createJWT = (payload: JWTPayload, secretKey: string): string => {
    const header = {
        alg: 'HS256',
        typ: 'JWT'
    };

    const encodedHeader = base64url.encode(JSON.stringify(header));
    const encodedPayload = base64url.encode(JSON.stringify(payload));

    const data = `${encodedHeader}.${encodedPayload}`;
    const signature = base64url.encode(CryptoJS.HmacSHA256(data, secretKey).toString(CryptoJS.enc.Base64));

    return `${data}.${signature}`;
};




