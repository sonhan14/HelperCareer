export type RootStackParamList = {
    Login: undefined;
    MainTabs: { userId: string };
    Register: undefined,
    ChatBox: {receiverId: string, chatId: string},
    EmployeeProfile: {employeeId: string,},
};

export type RootTabParamList = {
    Home: { userId: string };
    Profile: { userId: string };
    Chat: undefined,
    Tasks: undefined
};


