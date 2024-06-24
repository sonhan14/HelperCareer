// src/navigation/BottomTabNavigator.tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as React from 'react';
import { RootStackParamList, RootTabParamList } from './navigation';
import { View } from 'react-native';
import { HomeScreen } from '../screens/home/home-screen';
import { ProfileScreen } from '../screens/profile/profile-screen';

type BottomTabNavigatorProps = {
    route: { params: RootStackParamList['MainTabs'] };
};


const Tab = createBottomTabNavigator<RootTabParamList>();

export function BottomTabNavigator({ route }: BottomTabNavigatorProps) {
    const  user  = route.params;
    console.log(user);
    
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName: string;

                    switch (route.name) {
                        case 'Home':
                            iconName = 'home';
                            break;
                        case 'Profile':
                            iconName = 'edit';
                            break;
                        default:
                            iconName = 'circle';
                            break;
                    }

                    return (
                        <View style={[{ alignItems: 'center' }]}>
                            <Icon name={iconName} size={size} color={color} />
                        </View>
                    )
                },
                tabBarActiveTintColor: '#f0c14b',
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: {
                    backgroundColor: '#333',
                    borderTopWidth: 0,
                },
                headerShown: false,
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} initialParams={user}/>
            <Tab.Screen name="Profile" component={ProfileScreen} initialParams={user} />
        </Tab.Navigator>
    );
}
