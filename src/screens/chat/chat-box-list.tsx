import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { messagesBox } from "../../../types/messageBox";
import { layout } from "../../constants/dimensions/dimension";
import { images } from "../../images";
import { formatDate } from "../../constants/formatDate";
import { truncateText } from "../../helpers/truncateText";
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/FontAwesome";
import { color } from "../../constants/colors/color";

const RenderItem = ({ item, goToChat }: { item: messagesBox, goToChat: (receiverId: string, chatBoxId: string, receiverName: string) => void }) => {

    const dragX = useSharedValue(0);
    const height = useSharedValue(layout.height * 0.1);
    const marginVertical = useSharedValue(5);

    const isSwiped = useSharedValue(false);
    const iconWidth = useSharedValue(layout.width * 0.25)

    const threshold = -layout.width * 0.25

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: dragX.value }],
            height: height.value,
            marginVertical: marginVertical.value,
            // marginBottom: marginBottom.value,
            // width: contaierWidth.value,
            // opacity: contaierOpacity.value
        };
    });

    const animatedIconStyle = useAnimatedStyle(() => {
        const opacity = interpolate(dragX.value, [0, threshold], [0, 1]);
        return {
            opacity,
            height: height.value,
            width: iconWidth.value,
            marginVertical: marginVertical.value,
        };
    });

    const handleDeleteChat = () => {
        height.value = withTiming(0, { duration: 500 })
        marginVertical.value = withTiming(0, { duration: 500 })

    }

    const gestureHandle = Gesture.Pan()
        .onUpdate((e) => {
            if (isSwiped.value) {
                dragX.value = e.translationX + threshold
                console.log('dragx', dragX.value);
                console.log(e.translationX);
            }
            else {
                dragX.value = e.translationX;
            }

        })
        .onEnd((e) => {
            if (threshold >= e.translationX && isSwiped.value === false) {
                dragX.value = withTiming(threshold)
                isSwiped.value = true
            }
            else if (isSwiped.value === true && dragX.value <= threshold) {
                dragX.value = withTiming(0);
                isSwiped.value = false
            }
            else {
                dragX.value = withTiming(0);
                isSwiped.value = false
            }

        })

    return (
        <Animated.View >
            <Animated.View style={[styles.delete_swipe, animatedIconStyle]}>
                <TouchableOpacity style={styles.delete_touch} onPress={() => { handleDeleteChat() }}>
                    <Icon name="trash" size={30} color="white" />
                </TouchableOpacity>

            </Animated.View>
            <GestureDetector gesture={gestureHandle}>
                <Animated.View style={[styles.messageBox, animatedStyle]}>
                    <TouchableOpacity style={styles.message_box_container} onPress={() => goToChat(item.received_id, item.id, item.name)} activeOpacity={1}>
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
                            <Text style={styles.text_time}>{formatDate(item.lastMessageTimestamp)}</Text>
                        </View>
                    </TouchableOpacity>
                </Animated.View>
            </GestureDetector>
        </Animated.View>
    )
};

export const MessagesBoxList = ({ boxData, goToChat }: { boxData: messagesBox[], goToChat: (receiverId: string, chatBoxId: string, receiverName: string) => void }) => {

    return (
        <FlatList
            data={boxData}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <RenderItem item={item} goToChat={goToChat} />}
        />
    );
};

const styles = StyleSheet.create({
    message_box_container: {
        height: layout.height * 0.1,
        width: layout.width - 20,
        marginVertical: 5,
        flexDirection: 'row',
    },
    messageBox: {
        width: layout.width - 20,
        flexDirection: 'row',
        backgroundColor: color.light_background,
        borderRadius: 10
    },
    message_box_avatar: {
        height: '100%',
        width: '20%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    message_box_text: {
        height: '100%',
        width: '60%',
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
    },
    delete_swipe: {
        borderRadius: 15,
        position: 'absolute',
        right: 1,
        backgroundColor: 'red'
    },
    delete_touch: {
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%'
    },
})