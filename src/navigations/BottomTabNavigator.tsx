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
import { EmployeeProvider, useTask } from '../context/EmployeeContext';
import { color } from '../constants/colors/color';
import firestore from '@react-native-firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserData } from '../redux/user/userSlice';
import { selectLastChat, selectNewChat, setLastChat, setNewChat } from '../redux/chat/chatSlice';



const Tab = createBottomTabNavigator<RootTabParamList>();

export function BottomTabNavigator() {
    const dispatch = useDispatch()
    const { isTask } = useTask()
    const userData = useSelector(selectUserData)
    const newChat = useSelector(selectNewChat)
    const lastChat = useSelector(selectLastChat)
    const [update, setUpdate] = React.useState<number>()

    const subscribeToChat = async () => {
        const unsubscribeChat = await firestore()
            .collection('chats')
            .where('members', 'array-contains', userData?.id)
            .onSnapshot(async (querySnapshot) => {
                const filteredChatsCount = querySnapshot.size;
                if (filteredChatsCount > lastChat) {
                    const newChatsCount = filteredChatsCount - lastChat
                    setUpdate(filteredChatsCount)
                }
            }, (error) => {
                console.error('Error getting documents: ', error);
            });

        return () => {
            unsubscribeChat();
        };
    };


    React.useEffect(() => {
        subscribeToChat()
    }, [userData])

    React.useEffect(() => {
        if (update) {
            if (update > lastChat) {
                const newChatsCount = update - lastChat
                dispatch(setNewChat(newChatsCount))
            }
            dispatch(setLastChat(update))
        }
    }, [update])
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
                tabBarActiveTintColor: color.main_blue,
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: {
                    display: isTask === 1 ? 'none' : 'flex',
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
            <Tab.Screen name="Chat" component={ChatScreen} options={{ tabBarBadge: newChat > 0 ? newChat : undefined }} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}
