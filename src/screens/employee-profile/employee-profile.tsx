import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { RootStackParamList } from "../../navigations/navigation";

import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { layout } from "../../constants/dimensions/dimension";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { images } from "../../images";
import { Appbar, SegmentedButtons } from "react-native-paper";

import { iUser } from "../../../types/userType";
import ProfileImageSection from "../../components/cover-avatar";
import SweepButton from "../../components/sweep-button";
import auth from '@react-native-firebase/auth';
import { formatDate } from "../../constants/formatDate";
import { getDetail, handleChat } from "./employee-helper";
import { createUser } from "../../helpers/createUserStrem";
import { generateRandomId } from "../../helpers/randomId";
import { Call, useStreamVideoClient } from "@stream-io/video-react-native-sdk";

type EmployeeFrofileProps = {
    route: { params: RootStackParamList['EmployeeProfile'] };
};

type EmployeeFrofileProp = StackNavigationProp<RootStackParamList>;


export const EmployeeProfile = ({ route }: EmployeeFrofileProps) => {
    const employeeID = route.params.employeeId
    const [user, setUser] = useState<iUser | null>(null);
    const [value, setValue] = useState('about');
    const currentUser = auth().currentUser
    const client = useStreamVideoClient();
    const [call, setCall] = useState<Call | null>(null);
    const data = [
        { id: '1', title: 'Item 1' },
        { id: '2', title: 'Item 2' },
        { id: '3', title: 'Item 3' },
        { id: '4', title: 'Item 4' },
        { id: '5', title: 'Item 5' }
    ];

    const [image, setImage] = useState({
        avatar: images.avartar_pic,
        cover: images.background_pic,
    })


    const navigation = useNavigation<EmployeeFrofileProp>()


    const handleBack = () => {
        navigation.goBack()
    }

    useEffect(() => {
        getDetail(employeeID, setUser, setImage)
    }, [employeeID])

    const handleCall = async () => {
        if (user) {
            createUser(user.id, user.last_name + ' ' + user.first_name)
            const callId = generateRandomId();

            if (!client || !currentUser) {
                return null
            }
            else {
                const newCall = client.call('default', callId);
                try {
                    await newCall.getOrCreate({
                        ring: true,
                        data: {
                            members: [
                                { user_id: currentUser.uid },
                                { user_id: user.id }
                            ]
                        }
                    });
                    setCall(newCall);
                } catch (error) {
                    console.error("Error creating or joining the call", error);
                }
                navigation.navigate('CallScreen', { receiverId: user.id, receiverName: user.last_name + ' ' + user.first_name, call: newCall })
            }
        }
    }

    const RenderTasks = ({ item }: { item: any }) => {
        return (
            <View style={styles.task_item}>
                <Text style={styles.text_20}>{item.title}</Text>
                <Text style={styles.text_15}>Price: $50</Text>
                <Text style={styles.text_15}>Duration: 2 hours</Text>
                <Text style={styles.text_15}>Finished on: 2023-10-01</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <Appbar.Header style={styles.header_container}>
                <Appbar.BackAction onPress={() => { handleBack() }} />
                <Appbar.Content title={user ? `${user.first_name}'s Profile` : 'Loading...'} titleStyle={{ color: 'black', fontWeight: '700' }} />
            </Appbar.Header>
            <View style={styles.profile_image}>
                <ProfileImageSection
                    image={image}
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
                        value: 'about',
                        label: 'About',
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
            {user && value === 'about' && (
                <>
                    <View style={styles.intro_container}>
                        <Text style={styles.text_15}>{user?.introduction ? user?.introduction : 'Hello, My name is ' + user?.first_name}</Text>
                    </View>


                    <View style={{ width: layout.width - 20 }}>
                        <SweepButton onPress={() => { handleChat(user, currentUser?.uid, navigation) }} iconName="wechat" label="Tap to Chat" />
                    </View>

                    <View style={{ width: layout.width - 20 }}>
                        <SweepButton onPress={() => { handleCall() }} iconName="video-camera" label="Tap to Call Video" />
                    </View>
                    <View style={{ width: layout.width - 20 }}>
                        <SweepButton onPress={() => { handleChat(user, currentUser?.uid, navigation) }} iconName="phone" label="Tap to Call" />
                    </View>
                </>
            )}

            {
                value === 'task' && (
                    <>
                        <View style={styles.task_container}>
                            <View style={styles.task_summary}>
                                <Text style={styles.text_20}>Task Summary</Text>
                                <View style={styles.row_container}>
                                    <Text style={styles.text_15}>Total Tasks Completed: </Text>
                                    <Text style={styles.text_15}> 5</Text>
                                </View>

                                <View style={styles.row_container}>
                                    <Text style={styles.text_15}>Total Time Taken: </Text>
                                    <Text style={styles.text_15}> 12 hours</Text>
                                </View>
                            </View>
                            <View style={styles.task_list}>
                                <FlatList
                                    data={data}
                                    renderItem={({ item }) => <RenderTasks item={item} />}
                                    keyExtractor={item => item.id}
                                    showsVerticalScrollIndicator={false}
                                />
                            </View>
                        </View>
                    </>
                )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white'
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
    text_20: {
        color: 'black',
        fontWeight: '700',
        fontSize: 20
    },
    task_container: {
        flex: 1,
        width: layout.width - 20,
        marginTop: 20,
    },
    task_summary: {
        height: layout.height * 0.15,
        width: '100%',
        borderWidth: 0.5,
        borderColor: 'black',
        borderRadius: 20,
        padding: 10,
    },
    row_container: {
        flexDirection: 'row',
        width: '100%',
        marginTop: 5
    },
    task_list: {
        width: '100%',
        marginVertical: 10,
        height: (layout.height * 0.15 + 10) * 2
    },
    task_item: {
        height: layout.height * 0.15,
        width: '100%',
        marginBottom: 10,
        paddingHorizontal: 10,
        borderWidth: 0.5,
        borderRadius: 20
    }
})