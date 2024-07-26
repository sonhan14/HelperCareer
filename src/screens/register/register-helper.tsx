import firestore, { GeoPoint } from '@react-native-firebase/firestore';
import { accountInfo } from './register-modal';
import { Feature } from '../../../types/homeTypes';
import auth, { firebase, FirebaseAuthTypes } from "@react-native-firebase/auth";
import { iUser } from '../../../types/userType';
import { formatDate } from '../../constants/formatDate';
import { setUserData } from '../../redux/user/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import storage from '@react-native-firebase/storage';


interface iAddInfo {
    password: string,
    userId: string,
    account: accountInfo,
    email: string,
    image: string,
    selectedLocation: Feature,
    dispatch: any,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

interface doCreateUserProps {
    setLoading: any,
    setIsModal: React.Dispatch<React.SetStateAction<{
        showModal: boolean;
        userId: string;
        email: string;
        password: string;
    }>>,
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>
    setNotificationVisible: React.Dispatch<React.SetStateAction<boolean>>
    account: {
        email: string;
        password: string;
        rePassword: string;
    }
}

export const AddInfo = async ({ password, userId, account, email, image, selectedLocation, dispatch, setLoading }: iAddInfo) => {
    setLoading(true)
    const uploadUri = Platform.OS === 'ios' ? image.replace('file://', '') : image;
    const storageRef = await storage().ref(`users/${userId}/avatar.jpg`);
    await storageRef.putFile(uploadUri);
    await firestore()
        .collection('users')
        .doc(userId)
        .set({
            first_name: account.first_name,
            last_name: account.last_name,
            gender: account.gender,
            birthday: account.birth_day,
            introduction: account.intro,
            phone: account.phone,
            rating: 5.0,
            email: email,
            role: 'Owner',
            fcmToken: 'abc',
            avatar: image,
            cover: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            location: new GeoPoint(selectedLocation.center[1], selectedLocation.center[0])
        })
        .then(async () => {
            try {
                const response = await auth().signInWithEmailAndPassword(email, password);
                if (response?.user) {
                    const currentUser = await firestore().collection('users').doc(response.user.uid).get()
                    const check = currentUser.data()
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
                        email: email,
                        fcmToken: check?.fcmToken,
                        avatar: check?.avatar,
                        cover: check?.cover,
                        longitude: check?.location.longitude,
                        latitude: check?.location.latitude
                    };
                    dispatch(setUserData(formattedUserData));
                    await AsyncStorage.setItem('userEmail', email);
                    await AsyncStorage.setItem('userPassword', password);
                    const fcmToken = await messaging().getToken();
                    if (fcmToken) {
                        await firestore().collection('users').doc(response.user.uid).update({ fcmToken });
                    }
                }
            } catch (error) {
                throw error
            }
            finally {
                setLoading(false)
            }
        })
}

export const __doCreateUser = async ({ setLoading, setIsModal, setErrorMessage, setNotificationVisible, account }: doCreateUserProps) => {
    setLoading(true);
    try {
        // let response = await auth().createUserWithEmailAndPassword(account.email, account.password);
        // if (response) {
        //     setIsModal(prev => ({ ...prev, showModal: true, userId: response.user.uid, email: account.email, password: account.password }))
        // }
        setIsModal(prev => ({ ...prev, showModal: true, userId: '', email: account.email }))
    } catch (e: unknown) {
        const error = e as FirebaseAuthTypes.NativeFirebaseAuthError;
        if (error.code === 'auth/email-already-in-use') {
            setErrorMessage('That email address is already in use!')
        }
        if (error.code === 'auth/invalid-email') {
            setErrorMessage('That email address is invalid!')
        }
        setNotificationVisible(true)
    } finally {
        setLoading(false);
    }
};
