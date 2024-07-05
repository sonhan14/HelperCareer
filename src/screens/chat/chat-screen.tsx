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

type ChatScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const formatDate = (date: Date): string => {

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
};


type messagesBox = {
    id: string,
    received_id: string,
    avatar: any,
    name: string,
    lastMessage: string,
    lastMessageTimestamp: any,
}





const truncateText = (text: string, limit: number) => {
    if (text.length <= limit) {
        return text;
    }
    return text.substring(0, limit) + '...';
};



export const ChatScreen = () => {
    const navigation = useNavigation<ChatScreenNavigationProp>()
    const currentUser = auth().currentUser
    const [boxData, setBoxData] = useState<messagesBox[]>([])

    const AvatarFlatlist = () => {
        const renderItem = ({ item }: { item: messagesBox }) => (
            <TouchableOpacity style={{ margin: 10, alignItems: 'center' }} onPress={() => goToChat(item.received_id, item.id)}>
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

    const MessagesBoxList = () => {
        const renderItem = ({ item }: { item: messagesBox }) => (
            <TouchableOpacity style={styles.message_box_container} onPress={() => goToChat(item.received_id, item.id)}>
                <View style={styles.message_box_avatar}>
                    <Image
                        source={images.avartar_pic}
                        style={{ width: '80%', height: '80%', borderRadius: 50 }}
                    />
                </View>
                <View style={styles.message_box_text}>
                    <Text style={styles.text_name}>{item.name}</Text>
                    <Text style={styles.text_message}>{truncateText(item.lastMessage, 20)}</Text>
                </View>
                <View style={styles.message_box_time}>
                    <Text style={styles.text_time}>{formatDate(item.lastMessageTimestamp.toDate())}</Text>
                </View>
            </TouchableOpacity>
        );

        return (
            <FlatList
                data={boxData}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                renderItem={(renderItem)}
            />
        );
    };

    const subscribeToChat = () => {
        const unsubscribe = firestore()
            .collection('chats')
            .where('members', 'array-contains', currentUser?.uid)
            .onSnapshot(async (querySnapshot) => {
                const filteredChats: any[] = [];
                const promises = querySnapshot.docs.map(async (documentSnapshot) => {
                    const data = documentSnapshot.data();
                    const members = data.members;
                    const receive_id = members.filter((member: any) => member !== currentUser?.uid);
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
        if (currentUser) {
            const unsubscribe = subscribeToChat();
            return () => unsubscribe();
        }
    }, [currentUser]);

    const goToChat = (receiverId: string, chatBoxId: string) => {
        navigation.navigate('ChatBox', {receiverId: receiverId, chatId: chatBoxId})
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

            <MessagesBoxList />

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 10
    },
    header_container: {
        height: layout.height * 0.05,
        width: layout.width - 20,
        flexDirection: 'row',
        alignItems: 'center',
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
    message_box_container: {
        height: layout.height * 0.1,
        width: layout.width - 20,
        marginVertical: 5,
        flexDirection: 'row'
    },
    message_box_avatar: {
        height: '100%',
        width: '20%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    message_box_text: {
        height: '100%',
        width: '65%',
        paddingLeft: 5,
        justifyContent: 'center'
    },
    text_name: {
        color: 'black',
        fontSize: 18,
        fontWeight: '700'
    },
    text_message: {
        color: 'black',
        fontSize: 15,
        fontWeight: '400'
    },
    message_box_time: {
        width: '20%',
        height: '100%',
        justifyContent: 'center'
    },
    text_time: {
        color: 'black',
        fontWeight: '200'
    }
})