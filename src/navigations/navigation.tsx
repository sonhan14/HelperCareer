import { TaskType } from "../../types/taskType";

export type RootStackParamList = {
    Login: undefined;
    MainTabs: { userId: string };
    Register: undefined,
    ChatBox: {receiverId: string, chatId: string, receiverName: string},
    EmployeeProfile: {employeeId: string,},
    TaskDetail: {TaskId: string},
    CallScreen: undefined,
};

export type RootTabParamList = {
    Home: { userId: string };
    Profile: { userId: string };
    Chat: undefined,
    Tasks: undefined
};


