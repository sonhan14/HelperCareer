import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import Animated, { LightSpeedInRight, LightSpeedOutRight, RollInRight, StretchInX } from "react-native-reanimated"
import { layout } from "../../constants/dimensions/dimension"
import FastImage from "react-native-fast-image"
import { images } from "../../images"
import { color } from "../../constants/colors/color"
import { accountInfo } from "./register-modal"

export const FinishInfo = ({ account, setAccount, isRegister, isValid }: { account: accountInfo, setAccount: React.Dispatch<React.SetStateAction<accountInfo>>, isRegister: boolean, isValid: string }) => {
    return (
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
            <Animated.View style={styles.container} entering={StretchInX.duration(500)}>
                <View style={styles.login_image_container}>
                    <Text style={styles.text_title}>Complete your profile</Text>
                    <View style={styles.avatar_container}>
                        <FastImage source={images.map_animation} resizeMode="contain" style={styles.avatar} />
                    </View>
                </View>

                <View style={styles.input_container}>
                    <Text style={styles.text_input_blue}>Address</Text>
                    <TextInput
                        style={[styles.text_input]}
                        placeholder="William"
                        placeholderTextColor={'#8897AD'}
                        onChangeText={(text) => { setAccount(prev => ({ ...prev, first_name: text })) }}
                        value={account.first_name}
                        autoCapitalize='words'
                    />
                </View>

                <View style={styles.input_container}>
                    <Text style={styles.text_input_blue}>Phone Number</Text>
                    <TextInput
                        style={[styles.text_input]}
                        placeholder="0123456789"
                        placeholderTextColor={'#8897AD'}
                        onChangeText={(text) => { setAccount(prev => ({ ...prev, phone: text })) }}
                        value={account.phone}
                        keyboardType='numeric'
                    />
                </View>

                {isValid ? (
                    <Animated.View
                        entering={LightSpeedInRight.duration(500)}
                        exiting={LightSpeedOutRight.duration(500)}
                    >
                        <Text style={styles.error_text}>{isValid}</Text>
                    </Animated.View>

                ) : <Animated.View
                    entering={LightSpeedInRight.duration(500)}
                    exiting={LightSpeedOutRight.duration(500)}></Animated.View>
                }

                <View style={[styles.input_container, { height: layout.height * 0.25 }]}>
                    <Text style={styles.text_input_blue}>Introduction</Text>
                    <TextInput
                        style={[styles.text_input1, { height: layout.height * 0.2 }]}
                        placeholder="Hi, I'm William"
                        placeholderTextColor={'#8897AD'}
                        onChangeText={(text) => { setAccount(prev => ({ ...prev, intro: text })) }}
                        value={account.intro}
                        numberOfLines={4}
                        multiline={true}
                    />
                </View>

                <TouchableOpacity
                    onPress={() => { }}
                    style={isRegister || isValid !== '' ? styles.signin_button_disable : styles.signin_button}
                    disabled={isRegister}
                >
                    <Text style={styles.text_button}>Continue</Text>
                </TouchableOpacity>
            </Animated.View>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: 20
    },
    login_image_container: {
        width: layout.width,
        height: layout.height * 0.25,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginVertical: 15,
    },
    text_title: {
        color: color.link_text,
        fontSize: 25,
        fontWeight: '700',
        textAlign: 'center'
    },
    avatar_container: {
        height: layout.height * 0.2,
        width: layout.width
    },
    avatar: {
        height: layout.height * 0.2,
        width: layout.width
    },
    input_container: {
        width: '100%',
        height: layout.height * 0.1,
        marginBottom: 25,
        justifyContent: 'space-between',
    },
    text_input_blue: {
        color: color.link_text,
        fontSize: 15,
        fontWeight: '500',
        width: '30%'
    },
    text_input: {
        width: '100%',
        height: '70%',
        backgroundColor: 'white',
        paddingHorizontal: 10,
        borderRadius: 10,
        marginTop: 5,
        shadowColor: 'black',
        shadowOpacity: 1,
        elevation: 5,
        shadowRadius: 10
    },
    text_input1: {
        width: '100%',
        backgroundColor: 'white',
        paddingHorizontal: 10,
        borderRadius: 10,
        marginTop: 5,
        shadowColor: 'black',
        shadowOpacity: 1,
        elevation: 10,
        shadowRadius: 10,
        shadowOffset: { height: 100, width: 0 }
    },
    signin_button_disable: {
        backgroundColor: color.button_color,
        width: layout.width - 40,
        height: layout.height * 0.07,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50
    },
    signin_button: {
        backgroundColor: '#49B4F1',
        width: layout.width - 40,
        height: layout.height * 0.07,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50
    },
    text_button: {
        color: 'white',
        fontSize: 20,
        fontWeight: '500'
    },
    error_text: {
        color: 'red',
        fontSize: 12,
        marginBottom: 10
    },
})