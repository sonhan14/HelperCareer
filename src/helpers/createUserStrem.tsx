import { StreamChat } from "stream-chat";
import { JWTPayload } from "../../types/JwtPayload";
import { createJWT } from "./randomId";

const apiKey = 'j4afxwujxm3t';
const apiSecret = 'ppysy4acrw6jcu6ej328en4rmasxekv9d7yeqwyb2n5886cwv9pxz25uvapng5zm';
const serverClient = StreamChat.getInstance(apiKey);


export const createUser = (userId: string, userName: string) => {
    console.log(userId + userName);

    const payload: JWTPayload = {
        user_id: userId,
        name: userName,
        exp: Math.floor(Date.now() / 1000) + (60 * 10)
    };
    const token = createJWT(payload, apiSecret)

    try {
        serverClient.connectUser({
            id: userId,
            name: userName,
            image: 'https://i.imgur.com/fR9Jz14.png',
        }, token)
        console.log(`User ${userId} created successfully`);
    } catch (error) {
        console.log(error);

    }

}