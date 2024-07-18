import { iUser } from "./userType"

export type messagesBox = {
    id: string,
    receiver: iUser
    lastMessage: string,
    lastMessageTimestamp: any,
}

