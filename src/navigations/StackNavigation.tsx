import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './navigation';
import { LoginScreen } from '../screens/Login/login-screen';
import { BottomTabNavigator } from './BottomTabNavigator';
import { RegisterScreen } from '../screens/register/register-screen';
import { ChatBox } from '../screens/chat/chat-box-screen';
import { EmployeeProfile } from '../screens/employee-profile/employee-profile';
import { TaskDetail } from '../screens/tasks/task-detail';
import { CallScreen } from '../screens/call/call-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import { selectUserData } from '../redux/user/userSlice';

const Stack = createStackNavigator<RootStackParamList>();

export function StackNavigator() {
    const user = useSelector(selectUserData)


    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {user === null ? (
                <>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Register" component={RegisterScreen} />
                </>
            ) : (
                <>
                    <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
                    <Stack.Screen name="ChatBox" component={ChatBox} />
                    <Stack.Screen name="EmployeeProfile" component={EmployeeProfile} />
                    <Stack.Screen name="CallScreen" component={CallScreen} />
                    <Stack.Screen name="TaskDetail" component={TaskDetail} initialParams={{ TaskId: '1' }} />
                </>
            )}
        </Stack.Navigator>
    );
}
