import { Call, CallContent, RingingCallContent, StreamCall, useCalls, useStreamVideoClient } from "@stream-io/video-react-native-sdk";
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
    const calls = useCalls();
    const call = calls[0]

    // const [call, setCall] = useState<Call>(route.params.call)

    useEffect(() => {
        // const handleCall = async () => {
        //     try {
        //         await call.get()
        //         await call.join({ create: true });
        //     } catch (error) {
        //         console.error("Error creating or joining the call", error);
        //     }
        // };
        // handleCall();

        // return () => {
        //     if (call) {
        //         call.leave();
        //     }
        // };
        if (!call) {
            navigation.goBack()
        }
    }, [call]);

    if (!call) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Joining call...</Text>
            </View>
        );
    }

    return (
        <StreamCall call={call}>
            {/* <CallContent onHangupCallHandler={() => { navigation.goBack() }} /> */}
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
