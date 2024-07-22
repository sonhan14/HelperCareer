import { Call, useCalls, useCallStateHooks, useStreamVideoClient, } from "@stream-io/video-react-native-sdk";
import { PropsWithChildren, useEffect, useState } from "react";
import { RootStackParamList } from "../navigations/navigation";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { selectUserData } from "../redux/user/userSlice";
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import { iUser } from "../../types/userType";

type ChatBoxNavigationProp = StackNavigationProp<RootStackParamList>;



export default function CallProvider({ children }: PropsWithChildren) {
    const calls = useCalls();
    const [call, setCall] = useState<Call>(calls[0])
    const navigation = useNavigation<ChatBoxNavigationProp>()
    const userData = useSelector(selectUserData);

    useEffect(() => {
        if (!call || !userData) {
            return
        }
        navigation.navigate('CallScreen', { receiverId: userData.id, receiverName: userData.last_name + ' ' + userData.first_name, call: call })
    }, [userData, navigation])
    return (
        <>
            {children}
        </>
    )
}