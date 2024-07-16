import axios from "axios";

let assertionToken: string | null = null;
let tokenExpiry: number | null = null;

export const generateToken = async (): Promise<void> => {
    try {
        const response = await axios.post<{ token: string }>('http://10.8.0.218:3000/generate-token', {});
        assertionToken = response.data.token;
        tokenExpiry = Date.now() + (60 * 60 * 1000); // Set token expiry to 1 hour from now
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const getAccessToken = async (): Promise<string> => {
    const url = 'https://oauth2.googleapis.com/token';
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    };

    try {
        // Kiểm tra nếu assertionToken chưa được khởi tạo hoặc đã hết hạn
        if (!assertionToken || tokenExpiry === null || Date.now() >= tokenExpiry) {
            await generateToken(); // Refresh assertionToken
        }

        const data = new URLSearchParams();
        data.append('grant_type', 'urn:ietf:params:oauth:grant-type:jwt-bearer');
        if (assertionToken) {
            data.append('assertion', assertionToken);
        } else {
            throw new Error('Assertion token is not available.');
        }

        const response = await axios.post<{ access_token: string }>(url, data.toString(), { headers });
        return response.data.access_token;

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const sendNotification = async (): Promise<void> => {
    const url = 'https://fcm.googleapis.com/v1/projects/vmafinalproject/messages:send';
    try {
        const accessToken = await getAccessToken();
        const headers = {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        };
        const body = {
            message: {
                token: "f5rZbisiRkeyBZvTW-xHCM:APA91bFAS5A0aGdZpIj3mI_Qh4GvEm-IqSsWYoqgknT55Wa0lpRDn86RyYHAyfds7wiF0pH2cF_XzIqyOqJbW277n8afYOzbKObT75ksaAwkGrXSxrLBpaicA5unwyGVyR2nuzkCHBGM",
                notification: {
                    title: "Test Title",
                    body: "Test Body"
                }
            }
        };

        const response = await axios.post(url, body, { headers });
        console.log('Notification sent:', response.data);
    } catch (error) {
        console.error('Error sending notification:', error);
        throw error;
    }
};
