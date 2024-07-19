import { Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import React, { useState, useCallback, useEffect, useLayoutEffect } from 'react'
import { Bubble, Composer, GiftedChat, IMessage, InputToolbar, MessageImage, Send, SystemMessage } from 'react-native-gifted-chat'
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
import ImagePicker from 'react-native-image-crop-picker';
import { sendNotification } from "../../helpers/notification";
type ChatBoxNavigationProp = StackNavigationProp<RootStackParamList>;

type ChatBoxProps = {
    route: { params: RootStackParamList['ChatBox'] };
};



export const ChatBox = ({ route }: ChatBoxProps) => {
    const [messages, setMessages] = useState<IMessage[]>([])
    const userData = useSelector(selectUserData);

    const navigation = useNavigation<ChatBoxNavigationProp>()
    const receiver = route.params.receiver
    const [chatBoxId, setChatBoxId] = useState<string>(route.params.chatId)
    const [call, setCall] = useState<Call | null>(null);
    const client = useStreamVideoClient();


    const [avatar, setAvatar] = useState({
        sender_avatar: images.avartar_pic,
        receiver_avatar: images.avartar_pic,
    })

    const [image, setImage] = useState<string>('')
    useEffect(() => {
        setAvatar(prev => ({
            ...prev, sender_avatar: userData?.avatar, receiver_avatar: receiver.avatar
        }));
    }, [chatBoxId])

    useLayoutEffect(() => {
        const unsubscribe = firestore().collection('chats').doc(chatBoxId).collection('messages').orderBy('createdAt', 'desc').onSnapshot(snapshot =>
            setMessages(
                snapshot.docs.map(doc => ({
                    _id: doc.data()._id,
                    text: doc.data().text,
                    createdAt: doc.data().createdAt.toDate(),
                    user: doc.data().user,
                    image: doc.data().image
                }))
            )

        )
        return unsubscribe
    }, [chatBoxId])


    const onSend = useCallback((messages: IMessage[] = []) => {
        setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, messages)
        );

        const {
            text,
            createdAt,
            user,
        } = messages[0]

        const _id = new Date();

        let dataPayload: { [key: string]: string } = {
            userId: userData ? userData.id : '',
            chatId: chatBoxId,
        };

        if (chatBoxId === null) {
            firestore().collection('chats').add({
                lastMessage: text,
                lastMessageTimestamp: createdAt,
                members: [
                    receiver.id,
                    userData?.id
                ]
            })
                .then(newChatRef => {
                    const newChatId = newChatRef.id;
                    dataPayload.chatId = newChatId
                    setChatBoxId(newChatId);
                    firestore().collection('chats').doc(newChatId).collection('messages').add({
                        _id,
                        text,
                        createdAt,
                        user,
                    })
                })
                .then(() => {
                    sendNotification(receiver.fcmToken, userData?.last_name + ' ' + userData?.first_name, text, dataPayload);
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
                user,
            })
                .then(() => {
                    return firestore().collection('chats').doc(chatBoxId).update({
                        lastMessage: text,
                        lastMessageTimestamp: createdAt
                    });
                })
                .then(() => {
                    sendNotification(receiver.fcmToken, userData?.last_name + ' ' + userData?.first_name, text, dataPayload);
                })
                .catch(error => {
                    console.error('Error sending message: ', error);
                })
        }

    }, [chatBoxId])

    const renderBubble = (props: any) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={
                    {
                        left: {
                            backgroundColor: 'rgba(214, 239, 255, 1)'
                        },
                    }
                }
                containerStyle={{
                    left: {
                        marginBottom: 10
                    },
                    right: {
                        marginBottom: 10
                    }
                }}
                textStyle={{
                    left: {
                        fontWeight: '500'
                    },
                    right: {
                        fontWeight: '500'
                    }
                }}

                renderTime={(props) => {
                    return (
                        null
                    )
                }}
            />
        )
    }

    const renderSend = (props: any) => {
        return (
            <Send {...props}>
                <MaterialCommunityIcons name='send' size={30} color={color.blue_chat} style={{ marginBottom: 3 }} />
            </Send>
        )
    }

    const renderInputToolbar = (props: any) => {
        return (
            <InputToolbar
                {...props}
                containerStyle={styles.inputToolbar}
                renderComposer={renderComposer}
                renderActions={renderActions}
                renderSend={renderSend}
            />
        );
    };

    const renderComposer = (props: any) => {
        return (
            <Composer {...props}
                placeholder="Aa"
                textInputStyle={styles.composerContainer}
            />
        );
    };

    const renderSystemMessage = (props: any) => {
        return (
            <SystemMessage {...props}
                containerStyle={{ padding: 10 }}
            />
        )
    }

    const renderActions = (props: any) => {
        return (
            <View style={styles.actionsContainer}>
                <TouchableOpacity style={styles.actionButton} onPress={() => { pickImages() }}>
                    <MaterialCommunityIcons name='message-image' size={30} style={{ marginBottom: 3 }} color={color.blue_chat} />
                </TouchableOpacity>
            </View>
        );
    };

    const renderMessageImage = (props: any) => {
        return (
            <MessageImage {...props}
                containerStyle={{
                    backgroundColor: 'white',
                    padding: 0,
                }}
                imageStyle={{
                    resizeMode: 'cover',
                    margin: 0,
                    borderRadius: 0,
                }}
            >

            </MessageImage>
        )
    }

    const handleBack = () => {
        navigation.goBack()
    }

    const handleCall = async () => {
        createUser(receiver.id, receiver.last_name + ' ' + receiver.first_name)
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
                            { user_id: receiver.id },
                            { user_id: userData.id }
                        ]
                    }
                });
                setCall(newCall);
            } catch (error) {
                console.error("Error creating or joining the call", error);
            }
            navigation.navigate('CallScreen', { receiverId: receiver.id, receiverName: receiver.last_name + ' ' + receiver.first_name, call: newCall })
        }

    }

    const sendMessageWithImage = async (imageUrl: string) => {
        const message: IMessage = {
            _id: Date.now().toString(),
            text: '',
            createdAt: new Date(),
            user: {
                _id: userData?.id || '',
                avatar: avatar.sender_avatar,
            },
            image: imageUrl,
        };


        if (chatBoxId === null) {
            const newChatRef = await firestore().collection('chats').add({
                lastMessage: receiver.last_name + ' ' + receiver.first_name + ' sent you a image',
                lastMessageTimestamp: message.createdAt,
                members: [receiver.id, userData?.id],
            });
            setChatBoxId(newChatRef.id);
            await firestore().collection('chats').doc(newChatRef.id).collection('messages').add(message);
            setImage('')
        } else {
            await firestore().collection('chats').doc(chatBoxId).collection('messages').add(message);
            await firestore().collection('chats').doc(chatBoxId).update({
                lastMessage: receiver.last_name + ' ' + receiver.first_name + ' sent you a image',
                lastMessageTimestamp: message.createdAt,
            });
            setImage('')
        }
    };

    const pickImages = async () => {
        const currentImageState = image;
        try {
            const pickedImage = await ImagePicker.openPicker({
                // multiple: true,
                mediaType: 'photo',
            });
            if (!pickedImage) {
                return;
            }
            if (pickedImage) {
                const imagePath = pickedImage.path;
                const uploadUri = Platform.OS === 'ios' ? imagePath.replace('file://', '') : imagePath;
                const storageRef = await storage().ref(`chatImages/${userData?.id}`);
                await storageRef.putFile(uploadUri);

                try {
                    const imageUrl = await storageRef.getDownloadURL();
                    setImage(imageUrl);
                    sendMessageWithImage(imageUrl);

                } catch (error) {
                    console.error('Image upload error: ', error);
                }

            }
        } catch (error) {
            setImage(currentImageState);
        }
    };

    if (!userData) {
        return null
    }
    return (
        <View style={styles.container}>
            <View style={styles.header_bar}>
                <TouchableOpacity style={styles.back_button} onPress={() => handleBack()}>
                    <MaterialCommunityIcons name="chevron-left" color={'black'} size={32} />
                </TouchableOpacity>
                <View style={styles.info_header}>
                    <View style={styles.avatar_container}>
                        <Image source={avatar.receiver_avatar === images.avartar_pic ? images.avartar_pic : { uri: avatar.receiver_avatar }} resizeMode='contain' style={{ height: '100%', width: '100%' }} />
                    </View>
                    <View style={styles.user_name_container}>
                        <Text style={styles.user_name}>{receiver.last_name + ' ' + receiver.first_name}</Text>
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
                    avatar: avatar.sender_avatar,
                }}
                renderBubble={renderBubble}
                renderInputToolbar={renderInputToolbar}
                renderSystemMessage={renderSystemMessage}
                renderMessageImage={renderMessageImage}

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
    },
    inputToolbar: {
        borderTopWidth: 0,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
    },
    composerContainer: {
        borderWidth: 0.5,
        borderColor: '#333',
        color: 'black',
        borderRadius: 25,
        paddingHorizontal: 15,
        marginRight: 10
    },
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionButton: {
        paddingHorizontal: 5,
    },
    sendButton: {
        paddingHorizontal: 5,
    },
    icon: {
        width: 24,
        height: 24,
        tintColor: '#FF007F',
    },
})