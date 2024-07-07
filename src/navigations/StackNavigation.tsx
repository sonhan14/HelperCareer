import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './navigation';
import { LoginScreen } from '../screens/Login/login-screen';
import { BottomTabNavigator } from './BottomTabNavigator';
import { RegisterScreen } from '../screens/register/register-screen';
import { ChatBox } from '../screens/chat/chat-box-screen';
import { EmployeeProfile } from '../screens/employee-profile/employee-profile';
import { TaskDetail } from '../screens/tasks/task-detail';
import { TaskType } from '../../types/taskType';



const Stack = createStackNavigator<RootStackParamList>();

export function StackNavigator() {

    return (
        <Stack.Navigator initialRouteName='Login' screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
            <Stack.Screen name="ChatBox" component={ChatBox} />
            <Stack.Screen name="EmployeeProfile" component={EmployeeProfile} />
            <Stack.Screen name="TaskDetail" component={TaskDetail} initialParams={{TaskId: '1'}}/>
        </Stack.Navigator>
    );
}
