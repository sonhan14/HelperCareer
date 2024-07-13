import { Call } from "@stream-io/video-react-native-sdk";
import { TaskType } from "../../types/taskType";

export type RootStackParamList = {
    Login: undefined;
    MainTabs: undefined;
    Register: undefined,
    ChatBox: {
        receiverId: string,
        chatId: string,
        receiverName: string,

    },
    EmployeeProfile: { employeeId: string, },
    TaskDetail: { TaskId: string },
    CallScreen: {
        receiverId: string,
        receiverName: string,
        call: Call
    },
};

export type RootTabParamList = {
    Home: { userId: string };
    Profile: { userId: string };
    Chat: undefined,
    Tasks: undefined
};


