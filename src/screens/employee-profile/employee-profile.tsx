import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { RootStackParamList } from "../../navigations/navigation";
import firestore from '@react-native-firebase/firestore';
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { layout } from "../../constants/dimensions/dimension";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { images } from "../../images";
import { Appbar, SegmentedButtons } from "react-native-paper";
import storage from '@react-native-firebase/storage';
import { iUser } from "../../../types/userType";
import ProfileImageSection from "../../components/cover-avatar";
import SweepButton from "../../components/sweep-button";
import auth from '@react-native-firebase/auth';

type EmployeeFrofileProps = {
    route: { params: RootStackParamList['EmployeeProfile'] };
};

type EmployeeFrofileProp = StackNavigationProp<RootStackParamList>;


const formatDate = (date: Date): string => {

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
};

export const EmployeeProfile = ({ route }: EmployeeFrofileProps) => {
    const employeeID = route.params.employeeId
    const [user, setUser] = useState<iUser | null>(null);
    const [value, setValue] = useState('dicuss');
    const currentUser = auth().currentUser

    const [image, setImage] = useState({
        avatar: images.avartar_pic,
        cover: images.background_pic,
    })

    const [loading, setLoading] = useState({
        avatarLoading: false,
        coverLoading: false
    });

    const navigation = useNavigation<EmployeeFrofileProp>()

    const getDetail = async () => {
        const snapshot = await firestore().collection('users').doc(employeeID).get();
        if (snapshot.exists) {
            const doc = snapshot.data();
            const formattedUserData: iUser = {
                birthday: formatDate(doc?.birthday.toDate()),
                first_name: doc?.first_name,
                last_name: doc?.last_name,
                gender: doc?.gender,
                introduction: doc?.introduction,
                phone: doc?.phone,
                rating: doc?.rating,
            };

            setUser(formattedUserData);
        } else {
            console.log("No user found with the given ID");
        }
    }

    const handleChat = () => {
        const memberIds = [employeeID, currentUser?.uid];
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
                console.log(filteredChats);
                navigation.navigate('ChatBox', { receiverId: employeeID, chatId: filteredChats.length ? filteredChats[0].id : null });
            })
            .catch(error => {
                console.error('Error getting documents: ', error);
            });
    };


    const handleBack = () => {
        navigation.goBack()
    }

    const getImgae = async () => {
        setLoading(prev => ({
            ...prev, avatarLoading: true
        }))

        setLoading(prev => ({
            ...prev, coverLoading: true
        }))
        const avatarRef = storage().ref(`users/${employeeID}/avatar.jpg`);
        try {
            const avatarDownloadUrl = await avatarRef.getDownloadURL();
            setImage(prev => ({
                ...prev, avatar: avatarDownloadUrl
            }));

        } catch (error) {
            setImage(prev => ({
                ...prev, avatar: images.avartar_pic
            }));
        }

        const coverRef = storage().ref(`users/${employeeID}/cover.jpg`);
        try {
            const coverDownloadUrl = await coverRef.getDownloadURL();
            setImage(prev => ({
                ...prev, cover: coverDownloadUrl
            }));


        } catch (error) {
            setImage(prev => ({
                ...prev, cover: images.background_pic
            }));
        }
        setLoading(prev => ({
            ...prev, avatarLoading: false
        }))
        setLoading(prev => ({
            ...prev, coverLoading: false
        }))
    }

    useEffect(() => {
        getImgae()
        getDetail()
    }, [])

    return (
        <View style={styles.container}>
            <Appbar.Header style={styles.header_container}>
                <Appbar.BackAction onPress={() => { handleBack() }} />
                <Appbar.Content title={user ? `${user.first_name}'s Profile` : 'Loading...'} titleStyle={{ color: 'black', fontWeight: '700' }} />
            </Appbar.Header>
            <View style={styles.profile_image}>
                <ProfileImageSection
                    image={image}
                    loading={loading}
                    pickImages={() => { }}
                    user={user}
                    isEditable={false}
                />
            </View>

            <SegmentedButtons
                value={value}
                onValueChange={setValue}
                buttons={[
                    {
                        value: 'dicuss',
                        label: 'Discuss',
                        style: [styles.segment_button, {
                            width: '20%'
                        }],
                        labelStyle: styles.label_style
                    },
                    {
                        value: 'task',
                        label: 'Tasks',
                        style: styles.segment_button,
                        labelStyle: styles.label_style
                    },
                    {
                        value: 'review',
                        label: 'Reviews',
                        style: styles.segment_button,
                        labelStyle: styles.label_style
                    },
                ]}
                style={styles.segment_container}
            />

            <View style={styles.intro_container}>
                <Text style={styles.text_15}>{user?.introduction ? user?.introduction : 'Hello, My name is ' + user?.first_name}</Text>
            </View>

            <View style={{ width: layout.width - 20 }}>
                <SweepButton onPress={() => { handleChat() }} iconName="wechat" label="Tap to Chat" />
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    header_container: {
        height: layout.height * 0.06,
        width: layout.width,
    },
    segment_container: {
        width: layout.width - 20,
        marginTop: 15,
        borderWidth: 0
    },
    segment_button: {
        borderWidth: 0,
    },
    profile_image: {
        width: layout.width
    },
    label_style: {
        fontSize: 18,
        fontWeight: '600',
        color: 'black'
    },
    intro_container: {
        height: layout.height * 0.2,
        width: layout.width - 20,
        marginTop: 25,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'black',
        padding: 10
    },
    text_15: {
        color: 'black',
        fontWeight: '400',
        fontSize: 15
    },

})