import { Call, CallContent, CallingState, RingingCallContent, StreamCall, useCalls, useCallStateHooks, useStreamVideoClient } from "@stream-io/video-react-native-sdk";
import { useSelector } from "react-redux";
import { selectUserData } from "../../redux/user/userSlice";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { generateRandomId } from "../../helpers/randomId";
import { RootStackParamList } from "../../navigations/navigation";
import { createUser } from "../../helpers/createUserStrem";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
type ChatBoxNavigationProp = StackNavigationProp<RootStackParamList>;

type ChatBoxProps = {
    route: { params: RootStackParamList['CallScreen'] };
};

export const CallScreen = ({ route }: ChatBoxProps) => {
    const currentUser = useSelector(selectUserData);
    const navigation = useNavigation<ChatBoxNavigationProp>()

    if (!currentUser) {
        return null;
    }
    const call = route.params.call

    useEffect(() => {
        console.log(call);

    }, [call])
    return (
        <StreamCall call={call}>
            <RingingCallContent />
        </StreamCall>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    text: {
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
});
