// src/navigation/AppNavigator.tsx
import * as React from 'react';
import { NavigationContainer, DefaultTheme, Theme, useNavigation } from '@react-navigation/native';
import { ActivityIndicator, Text, View } from 'react-native';
import { StackNavigator } from './StackNavigation';
import { EmployeeProvider } from '../context/EmployeeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from "@react-native-firebase/auth";
import firestore from '@react-native-firebase/firestore';
import { iUser } from '../../types/userType';
import { formatDate } from '../constants/formatDate';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/user/userSlice';
import VideoProvider from '../context/videoContext';
import CallProvider from '../context/CallContext';
import messaging from '@react-native-firebase/messaging';
import { RootStackParamList } from './navigation';


export default function AppNavigator() {
    const [loading, setLoading] = React.useState(false)
    const dispatch = useDispatch();
    async function requestUserPermission() {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
            console.log('Authorization status:', authStatus);
        }
    }

    const getToken = async () => {
        const token = await messaging().getToken()
        await AsyncStorage.setItem("FCMToken", token)
    }

    React.useEffect(() => {
        requestUserPermission()
        getToken()

    })


    React.useEffect(() => {
        const checkuser = async () => {
            try {
                setLoading(true)
                const userEmail = await AsyncStorage.getItem('userEmail');
                const userPassword = await AsyncStorage.getItem('userPassword');
                if (userEmail && userPassword) {
                    try {
                        const response = await auth().signInWithEmailAndPassword(userEmail, userPassword);
                        if (response?.user) {
                            const currentUser = await firestore().collection('users').doc(response.user.uid).get()
                            const check = currentUser.data()
                            // if (check?.role === 'Owner') {
                            const formattedUserData: iUser = {
                                id: response.user.uid,
                                birthday: formatDate(check?.birthday),
                                first_name: check?.first_name,
                                last_name: check?.last_name,
                                gender: check?.gender,
                                introduction: check?.introduction,
                                phone: check?.phone,
                                rating: check?.rating,
                                role: check?.role,
                                email: userEmail,
                                fcmToken: check?.fcmToken,
                                avatar: check?.avatar,
                                cover: check?.cover,
                                longitude: check?.location.longitude,
                                latitude: check?.location.latitude
                            };
                            await dispatch(setUserData(formattedUserData));
                            // }
                            // else {
                            //     auth().signOut()
                            // }
                        }

                    } catch (error) {
                        console.error('Token invalid or expired', error);
                    }
                }
                setLoading(false)
            } catch (error) {
                console.log('Logging error: ', error);
            }
        }
        checkuser()
    }, [])


    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size={'large'} />
            </View>
        )
    }
    return (
        <EmployeeProvider>
            <NavigationContainer >
                <StackNavigator />
            </NavigationContainer>
        </EmployeeProvider>
    );
}
