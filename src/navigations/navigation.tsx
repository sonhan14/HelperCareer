import { Call } from "@stream-io/video-react-native-sdk";
import { iUser } from "../../types/userType";

export type RootStackParamList = {
    Login: undefined;
    MainTabs: undefined;
    Register: undefined,
    ChatBox: {
        receiver: iUser,
        chatId: string,
    },
    EmployeeProfile: { employeeId: string, },
    TaskDetail: { TaskId: string },
    CallScreen: {
        receiverId: string,
        receiverName: string,
        call: Call
    },
    AboutApp: undefined
};

export type RootTabParamList = {
    Home: { userId: string };
    Profile: { userId: string };
    Chat: undefined,
    Tasks: undefined
};


