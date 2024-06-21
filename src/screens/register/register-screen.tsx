import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { layout } from "../../constants/dimensions/dimension";
import { color } from "../../constants/colors/color";
import Animated, { BounceInRight, LightSpeedOutRight } from "react-native-reanimated";
import { images } from "../../images";
import { HomeScreenNavigationProp } from "../../navigations/navigation";
import { useNavigation } from "@react-navigation/native";
import firestore from '@react-native-firebase/firestore';


export const RegisterScreen: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [rePassword, setRePassword] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [fetching, setFetching] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [isValid, setValid] = useState<boolean>(true);
    const [notificationVisible, setNotificationVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const navigation = useNavigation<HomeScreenNavigationProp>();


    const isEmailValid = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    const isLoginDisabled = !email || !password || !rePassword || !phone || !isEmailValid(email);

    useEffect(() => {
        if (notificationVisible) {
            setTimeout(() => {
                setNotificationVisible(false);
            }, 2000);
        }
    }, [notificationVisible]);

    const __doSignUp = () => {

        if (!password || !password.trim() || password.length < 8) {
            setErrorMessage("Weak password, minimum 8 chars")
            setNotificationVisible(true)
            return;
        } else if (!__isValidEmail(email)) {
            setErrorMessage("Invalid Email")
            setNotificationVisible(true)
            return;
        }

        __doCreateUser(email, password, rePassword, parseInt(phone));
    };

    const __doCreateUser = async (email: string, password: string, rePassword: string, phone: number) => {
        if (rePassword === password) {
            try {
                let response = await auth().createUserWithEmailAndPassword(email, password);
                if (response) {
                    setErrorMessage("Create account successfully")
                    setNotificationVisible(true)
                }

            } catch (e: unknown) {
                const error = e as FirebaseAuthTypes.NativeFirebaseAuthError;
                if (error.code === 'auth/email-already-in-use') {
                    setErrorMessage('That email address is already in use!')
                }

                if (error.code === 'auth/invalid-email') {
                    setErrorMessage('That email address is invalid!')
                }
                    
                setNotificationVisible(true)
            }
        }
        else if (rePassword !== password) {
            setErrorMessage("Password and Re-password are not the same")
            setNotificationVisible(true)
        }

    };

    const __isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    return (
        <View style={{ flex: 1, position: 'relative' }}>

            <View style={styles.login_image_container}>
                <Image source={images.register_pic} resizeMode='contain' style={{ width: '80%', height: '80%' }} />
            </View>

            <View style={styles.hello_container}>
                <View style={styles.wellcome_container}>
                    <Text style={styles.text_title}>New Owner</Text>
                </View>
            </View>

            <View style={styles.sign_in_container}>
                <View style={styles.input_container}>
                    <Text style={styles.text_input_blue}>Email: </Text>
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
                    <Text style={styles.text_input_blue}>Password: </Text>
                    <TextInput
                        style={[styles.text_input]}
                        placeholder="At least 8 characters"
                        placeholderTextColor={'#8897AD'}
                        onChangeText={setPassword}
                        value={password}
                        autoCapitalize="none"
                    />
                </View>
                <View style={styles.input_container}>
                    <Text style={styles.text_input_blue}>Re-Password: </Text>
                    <TextInput
                        style={[styles.text_input]}
                        placeholder="At least 8 characters"
                        placeholderTextColor={'#8897AD'}
                        onChangeText={setRePassword}
                        value={rePassword}
                        autoCapitalize="none"
                    />
                </View>
                <View style={styles.input_container}>
                    <Text style={styles.text_input_blue}>Phone: </Text>
                    <TextInput
                        style={[styles.text_input]}
                        placeholder="0123456789"
                        placeholderTextColor={'#8897AD'}
                        onChangeText={setPhone}
                        value={phone}
                        autoCapitalize="none"
                        keyboardType='numeric'
                    />
                </View>

                <TouchableOpacity
                    onPress={() => { __doSignUp() }}
                    style={isLoginDisabled ? styles.signin_button_disable : styles.signin_button}
                    disabled={isLoginDisabled}
                >
                    <Text style={styles.text_button}>Sign Up</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.sign_up_container}>
                <View style={styles.sign_up_title}>
                    <Text style={styles.text_15}>I have an account!!! </Text>
                    <TouchableOpacity onPress={() => { navigation.navigate('Login') }}>
                        <Text style={styles.text_blue}>Sign in</Text>
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
};

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
        height: layout.height * 0.1,
        width: layout.width,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    wellcome_container: {
        width: '100%',
        height: '100%',
        alignItems: 'center'
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
    text_input_blue: {
        color: color.link_text,
        fontSize: 15,
        fontWeight: '500',
        width: '30%'
    },
    sign_in_container: {
        width: layout.width,
        height: layout.height * 0.5,
        paddingHorizontal: 20,
        justifyContent: 'space-between',

    },
    input_container: {
        width: '100%',
        height: '20%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
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
        height: '15%',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    signin_button: {
        backgroundColor: '#49B4F1',
        width: '100%',
        height: '15%',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text_input: {
        width: '70%',
        height: '70%',
        backgroundColor: color.text_input,
        paddingHorizontal: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#D4D7E3',
        marginTop: 5
    },
    sign_up_container: {
        flex: 1,
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
    }
})
