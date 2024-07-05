import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FlatList, GestureHandlerRootView, NativeViewGestureHandler, PanGestureHandler } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { images } from "../../images";
import { layout } from "../../constants/dimensions/dimension";
import firestore, { GeoPoint } from '@react-native-firebase/firestore';
import { Applications } from "../../../types/applications.type";

interface EmployeeListProps {
    showEmployee: boolean;
    employeeList: Applications[],
    showDialog: () => void
}
export const EmployeeList = ({ showEmployee, employeeList, showDialog }: EmployeeListProps) => {

    const hanleAccepted = (item: Applications) => {
        showDialog()
        // const { id, ...itemWithoutId } = item;
        // firestore().collection('applications').doc(item.id).set({
        //     ...itemWithoutId,
        //     status: 'accepted'
        // })
    }

    const hanleRejected = (item: Applications) => {
        const { id, ...itemWithoutId } = item;
        firestore().collection('applications').doc(item.id).set({
            ...itemWithoutId,
            status: 'rejected'
        })
    }

    const renderItem = ({ item }: { item: Applications }) => {
        return (
            <View style={styles.employee_container}>
                <View style={styles.image_container}>
                    <Image source={images.avartar_pic} resizeMode='contain' style={{ height: '100%', width: '100%' }} />
                </View>
                <View style={styles.name_container}>
                    <Text style={styles.text_title}>Name: {item.last_name} {item.first_name}</Text>
                    <Text style={styles.text_Date}>Rating: {item.rating}</Text>
                </View>
                <View>
                    <TouchableOpacity style={styles.button_apply} onPress={() => { hanleAccepted(item) }}>
                        <Text style={styles.text_button}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button_reject} onPress={() => { hanleRejected(item) }}>
                        <Text style={styles.text_button}>Reject</Text>
                    </TouchableOpacity>
                </View>

            </View>
        )
    }

    const animatedStyle = useAnimatedStyle(() => {
        return {
            height: withTiming(showEmployee ? layout.height * 0.1 * 2 + 20 : 0, { duration: 300 }), // Adjust height as needed
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
        width: layout.height * 0.1 ,
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
    }
})