import { useCalls } from "@stream-io/video-react-native-sdk";
import { PropsWithChildren, useEffect, useState } from "react";
import { RootStackParamList } from "../navigations/navigation";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { selectUserData } from "../redux/user/userSlice";
import { Pressable, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { layout } from "../constants/dimensions/dimension";

type ChatBoxNavigationProp = StackNavigationProp<RootStackParamList>;

export default function CallProvider({ children }: PropsWithChildren) {
    const calls = useCalls();
    const call = calls[0]
    const navigation = useNavigation<ChatBoxNavigationProp>()
    const userData = useSelector(selectUserData);
    const [isOnCal, setIsOnCall] = useState<number>(0)

    useEffect(() => {
        if (!call || !userData) {
            return
        }

        navigation.navigate('CallScreen', { receiverId: userData.id, receiverName: userData.last_name + ' ' + userData.first_name, call: call })
    }, [call, isOnCal])

    const joinCall = () => {
        setIsOnCall(1)
        if (userData) {
            navigation.navigate('CallScreen', { receiverId: userData.id, receiverName: userData.last_name + ' ' + userData.first_name, call: call })
        }

    }
    return (
        <>
            {children}
            {/* {call && isOnCal === 0 && (
                <Pressable style={{ position: 'absolute', backgroundColor: 'green', top: 100, left: 100, height: 100, width: layout.width }}
                    onPress={() => { joinCall() }}>
                    <Text>Call active id: {call.id}</Text>
                </Pressable>
            )} */}
        </>
    )
}