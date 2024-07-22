
import firestore from '@react-native-firebase/firestore';
import { formatDate } from '../../constants/formatDate';
import { iUser } from '../../../types/userType';
import storage from '@react-native-firebase/storage';
import { images } from '../../images';
import { RootStackParamList } from '../../navigations/navigation';
import { StackNavigationProp } from '@react-navigation/stack';


type EmployeeFrofileProp = StackNavigationProp<RootStackParamList>;


export const handleChat = (employee: iUser, userId: any, navigation: EmployeeFrofileProp,) => {
    const memberIds = [employee.id, userId];
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
            navigation.navigate('ChatBox', { receiver: employee, chatId: filteredChats.length ? filteredChats[0].id : null, });
        })
        .catch(error => {
            console.error('Error getting documents: ', error);
        });
};

export const getDetail = (employeeID: string, setUser: any, setImage: any) => {
    const snapshot = firestore().collection('users').doc(employeeID).onSnapshot(async (querySnapshot) => {
        const doc = querySnapshot.data();
        if (doc) {
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
                longitude: doc?.location.longitude,
                latitude: doc?.location.latitude
            };

            setImage((prev: any) => ({
                ...prev, avatar: formattedUserData.avatar, cover: formattedUserData.cover
            }))
            setUser(formattedUserData);
        }
    }, (error) => {
        console.error('Error fetching user details from Firestore: ', error);
    })
    return () => {
        snapshot();
    };
}
