import { CallContent, StreamCall, StreamVideo, StreamVideoClient, User } from "@stream-io/video-react-native-sdk";
import { View } from "react-native"

export const CallScreen = () => {

    const apiKey = '9puabwjb5p2p';
    const userId = 'rkYDBqV3yyReBwHi6bEK5bJKA1z1';
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoicmtZREJxVjN5eVJlQndIaTZiRUs1YkpLQTF6MSJ9.WA-L5JacAaLyGMeB_POf51-B3PZ8xcHeh0JEG-58M1c';
    const callId = 'default_515d76be-f5d0-4554-b274-a93ef048eadf';
    const user: User = { id: userId };

    const client = new StreamVideoClient({ apiKey, user, token });
    const call = client.call('default', callId);
    call.join({ create: true });

    return (
        <StreamVideo client={client}>
            <StreamCall call={call}>
                <CallContent />
            </StreamCall>
        </StreamVideo>
    )
}