import { StackNavigationProp } from "@react-navigation/stack";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { RootStackParamList } from "../../navigations/navigation";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { layout } from "../../constants/dimensions/dimension";
import Icon from "react-native-vector-icons/AntDesign"
import { images } from "../../images";
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useEffect, useState } from "react";
import storage from '@react-native-firebase/storage';
import { formatDate } from "../../constants/formatDate";
import { truncateText } from "../../helpers/truncateText";
import { messagesBox } from "../../../types/messageBox";
import { MessagesBoxList } from "./chat-box-list";
import { selectUserData } from "../../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { iUser } from "../../../types/userType";
import FastImage from "react-native-fast-image";
import { useTask } from "../../context/EmployeeContext";
import { setNewChat } from "../../redux/chat/chatSlice";

type ChatScreenNavigationProp = StackNavigationProp<RootStackParamList>;




export const ChatScreen = () => {
    const navigation = useNavigation<ChatScreenNavigationProp>()
    const userData = useSelector(selectUserData);
    const [boxData, setBoxData] = useState<messagesBox[]>([])
    const disptach = useDispatch()
    const isFocused = useIsFocused();

    const AvatarFlatlist = () => {
        const renderItem = ({ item }: { item: messagesBox }) => (
            <TouchableOpacity style={{ margin: 10, alignItems: 'center' }} onPress={() => goToChat(item.receiver, item.id,)}>
                <Image
                    source={{ uri: item.receiver.avatar }}
                    style={{ width: 60, height: 60, borderRadius: 30 }}
                />
                <Text style={{ marginTop: 5, color: 'black' }}>{truncateText(item.receiver.last_name + ' ' + item.receiver.first_name, 6)}</Text>
            </TouchableOpacity>
        );

        return (
            <FlatList
                data={boxData}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                renderItem={(renderItem)}
            />
        );
    };

    const subscribeToChat = () => {
        const unsubscribeChat = firestore()
            .collection('chats')
            .where('members', 'array-contains', userData?.id)
            .onSnapshot(async (querySnapshot) => {
                const filteredChats: messagesBox[] = [];
                const promises = querySnapshot.docs.map(async (documentSnapshot) => {
                    const data = documentSnapshot.data();
                    const members = data.members;
                    const receive_id = members.filter((member: any) => member !== userData?.id)[0];
                    // Fetch user details synchronously
                    const userSnapshot = await firestore().collection('users').doc(receive_id).get();
                    const userDoc = userSnapshot.data();

                    if (userDoc) {
                        const userData: iUser = {
                            id: receive_id,
                            birthday: formatDate(userDoc.birthday),
                            first_name: userDoc.first_name,
                            last_name: userDoc.last_name,
                            gender: userDoc.gender,
                            introduction: userDoc.introduction,
                            phone: userDoc.phone,
                            rating: userDoc.rating,
                            email: userDoc.email,
                            fcmToken: userDoc.fcmToken,
                            avatar: userDoc.avatar,
                            cover: userDoc.cover,
                            longitude: userDoc?.location.longitude,
                            latitude: userDoc?.location.latitude
                        };

                        filteredChats.push({
                            id: documentSnapshot.id,
                            receiver: userData,
                            lastMessage: data.lastMessage || '',
                            lastMessageTimestamp: data.lastMessageTimestamp || firestore.Timestamp.now(),
                        });
                    }
                });

                await Promise.all(promises);
                filteredChats.sort((a, b) => b.lastMessageTimestamp.toMillis() - a.lastMessageTimestamp.toMillis());
                setBoxData(filteredChats);
            }, (error) => {
                console.error('Error getting documents: ', error);
            });

        return () => {
            unsubscribeChat();
        };
    };



    useEffect(() => {
        if (!userData) return;

        const unsubscribe = subscribeToChat()

        return () => unsubscribe()
    }, [userData]);

    useEffect(() => {
        if (isFocused) {
            disptach(setNewChat(0))
        }
    }, [isFocused])


    const goToChat = (receiver: iUser, chatBoxId: string) => {
        navigation.navigate('ChatBox', { receiver: receiver, chatId: chatBoxId, })
    }



    return (
        <View style={styles.container}>
            <View style={styles.header_container}>
                <TouchableOpacity style={styles.button_back}>
                    <Icon name="edit" size={30} color={'black'} />
                </TouchableOpacity>
                <View style={styles.header_title}>
                    <Text style={styles.text_title}>Messages</Text>
                </View>
                <TouchableOpacity style={styles.button_back}>
                    <Icon name="plus" size={30} color={'black'} />
                </TouchableOpacity>
            </View>
            {boxData.length !== 0 ?
                <>
                    <View style={styles.avatar_list_container}>
                        <AvatarFlatlist />
                    </View>
                    <MessagesBoxList boxData={boxData} goToChat={goToChat} />
                </>
                :
                <View style={styles.image_container}>
                    <FastImage source={images.chat_empty} resizeMode="contain" style={{ height: layout.height * 0.5, width: layout.width - 20 }} />
                </View>
            }

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 10,
        backgroundColor: 'white'
    },
    header_container: {
        height: layout.height * 0.05,
        width: layout.width,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    button_back: {
        height: '100%',
        width: '15%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    header_title: {
        height: '100%',
        width: '70%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    text_title: {
        fontSize: 24,
        fontWeight: '800',
        color: 'black'
    },
    avatar_list_container: {
        height: layout.height * 0.15,
        width: layout.width - 20,
        marginTop: 20,
        justifyContent: 'center',

    },

    image_container: {
        flex: 1,
        justifyContent: 'center'
    }
})