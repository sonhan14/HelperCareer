import { Modal, StyleSheet, View } from "react-native"
import { layout } from "../../constants/dimensions/dimension"

export const TaskInfo = () => {
    return (
        <View style={styles.container}>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: layout.height * 0.3,
        width: layout.width,
        top: layout.height * 0.7,
        position: 'absolute',
        backgroundColor: 'red',
        zIndex: 1
    }
})