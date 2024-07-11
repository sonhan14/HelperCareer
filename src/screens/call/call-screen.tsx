import { Call, CallContent, StreamCall, useStreamVideoClient } from "@stream-io/video-react-native-sdk";
import { useSelector } from "react-redux";
import { selectUserData } from "../../redux/user/userSlice";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { generateRandomId } from "../../helpers/randomId";
import { RootStackParamList } from "../../navigations/navigation";

type ChatBoxProps = {
    route: { params: RootStackParamList['CallScreen'] };
};

export const CallScreen = ({ route }: ChatBoxProps) => {
    const receiverId = route.params.receiverId;
    const receiverName = route.params.receiverName;
    const currentUser = useSelector(selectUserData);

    if (!currentUser) {
        return null;
    }

    const userId = currentUser.id;
    const callId = generateRandomId();
    const client = useStreamVideoClient();
    const [call, setCall] = useState<Call | null>(null);


    useEffect(() => {
        const handleCall = async () => {
            if (!client) return;
            const newCall = client.call('default', callId);
            try {
                await newCall.getOrCreate({
                    data: {
                        members: [
                            { user_id: receiverId },
                            { user_id: userId }
                        ]
                    }
                });
                await newCall.join({ create: true });
                setCall(newCall);
            } catch (error) {
                console.error("Error creating or joining the call", error);
            }
        };

        handleCall();

        return () => {
            if (call) {
                call.leave();
            }
        };
    }, [client]);

    if (!call) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Joining call...</Text>
            </View>
        );
    }

    return (
        <StreamCall call={call}>
            <CallContent />
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
