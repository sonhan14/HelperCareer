import { StreamVideo, StreamVideoClient, User } from "@stream-io/video-react-native-sdk";
import { PropsWithChildren, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useSelector } from "react-redux";
import { selectUserData } from "../redux/user/userSlice";
import { createJWT } from "../helpers/randomId";
import { JWTPayload } from "../../types/JwtPayload";

export default function VideoProvider({ children }: PropsWithChildren) {
    const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(null)
    const apiKey = 'j4afxwujxm3t';
    const userData = useSelector(selectUserData)
    const secretKey = 'ppysy4acrw6jcu6ej328en4rmasxekv9d7yeqwyb2n5886cwv9pxz25uvapng5zm';

    useEffect(() => {
        if (!userData) {
            return
        }
        const initVideoClient = async () => {
            const payload: JWTPayload = {
                user_id: userData.id,
                name: userData.last_name + ' ' + userData.first_name,
                exp: Math.floor(Date.now() / 1000) + (60 * 10)
            };
            const token = createJWT(payload, secretKey);

            const user: User = { id: userData.id, name: userData.last_name + ' ' + userData.first_name, };
            const client = new StreamVideoClient({ apiKey, user, token })
            setVideoClient(client)
        }
        initVideoClient()

        return () => {
            videoClient?.disconnectUser();
            setVideoClient(null);
        }
    }, [userData?.id])

    if (!videoClient) {
        return null
    }

    return (
        <StreamVideo client={videoClient}>
            {children}
        </StreamVideo>
    )
}