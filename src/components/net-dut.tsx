import { StyleSheet, View } from "react-native";
import { layout } from "../constants/dimensions/dimension";
import { Text } from "react-native";

export const Net_dut = () => {
    const dashLength = Math.ceil(layout.width);
    const dashes = '-'.repeat(dashLength);

    return (
        <View style={{ width: layout.width - 10 * 2, paddingVertical: 10 }}>
            <Text numberOfLines={1} ellipsizeMode="clip" style={styles.dash}>
                {dashes}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    dash: {
        color: 'black',
        textAlign: 'center',
        
    },
})

