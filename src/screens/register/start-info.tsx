import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { layout } from "../../constants/dimensions/dimension"
import { color } from "../../constants/colors/color"
import FastImage from "react-native-fast-image"
import { images } from "../../images"
import Animated, { FadeIn, LightSpeedOutLeft } from "react-native-reanimated"

export const StartInfo = ({ setStep }: { setStep: React.Dispatch<React.SetStateAction<number>> }) => {
    return (
        <Animated.View style={styles.container} entering={FadeIn.duration(500)} exiting={LightSpeedOutLeft.duration(500)}>
            <View style={styles.main_container}>
                <Text style={styles.text_title}>Get Started</Text>
                <Text style={styles.text_blue}>You have successfully registered, now let me know some of your information</Text>
                <View style={styles.image_container}>
                    <FastImage source={images.create_info} resizeMode="contain" style={styles.image} />
                </View>
            </View>
            <TouchableOpacity style={styles.button_container} onPress={() => setStep(1)}>
                <Text style={styles.text_white}>Next</Text>
            </TouchableOpacity>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
        alignItems: 'center'
    },
    main_container: {
        height: layout.height * 0.6,
        width: layout.width,
        paddingHorizontal: 10
    },
    text_title: {
        fontSize: 30,
        color: color.link_text,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 5
    },
    text_blue: {
        color: color.link_text,
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center'
    },
    image_container: {
        width: layout.width - 20,
        height: layout.height * 0.4,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        bottom: 0,
        left: 10,
        position: 'absolute'
    },
    image: {
        width: layout.width - 20,
        height: layout.height * 0.4,
    },
    button_container: {
        width: layout.width - 100,
        height: layout.height * 0.06,
        position: 'absolute',
        bottom: 50,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: color.red_pink
    },
    text_white: {
        color: 'white',
        fontSize: 18,
        fontWeight: '700'
    }
})