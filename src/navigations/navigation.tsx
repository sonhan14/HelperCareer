// src/types/navigation.ts
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';


export type RootStackParamList = {
    Login: undefined;
    MainTabs: undefined;
    Register: undefined
};

export type RootTabParamList = {
    Home: undefined;
    Profile: undefined;
};

export type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList>;
export type HomeScreenRouteProp = RouteProp<RootStackParamList>;

export type MainTabsNavigationProp = BottomTabNavigationProp<RootTabParamList>;
