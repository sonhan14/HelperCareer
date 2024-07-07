import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FlatList, GestureHandlerRootView, NativeViewGestureHandler, PanGestureHandler } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { images } from "../../images";
import { layout } from "../../constants/dimensions/dimension";
import { Applications, EmployeeListProps } from "../../../types/applications.type";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigations/navigation";
import { useNavigation } from "@react-navigation/native";


type EmployeeNavigation = StackNavigationProp<RootStackParamList>
export const EmployeeList = ({ showEmployee, employeeList, handleAction }: EmployeeListProps) => {
    const navigation = useNavigation<EmployeeNavigation>()


    const renderItem = ({ item }: { item: Applications }) => {
        return (
            <TouchableOpacity style={styles.employee_container} onPress={() => navigation.navigate('EmployeeProfile', {employeeId: item.user_id})}>
                <View style={styles.image_container}>
                    <Image source={images.avartar_pic} resizeMode='contain' style={{ height: '100%', width: '100%' }} />
                </View>
                <View style={styles.name_container}>
                    <Text style={styles.text_title}>Name: {item.last_name} {item.first_name}</Text>
                    <Text style={styles.text_Date}>Rating: {item.rating}</Text>
                </View>
                {item.status === 'accepted' ?
                    <View style={styles.status_container}>
                        <Text style={styles.text_accept}>Accepted</Text>
                    </View>
                    :
                    item.status === 'rejected' ?
                    <View style={styles.status_container}>
                        <Text style={styles.text_reject}>Rejected</Text>
                    </View>
                    :
                    <View>
                        <TouchableOpacity style={styles.button_apply} onPress={() => { handleAction(item, 'accept') }}>
                            <Text style={styles.text_button}>Accept</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button_reject} onPress={() => { handleAction(item, 'reject') }}>
                            <Text style={styles.text_button}>Reject</Text>
                        </TouchableOpacity>
                    </View>
                }


            </TouchableOpacity>
        )
    }

    const animatedStyle = useAnimatedStyle(() => {
        return {
            height: withTiming(showEmployee ? layout.height * 0.1 * 2 + 20 : 0, { duration: 300 }),
        };
    });

    return (
        <Animated.View style={[styles.employeeListContainer, animatedStyle]}>
            <FlatList
                data={employeeList}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                renderItem={(renderItem)}
            />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    employee_container: {
        height: layout.height * 0.1,
        width: '100%',
        borderRadius: 10,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: 'black',
        paddingVertical: 10,
        marginBottom: 15,
        alignItems: 'center'
    },
    employeeListContainer: {
        width: '100%',
        overflow: 'hidden',
        marginTop: 10,
    },
    image_container: {
        height: '100%',
        width: layout.height * 0.1,
        marginRight: 5
    },
    name_container: {
        height: '100%',
        justifyContent: 'center',
        width: '50%',
    },
    text_Date: {
        color: 'green',
        fontSize: 14
    },
    text_title: {
        fontWeight: '700',
        fontSize: 14,
        color: 'black'
    },
    button_apply: {
        height: '50%',
        width: layout.height * 0.1,
        backgroundColor: 'blue',
        marginLeft: 10,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button_reject: {
        height: '50%',
        width: layout.height * 0.1,
        backgroundColor: 'red',
        marginLeft: 10,
        borderRadius: 10,
        marginTop: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text_button: {
        color: 'white',
        fontSize: 14,
        fontWeight: '700'
    },
    status_container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text_accept: {
        fontSize: 16,
        fontWeight: '700',
        color: 'green'
    },
    text_reject: {
        fontSize: 16,
        fontWeight: '700',
        color: 'red'
    }
})