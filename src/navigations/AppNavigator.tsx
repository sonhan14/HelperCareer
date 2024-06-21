// src/navigation/AppNavigator.tsx
import * as React from 'react';
import { NavigationContainer, DefaultTheme, Theme } from '@react-navigation/native';
import { Text } from 'react-native';
import { StackNavigator } from './StackNavigation';

// const MyTheme: Theme = {
//     ...DefaultTheme,
//     colors: {
//         ...DefaultTheme.colors,
//         background: 'rgba(32, 21, 32, 1)',
//         text: 'white',
//     },
// };




export default function AppNavigator() {
    return (
        <NavigationContainer fallback={<Text>Loading...</Text>}>
            <StackNavigator />
        </NavigationContainer>
    );
}
