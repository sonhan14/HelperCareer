import { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import auth from "@react-native-firebase/auth";
import { layout } from "../../constants/dimensions/dimension";
import { images } from "../../images";
import { color } from "../../constants/colors/color";
import Animated, { BounceInRight, FadeIn, FadeOut, LightSpeedOutRight } from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigations/navigation";
import Icon from "react-native-vector-icons/FontAwesome";
import { StackNavigationProp } from "@react-navigation/stack";


type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList>;


export const LoginScreen = () => {
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [notificationVisible, setNotificationVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        if (notificationVisible) {
            setTimeout(() => {
                setNotificationVisible(false);
            }, 2000);
        }
    }, [notificationVisible]);

    const isEmailValid = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const isLoginDisabled = !email || !password || !isEmailValid(email);

    const __doSingIn = async (email: any, password: any) => {
        setLoading(true)
        try {
            let response = await auth().signInWithEmailAndPassword(email, password)
            if (response && response.user) {
                navigation.replace('MainTabs', { userId: response.user.uid })
            }
            setLoading(false)
        } catch (e) {
            if (e instanceof Error) {
                setNotificationVisible(true);
                setErrorMessage(e.message)
                console.log(e.message);
            }
            setLoading(false)
        }
    }

    return (
        <View style={{ flex: 1, position: 'relative' }}>

            <View style={styles.login_image_container}>
                <Image source={images.wellcome_pic} resizeMode='contain' style={{ width: '80%', height: '80%' }} />
            </View>

            <View style={styles.hello_container}>
                <View style={styles.wellcome_container}>
                    <Text style={styles.text_title}>Wellcome Back</Text>
                </View>

                <View style={styles.wellcome_container}>
                    <Text style={styles.text_15}>Today is a new day. It's your day. You shape it.
                    </Text>
                    <Text style={styles.text_15}>Sign in to start managing your projects</Text>
                </View>

            </View>

            <View style={styles.sign_in_container}>
                <View style={styles.input_container}>
                    <Text style={styles.text_blue}>Email</Text>
                    <TextInput
                        style={[styles.text_input]}
                        placeholder="Example@email.com"
                        placeholderTextColor={'#8897AD'}
                        onChangeText={setEmail}
                        value={email}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>
                <View style={styles.input_container}>
                    <Text style={styles.text_blue}>Password</Text>
                    <View style={styles.text_input_container}>
                        <TextInput
                            style={[styles.text_input]}
                            placeholder="At least 8 characters"
                            placeholderTextColor={'#8897AD'}
                            onChangeText={setPassword}
                            value={password}
                            autoCapitalize="none"
                            secureTextEntry={!showPassword}
                        />

                        <TouchableOpacity
                            style={styles.eyeIconContainer}
                            onPress={() => {
                                setShowPassword(!showPassword)
                            }}
                        >
                            <Icon
                                name={showPassword ? 'eye' : 'eye-slash'}
                                size={20}
                                color="black"
                            />
                        </TouchableOpacity>
                    </View>

                </View>
                <View style={styles.forgot_password_container}>
                    <TouchableOpacity style={styles.forgot_password}>
                        <Text style={styles.text_blue}>Forgot Password?</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    onPress={() => { __doSingIn(email, password) }}
                    style={isLoginDisabled ? styles.signin_button_disable : styles.signin_button}
                    disabled={isLoginDisabled}
                >
                    {!loading ?
                        <Text style={styles.text_button}>Sign In</Text>
                        :
                        <ActivityIndicator size="small" color="#ffffff" />}

                </TouchableOpacity>
            </View>

            <View style={styles.sign_up_container}>
                <View style={styles.sign_up_title}>
                    <Text style={styles.text_15}>Don't you have an account? </Text>
                    <TouchableOpacity onPress={() => { navigation.navigate('Register') }}>
                        <Text style={styles.text_blue}>Sign up</Text>
                    </TouchableOpacity>
                </View>

            </View>

            {notificationVisible ?
                <Animated.View
                    entering={BounceInRight.duration(500)}
                    exiting={LightSpeedOutRight.duration(500)}
                    style={styles.noti_container}>
                    <Text style={[styles.text_15]}>{errorMessage}</Text>
                </Animated.View>
                :
                null
            }
        </View>
    )
}

const styles = StyleSheet.create({
    login_image_container: {
        width: layout.width,
        height: layout.height * 0.25,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    hello_container: {
        height: layout.height * 0.15,
        width: layout.width,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    wellcome_container: {
        width: '100%',
        height: '30%',
        marginBottom: 10
    },
    text_title: {
        color: color.link_text,
        fontSize: 30,
        fontWeight: '500'
    },
    text_button: {
        color: 'white',
        fontSize: 20,
        fontWeight: '500'
    },
    text_15: {
        color: color.primary_text,
        fontSize: 15,
        fontWeight: '500'
    },
    text_blue: {
        color: color.link_text,
        fontSize: 15,
        fontWeight: '500'
    },
    sign_in_container: {
        width: layout.width,
        height: layout.height * 0.4,
        paddingHorizontal: 20,
        justifyContent: 'space-between'

    },
    input_container: {
        width: '100%',
        height: '30%',
    },
    forgot_password_container: {
        width: '100%',
        height: '10%',
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    forgot_password: {
        height: '100%',
        justifyContent: 'center'
    },
    signin_button_disable: {
        backgroundColor: color.button_color,
        width: '100%',
        height: '20%',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    signin_button: {
        backgroundColor: '#49B4F1',
        width: '100%',
        height: '20%',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text_input: {
        width: '100%',
        height: '70%',
        backgroundColor: color.text_input,
        paddingHorizontal: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#D4D7E3',
        marginTop: 5
    },
    sign_up_container: {
        height: layout.height * 0.2,
        width: layout.width,
        paddingHorizontal: 20,
        justifyContent: 'center',

    },
    sign_up_title: {
        height: '30%',
        width: '100%',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    noti_container: {
        width: layout.width - 20,
        height: layout.height * 0.1,
        backgroundColor: '#BCC7F5',
        borderRadius: 20,
        position: 'absolute',
        top: 10,
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    text_input_container: {
        height: '100%',
        flexDirection: 'row',
        position: 'relative'
    },
    eyeIconContainer: {
        height: '70%',
        justifyContent: 'center',
        marginTop: 5,
        position: 'absolute',
        right: 10
    },
})