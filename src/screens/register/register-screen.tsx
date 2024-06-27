import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { layout } from "../../constants/dimensions/dimension";
import { color } from "../../constants/colors/color";
import Animated, { BounceInRight, LightSpeedInRight, LightSpeedOutLeft, LightSpeedOutRight } from "react-native-reanimated";
import { images } from "../../images";
import {RootStackParamList } from "../../navigations/navigation";
import { useNavigation } from "@react-navigation/native";
import firestore from '@react-native-firebase/firestore';

import Icon from "react-native-vector-icons/FontAwesome";
import { __isValidEmail, doPasswordsMatch, isValidPassword } from "./register-validation";
import { StackNavigationProp } from "@react-navigation/stack";
import { ProfileModal } from "./register-modal";
import { CustomButton } from "../../components/custom-button";

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

export const RegisterScreen: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [account, setAccount] = useState({
        email: '',
        password: '',
        rePassword: '',
    })

    const [isValid, setIsValid] = useState({
        passwordError: '',
        emailError: ''
    })
    const [notificationVisible, setNotificationVisible] = useState(false);
    const [isModal, setIsModal] = useState({
        showModal: false,
        userId: '',
        email: ''
    });
    const [errorMessage, setErrorMessage] = useState<string>('');
    const navigation = useNavigation<RegisterScreenNavigationProp>();


    const [showPassword, setShowPassword] = useState({
        showPassword: false,
        showRePassword: false
    })



    const isRegister = !account.email || !account.password || !account.rePassword || !__isValidEmail(account.email);

    useEffect(() => {
        if (notificationVisible) {
            setTimeout(() => {
                setNotificationVisible(false);
            }, 2000);
        }
    }, [notificationVisible]);

    useEffect(() => {
        if (account.password) {
            if (!isValidPassword(account.password)) {
                setIsValid(prev => ({
                    ...prev,
                    passwordError: 'Password must contain at least 8 characters, including uppercase, lowercase, number, and special character.'
                }));
            } else {
                setIsValid(prev => ({
                    ...prev,
                    passwordError: ''
                }));
            }
        } else {
            setIsValid(prev => ({
                ...prev,
                passwordError: ''
            }));
        }
    }, [account.password]);

    useEffect(() => {
        if (account.email) {
            if (!__isValidEmail(account.email)) {
                setIsValid(prev => ({
                    ...prev,
                    emailError: 'Email must have type Example@email.com'
                }));
            } else {
                setIsValid(prev => ({
                    ...prev,
                    emailError: ''
                }));
            }
        } else {
            setIsValid(prev => ({
                ...prev,
                emailError: ''
            }));
        }
    }, [account.email]);


    const __doSignUp = () => {
        if (!account.password || !account.password.trim() || account.password.length < 8) {
            setErrorMessage("Weak password, minimum 8 chars")
            setNotificationVisible(true)
            return;
        } else if (!__isValidEmail(account.email)) {
            setErrorMessage("Invalid Email")
            setNotificationVisible(true)
            return;
        } else if (!isValidPassword(account.password)) {
            setErrorMessage("Password must contain at least 8 characters, including uppercase, lowercase, number, and special character.")
            setNotificationVisible(true)
            return;
        } else if (!doPasswordsMatch(account.password, account.rePassword)) {
            setErrorMessage("Password and Re-password are not the same")
            setNotificationVisible(true)
            return;
        }

        __doCreateUser(account.email, account.password,);
    };

    const __doCreateUser = async (email: string, password: string) => {
        setLoading(true);
        try {
            let response = await auth().createUserWithEmailAndPassword(email, password);
            if (response) {
                
                
                setIsModal(prev => ({...prev, showModal: true, userId: response.user.uid, email: account.email}))
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
        } finally {
            setLoading(false);
        }
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
                        onChangeText={(text) => { setAccount(prev => ({ ...prev, email: text })) }}
                        value={account.email}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>
                {isValid.emailError ? (
                    <Animated.View
                        entering={LightSpeedInRight.duration(500)}
                        exiting={LightSpeedOutRight.duration(500)}
                        style={styles.error_container}>
                        <Text style={styles.error_text}>{isValid.emailError}</Text>
                    </Animated.View>

                ) : <Animated.View
                    entering={LightSpeedInRight.duration(500)}
                    exiting={LightSpeedOutRight.duration(500)}></Animated.View>
                }
                <View style={styles.input_container}>
                    <Text style={styles.text_input_blue}>Password: </Text>
                    <View style={styles.text_input_container}>
                        <TextInput
                            style={[styles.text_input]}
                            placeholder="At least 8 characters"
                            placeholderTextColor={'#8897AD'}
                            onChangeText={(text) => { setAccount(prev => ({ ...prev, password: text })) }}
                            value={account.password}
                            autoCapitalize="none"
                            secureTextEntry={!showPassword.showPassword}
                        />
                        <TouchableOpacity
                            style={styles.eyeIconContainer}
                            onPress={() => {
                                setShowPassword(prev => ({
                                    ...prev,
                                    showPassword: !showPassword.showPassword
                                }))
                            }}
                        >
                            <Icon
                                name={showPassword.showPassword ? 'eye' : 'eye-slash'}
                                size={20}
                                color="black"
                            />
                        </TouchableOpacity>
                    </View>


                </View>
                {isValid.passwordError ? (
                    <Animated.View
                        entering={LightSpeedInRight.duration(500)}
                        exiting={LightSpeedOutRight.duration(500)}
                        style={styles.error_container}>
                        <Text style={styles.error_text}>{isValid.passwordError}</Text>
                    </Animated.View>

                ) : <Animated.View
                    entering={LightSpeedInRight.duration(500)}
                    exiting={LightSpeedOutRight.duration(500)}></Animated.View>
                }

                <Animated.View style={[styles.input_container]}>
                    <Text style={styles.text_input_blue}>Re-Password: </Text>
                    <View style={styles.text_input_container}>
                        <TextInput
                            style={[styles.text_input]}
                            placeholder="At least 8 characters"
                            placeholderTextColor={'#8897AD'}
                            onChangeText={(text) => { setAccount(prev => ({ ...prev, rePassword: text })) }}
                            value={account.rePassword}
                            autoCapitalize="none"
                            secureTextEntry={!showPassword.showRePassword}
                        />
                        <TouchableOpacity
                            style={styles.eyeIconContainer}
                            onPress={() => {
                                setShowPassword(prev => ({
                                    ...prev,
                                    showRePassword: !showPassword.showRePassword
                                }))
                            }}
                        >
                            <Icon
                                name={showPassword.showPassword ? 'eye' : 'eye-slash'}
                                size={20}
                                color="black"
                            />
                        </TouchableOpacity>
                    </View>

                </Animated.View>

                <CustomButton
                    title="Sign Up"
                    onPress={__doSignUp}
                    style={styles.signin_button}
                    disabled={isRegister}
                    disabledStyle={styles.signin_button_disable}
                    loading={loading}
                />

                <TouchableOpacity
                    onPress={() => { __doSignUp() }}
                    style={isRegister ? styles.signin_button_disable : styles.signin_button}
                    disabled={isRegister}
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

            {isModal ? <ProfileModal isModal={isModal.showModal} userId={isModal.userId} email={isModal.email} navigation={navigation} /> : null}
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

    },
    input_container: {
        width: '100%',
        height: '20%',
        marginBottom: 10,
        justifyContent: 'space-between',
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
        justifyContent: 'center',
        marginTop: 20
    },
    signin_button: {
        backgroundColor: '#49B4F1',
        width: '100%',
        height: '15%',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20
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
    },
    error_container: {

    },
    error_text: {
        color: 'red',
        fontSize: 12,
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
