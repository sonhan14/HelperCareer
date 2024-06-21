import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './navigation';
import { LoginScreen } from '../screens/Login/login-screen';
import { BottomTabNavigator } from './BottomTabNavigator';
import { RegisterScreen } from '../screens/register/register-screen';



const Stack = createStackNavigator<RootStackParamList>();

export function StackNavigator() {

    return (
        <Stack.Navigator initialRouteName='Login' screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
        </Stack.Navigator>
    );
}
