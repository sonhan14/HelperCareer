import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { layout } from "../../constants/dimensions/dimension"
import { images } from "../../images"

export const TaskItem = () => {
    return (
        <View style={styles.container}>
            <View style={styles.header_container}>
                <Image source={images.avartar_pic} resizeMode='contain' style={styles.image_style} />
                <View style={styles.task_info_container}>
                    <Text style={styles.text_black_20}>Taking Care My Son</Text>
                    <Text style={styles.text_black_15}>01/01/2024 - 01/02/2024</Text>
                    <Text style={styles.text_red_15}>Status: Process</Text>
                </View>
            </View>
            <TouchableOpacity style={styles.view_button}>
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
        shadowRadius: 10,
        elevation: 10,
        padding: 10,
        justifyContent: 'space-between',
        alignItems: 'center'
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
    text_black_20:{
        color: 'black',
        fontSize: 20,
        fontWeight: '700'
    },
    text_black_15:{
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