export type RootStackParamList = {
    Login: undefined;
    MainTabs: { userId: string };
    Register: undefined
};

export type RootTabParamList = {
    Home: { userId: string };
    Profile: { userId: string };
    Chat: undefined,
    Tasks: undefined
};


