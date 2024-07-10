// src/navigation/BottomTabNavigator.tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as React from 'react';
import { RootStackParamList, RootTabParamList } from './navigation';
import { View } from 'react-native';
import { HomeScreen } from '../screens/home/home-screen';
import { ProfileScreen } from '../screens/profile/profile-screen';
import { layout } from '../constants/dimensions/dimension';
import { ChatScreen } from '../screens/chat/chat-screen';
import { TaskScreen } from '../screens/tasks/tasks-screen';
import { EmployeeProvider, useEmployee } from '../context/EmployeeContext';



const Tab = createBottomTabNavigator<RootTabParamList>();

export function BottomTabNavigator() {
    const { isEmployee } = useEmployee();
    
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
                            case 'Chat':
                                iconName = 'wechat';
                                break;
                            case 'Tasks':
                                iconName = 'tasks';
                                break;
                            default:
                                iconName = 'circle';
                                break;
                        }

                        return (
                            <View style={[{ alignItems: 'center', }]}>
                                <Icon name={iconName} size={size} color={color} />
                            </View>
                        )
                    },
                    tabBarActiveTintColor: '#f0c14b',
                    tabBarInactiveTintColor: 'gray',
                    tabBarStyle: {
                        display: isEmployee === 1 ? 'none' : 'flex',
                        backgroundColor: 'white',
                        borderTopWidth: 0,
                        width: '90%',
                        borderRadius: 10, marginBottom: 10,
                        marginLeft: layout.width * 0.1 / 2,
                        position: 'absolute'

                    },
                    headerShown: false,
                })}
            >
                <Tab.Screen name="Home" component={HomeScreen} />
                <Tab.Screen name="Tasks" component={TaskScreen} />
                <Tab.Screen name="Chat" component={ChatScreen} />
                <Tab.Screen name="Profile" component={ProfileScreen} />
            </Tab.Navigator>
    );
}
