import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { iUser } from '../../../types/userType';
import { formatDate } from '../../constants/formatDate';

export const getData = async (userData: iUser) => {

    const snapshot = await firestore().collection('users').doc(userData?.id).get();
    if (snapshot.exists && userData?.id) {
        const doc = snapshot.data();
        const formattedUserData: iUser = {
            id: userData.id,
            birthday: formatDate(doc?.birthday),
            first_name: doc?.first_name,
            last_name: doc?.last_name,
            gender: doc?.gender,
            introduction: doc?.introduction,
            phone: doc?.phone,
            rating: doc?.rating,
            role: doc?.role,
            email: doc?.email,
            fcmToken: doc?.fcmToken
        };
    } else {
        console.log("No user found with the given ID");
    }
};