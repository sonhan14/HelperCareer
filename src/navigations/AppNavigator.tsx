// src/navigation/AppNavigator.tsx
import * as React from 'react';
import { NavigationContainer, DefaultTheme, Theme } from '@react-navigation/native';
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

// const MyTheme: Theme = {
//     ...DefaultTheme,
//     colors: {
//         ...DefaultTheme.colors,
//         background: 'rgba(32, 21, 32, 1)',
//         text: 'white',
//     },
// };




export default function AppNavigator() {
    const [loading, setLoading] = React.useState(false)
    const dispatch = useDispatch();

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
                            if (check?.role === 'Owner') {
                                const formattedUserData: iUser = {
                                    id: response.user.uid,
                                    birthday: formatDate(check?.birthday.toDate()),
                                    first_name: check?.first_name,
                                    last_name: check?.last_name,
                                    gender: check?.gender,
                                    introduction: check?.introduction,
                                    phone: check?.phone,
                                    rating: check?.rating,
                                    role: check?.role,
                                    email: userEmail
                                };
                                dispatch(setUserData(formattedUserData));
                            }
                            else {
                                auth().signOut()
                            }
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
        <NavigationContainer>
            <StackNavigator />
        </NavigationContainer>
        </EmployeeProvider>
    );
}
