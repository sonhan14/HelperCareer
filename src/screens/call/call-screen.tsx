import { CallContent, StreamCall, StreamVideo, StreamVideoClient, User } from "@stream-io/video-react-native-sdk";
import base64url from "base64url";
import CryptoJS from 'crypto-js';
import { useSelector } from "react-redux";
import { selectUserData } from "../../redux/user/userSlice";
import { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

interface JWTPayload {
    user_id: string;
    name: string;
    exp: number;
}

export const CallScreen = () => {
    const currentUser = useSelector(selectUserData);
    const apiKey = '9puabwjb5p2p';
    const userId = currentUser?.id;
    const callId = 'default_3f595617-07a3-4f70-9f0f-7a898e85b455';

    const [token, setToken] = useState<string>('');
    const [client, setClient] = useState<StreamVideoClient | null>(null);
    const [call, setCall] = useState<any>(null);

    const createJWT = (payload: JWTPayload, secretKey: string): string => {
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

    useEffect(() => {
        if (userId) {
            const payload: JWTPayload = {
                user_id: userId,
                name: currentUser.last_name + ' ' + currentUser.first_name,
                exp: Math.floor(Date.now() / 1000) + (60 * 10)

            };

            const secretKey = 'xs93ftx87nujrm35z6eat7uzge5jky74hcby9umye2g4sdcdurkc25hmj8jf3gak';

            try {
                const token = createJWT(payload, secretKey);
                setToken(token);

                const user: User = { id: userId, name: currentUser.last_name + ' ' + currentUser.first_name, };

                const client = new StreamVideoClient({ apiKey, user, token });
                const call = client.call('default', callId);
                call.join({ create: true });

                setClient(client);
                setCall(call);
            } catch (error) {
                console.error('Error creating JWT:', error);
            }
        }
    }, [userId]);

    if (!client || !call) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Joining call...</Text>
            </View>
        );
    }

    return (
        <StreamVideo client={client}>
            <StreamCall call={call}>
                <CallContent />
            </StreamCall>
        </StreamVideo>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    text: {
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
});
