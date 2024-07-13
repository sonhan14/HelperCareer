import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import React, { useState, useCallback, useEffect, useLayoutEffect } from 'react'
import { Bubble, GiftedChat, IMessage, Send } from 'react-native-gifted-chat'
import { images } from "../../images";
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { color } from "../../constants/colors/color";
import { layout } from "../../constants/dimensions/dimension";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigations/navigation";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { selectUserData } from "../../redux/user/userSlice";
import { Call, StreamVideoClient, useStreamVideoClient } from "@stream-io/video-react-native-sdk";
import { createUser } from "../../helpers/createUserStrem";
import { generateRandomId } from "../../helpers/randomId";
type ChatBoxNavigationProp = StackNavigationProp<RootStackParamList>;

type ChatBoxProps = {
    route: { params: RootStackParamList['ChatBox'] };
};



export const ChatBox = ({ route }: ChatBoxProps) => {
    const [messages, setMessages] = useState<IMessage[]>([])
    const userData = useSelector(selectUserData);

    const navigation = useNavigation<ChatBoxNavigationProp>()
    const receiverId = route.params.receiverId
    const receiverName = route.params.receiverName
    const [chatBoxId, setChatBoxId] = useState<string>(route.params.chatId)
    const [call, setCall] = useState<Call | null>(null);
    const client = useStreamVideoClient();


    const [image, setImage] = useState({
        sender_avatar: images.avartar_pic,
        receiver_avatar: images.avartar_pic,
    })


    useEffect(() => {
        getImgae()
        console.log(chatBoxId);

    }, [chatBoxId])

    useLayoutEffect(() => {
        const unsubscribe = firestore().collection('chats').doc(chatBoxId).collection('messages').orderBy('createdAt', 'desc').onSnapshot(snapshot =>
            setMessages(
                snapshot.docs.map(doc => ({
                    _id: doc.data()._id,
                    text: doc.data().text,
                    createdAt: doc.data().createdAt.toDate(),
                    user: doc.data().user
                }))
            )

        )
        return unsubscribe
    }, [])

    const onSend = useCallback((messages: IMessage[] = []) => {
        setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, messages)
        );

        const {
            text,
            createdAt,
            user
        } = messages[0]

        const _id = Date.now().toString();

        if (chatBoxId === null) {
            firestore().collection('chats').add({
                lastMessage: text,
                lastMessageTimestamp: createdAt,
                members: [
                    receiverId,
                    userData?.id
                ]
            })
                .then(newChatRef => {
                    const newChatId = newChatRef.id;
                    setChatBoxId(newChatId);
                    firestore().collection('chats').doc(newChatId).collection('messages').add({
                        _id,
                        text,
                        createdAt,
                        user
                    })
                })
                .catch(error => {
                    console.error('Error sending message: ', error);
                })
        }

        else {
            firestore().collection('chats').doc(chatBoxId).collection('messages').add({
                _id,
                text,
                createdAt,
                user
            })
                .then(() => {
                    return firestore().collection('chats').doc(chatBoxId).update({
                        lastMessage: text,
                        lastMessageTimestamp: createdAt
                    });
                })
                .catch(error => {
                    console.error('Error sending message: ', error);
                })
        }



    }, [chatBoxId, userData, receiverId])

    const getImgae = async () => {

        const sender_avatarRef = storage().ref(`users/${userData?.id}/avatar.jpg`);
        try {
            const sender_avatarUrl = await sender_avatarRef.getDownloadURL();
            setImage(prev => ({
                ...prev, sender_avatar: sender_avatarUrl
            }));
        } catch (error) {
            setImage(prev => ({
                ...prev, sender_avatar: images.avartar_pic
            }));
        }

        const receiver_avatarRef = storage().ref(`users/${receiverId}/avatar.jpg`);
        try {
            const receiver_avatarURL = await receiver_avatarRef.getDownloadURL();
            setImage(prev => ({
                ...prev, receiver_avatar: receiver_avatarURL
            }));

        } catch (error) {
            setImage(prev => ({
                ...prev, receiver_avatar: images.avartar_pic
            }));

        }
    }

    const renderBubble = (props: any) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    left: {
                        backgroundColor: 'rgba(214, 239, 255, 1)'
                    },
                }}

                textStyle={{
                    left: {
                        fontWeight: '500'
                    },
                    right: {
                        fontWeight: '500'
                    }
                }}
            />
        )
    }

    const renderSend = (props: any) => {
        return (
            <Send  {...props}>
                <View>
                    <MaterialCommunityIcons name='send' size={32} color={color.blue_chat} style={{ marginBottom: 5 }} />
                </View>
            </Send>
        )
    }

    const handleBack = () => {
        navigation.goBack()
    }

    const handleCall = async () => {
        createUser(receiverId, receiverName)
        const callId = generateRandomId();

        if (!client || !userData) {
            return null
        }
        else {
            const newCall = client.call('default', callId);
            try {
                await newCall.getOrCreate({
                    ring: true,
                    data: {
                        members: [
                            { user_id: receiverId },
                            { user_id: userData.id }
                        ]
                    }
                });
                setCall(newCall);
            } catch (error) {
                console.error("Error creating or joining the call", error);
            }
            navigation.navigate('CallScreen', { receiverId: receiverId, receiverName: receiverName, call: newCall })
        }

    }

    return (
        <View style={styles.container}>
            <View style={styles.header_bar}>
                <TouchableOpacity style={styles.back_button} onPress={() => handleBack()}>
                    <MaterialCommunityIcons name="chevron-left" color={'black'} size={32} />
                </TouchableOpacity>
                <View style={styles.info_header}>
                    <View style={styles.avatar_container}>
                        <Image source={image.receiver_avatar === images.avartar_pic ? images.avartar_pic : { uri: image.receiver_avatar }} resizeMode='contain' style={{ height: '100%', width: '100%' }} />
                    </View>
                    <View style={styles.user_name_container}>
                        <Text style={styles.user_name}>{receiverName}</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.call_container} onPress={() => { }}>
                    <MaterialCommunityIcons name="phone-outline" size={32} color={'black'} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.call_container} onPress={() => { handleCall() }}>
                    <MaterialCommunityIcons name="video-outline" size={32} color={'black'} />
                </TouchableOpacity>
            </View>
            <GiftedChat

                messages={messages}
                showAvatarForEveryMessage={true}
                onSend={messages => onSend(messages)}
                user={{
                    _id: userData?.id || '',
                    avatar: image.sender_avatar,
                }}
                renderSend={renderSend}
                renderBubble={renderBubble}
            />
        </View>



    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header_bar: {
        height: layout.height * 0.05,
        width: layout.width,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center'
    },
    back_button: {
        height: '100%',
        width: '10%',
        justifyContent: 'center'
    },
    info_header: {
        height: '100%',
        width: '65%',
        flexDirection: 'row',
        alignItems: 'center'
    },
    avatar_container: {
        height: '80%',
        width: '25%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50
    },
    user_name_container: {
        flex: 1,
        justifyContent: 'center',
        paddingLeft: 5
    },
    user_name: {
        color: 'black',
        fontSize: 20,
        fontWeight: '700'
    },
    call_container: {
        height: '100%',
        width: '10%',
        marginLeft: 10,
        justifyContent: 'center'
    }
})