import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { layout } from "../../constants/dimensions/dimension"
import { images } from "../../images"
import { formatDate } from "../../constants/formatDate"
import { TaskType } from "../../../types/taskType"
import { StackNavigationProp } from "@react-navigation/stack"
import { RootStackParamList } from "../../navigations/navigation"
import { useNavigation } from "@react-navigation/native"

type TaskItemNavigation = StackNavigationProp<RootStackParamList>


export const TaskItem = ({ item }: { item: TaskType }) => {
    const navigation = useNavigation<TaskItemNavigation>()

    return (
        <View style={styles.container}>
            <View style={styles.header_container}>
                <Image source={images.task_image} resizeMode='contain' style={styles.image_style} />
                <View style={styles.task_info_container}>
                    <Text style={styles.text_black_20}>{item.task_name}</Text>
                    <Text style={styles.text_black_15}>{item.start_date} - {item.end_date}</Text>
                    <Text style={styles.text_red_15}>Status: {item.status}</Text>
                </View>
            </View>
            <TouchableOpacity style={styles.view_button} onPress={() => {
                navigation.navigate('TaskDetail', { TaskId: item.id })
            }}>
                <Text style={styles.text_black_15}>View Detail</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: layout.height * 0.15,
        width: layout.width - 40,
        backgroundColor: 'white',
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 15,
        elevation: 5,
        padding: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15
    },
    header_container: {
        height: '60%',
        width: '100%',
        flexDirection: 'row',
    },
    image_style: {
        height: '100%',
        width: layout.height * 0.15 * 0.6
    },
    task_info_container: {
        height: '40%',
        marginLeft: 10,
    },
    text_black_20: {
        color: 'black',
        fontSize: 20,
        fontWeight: '700'
    },
    text_black_15: {
        color: 'black',
        fontSize: 14,
        fontWeight: '400'
    },
    text_red_15: {
        color: 'red',
        fontSize: 14,
        fontWeight: '400'
    },
    view_button: {
        height: '30%',
        width: '80%',
        borderRadius: 10,
        borderWidth: 0.2,
        borderColor: 'black',
        justifyContent: 'center',
        alignItems: 'center'
    }
})