import { StackNavigationProp } from "@react-navigation/stack";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { RootStackParamList } from "../../navigations/navigation";
import { useNavigation } from "@react-navigation/native";
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
import { useSelector } from "react-redux";

type ChatScreenNavigationProp = StackNavigationProp<RootStackParamList>;




export const ChatScreen = () => {
    const navigation = useNavigation<ChatScreenNavigationProp>()
    const userData = useSelector(selectUserData);
    const [boxData, setBoxData] = useState<messagesBox[]>([])

    const AvatarFlatlist = () => {
        const renderItem = ({ item }: { item: messagesBox }) => (
            <TouchableOpacity style={{ margin: 10, alignItems: 'center' }} onPress={() => goToChat(item.received_id, item.id, item.name)}>
                <Image
                    source={images.avartar_pic}
                    style={{ width: 60, height: 60, borderRadius: 30 }}
                />
                <Text style={{ marginTop: 5, color: 'black' }}>{truncateText(item.name, 6)}</Text>
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
        const unsubscribe = firestore()
            .collection('chats')
            .where('members', 'array-contains', userData?.id)
            .onSnapshot(async (querySnapshot) => {
                const filteredChats: any[] = [];
                const promises = querySnapshot.docs.map(async (documentSnapshot) => {
                    const data = documentSnapshot.data();
                    const members = data.members;
                    const receive_id = members.filter((member: any) => member !== userData?.id);
                    const avatarRef = storage().ref(`users/${receive_id[0]}/avatar.jpg`);
                    let avatarDownloadUrl;
                    try {
                        avatarDownloadUrl = await avatarRef.getDownloadURL();
                    } catch (error) {
                        avatarDownloadUrl = images.avartar_pic;
                    }

                    const userSnapshot = await firestore().collection('users').doc(receive_id[0]).get();
                    const receive_info = userSnapshot.data();

                    filteredChats.push({
                        id: documentSnapshot.id,
                        name: receive_info?.last_name + ' ' + receive_info?.first_name,
                        avatar: avatarDownloadUrl,
                        received_id: receive_id[0],
                        lastMessage: data.lastMessage || '',
                        lastMessageTimestamp: data.lastMessageTimestamp || firestore.Timestamp.now(),
                    });
                });

                await Promise.all(promises);
                setBoxData(filteredChats);
            }, (error) => {
                console.error('Error getting documents: ', error);
            });

        return unsubscribe;
    };

    useEffect(() => {
        if (userData) {
            const unsubscribe = subscribeToChat();
            return () => unsubscribe();
            
        }
    }, [userData]);

    const goToChat = (receiverId: string, chatBoxId: string, receiverName: string) => {
        navigation.navigate('ChatBox', {receiverId: receiverId, chatId: chatBoxId, receiverName: receiverName})
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
            <View style={styles.avatar_list_container}>
                <AvatarFlatlist />
            </View>
            <MessagesBoxList boxData={boxData} goToChat={goToChat}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 10
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
})