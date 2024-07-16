
import firestore from '@react-native-firebase/firestore';
import { formatDate } from '../../constants/formatDate';
import { iUser } from '../../../types/userType';
import storage from '@react-native-firebase/storage';
import { images } from '../../images';
import { RootStackParamList } from '../../navigations/navigation';
import { StackNavigationProp } from '@react-navigation/stack';


type EmployeeFrofileProp = StackNavigationProp<RootStackParamList>;


export const handleChat = (employeeID: string, userId: any, navigation: EmployeeFrofileProp, receiverName: string, fcmToken: string) => {
    const memberIds = [employeeID, userId];
    const filteredChats: any[] = [];

    firestore().collection('chats').where('members', 'array-contains', memberIds[0])
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(documentSnapshot => {
                const data = documentSnapshot.data();
                if (data.members.includes(memberIds[1])) {
                    filteredChats.push({
                        id: documentSnapshot.id,
                        ...data
                    });
                }
            });
            navigation.navigate('ChatBox', { receiverId: employeeID, chatId: filteredChats.length ? filteredChats[0].id : null, receiverName: receiverName, fcmToken: fcmToken });
        })
        .catch(error => {
            console.error('Error getting documents: ', error);
        });
};

export const getDetail = async (employeeID: string, setUser: any,) => {
    const snapshot = await firestore().collection('users').doc(employeeID).get();
    if (snapshot.exists) {
        const doc = snapshot.data();
        const formattedUserData: iUser = {
            id: employeeID,
            birthday: formatDate(doc?.birthday),
            first_name: doc?.first_name,
            last_name: doc?.last_name,
            gender: doc?.gender,
            introduction: doc?.introduction,
            phone: doc?.phone,
            rating: doc?.rating,
            email: doc?.email,
            fcmToken: doc?.fcmToken,
            avatar: doc?.avatar,
            cover: doc?.cover,
        };

        setUser(formattedUserData);
    } else {
        console.log("No user found with the given ID");
    }
}

export const getImgae = async (setLoading: any, setImage: any, employeeID: string) => {
    setLoading((prev: any) => ({
        ...prev, avatarLoading: true
    }))

    setLoading((prev: any) => ({
        ...prev, coverLoading: true
    }))
    const avatarRef = storage().ref(`users/${employeeID}/avatar.jpg`);
    try {
        const avatarDownloadUrl = await avatarRef.getDownloadURL();
        setImage((prev: any) => ({
            ...prev, avatar: avatarDownloadUrl
        }));

    } catch (error) {
        setImage((prev: any) => ({
            ...prev, avatar: images.avartar_pic
        }));
    }

    const coverRef = storage().ref(`users/${employeeID}/cover.jpg`);
    try {
        const coverDownloadUrl = await coverRef.getDownloadURL();
        setImage((prev: any) => ({
            ...prev, cover: coverDownloadUrl
        }));


    } catch (error) {
        setImage((prev: any) => ({
            ...prev, cover: images.background_pic
        }));
    }
    setLoading((prev: any) => ({
        ...prev, avatarLoading: false
    }))
    setLoading((prev: any) => ({
        ...prev, coverLoading: false
    }))
}