import { useEffect, useState } from "react";
import { ActivityIndicator, Image, Text, TextInput, TouchableOpacity, View } from "react-native"
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { images } from "../../images";
import Animated, { BounceInRight, FadeIn, FadeOut, LightSpeedOutRight } from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigations/navigation";
import Icon from "react-native-vector-icons/FontAwesome";
import { StackNavigationProp } from "@react-navigation/stack";
import { login_styles } from "./login.style";
import { CustomButton } from "../../components/custom-button";


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

    const handleSignIn = async () => {
        setLoading(true);
        try {
            const response = await auth().signInWithEmailAndPassword(email, password);
            if (response?.user) {
                navigation.replace('MainTabs', { userId: response.user.uid });
            }
        } catch (e: unknown) {
            const error = e as FirebaseAuthTypes.NativeFirebaseAuthError;
                switch (error.code) {
                    case 'auth/invalid-credential':
                        setErrorMessage('Incorrect email or password.');
                        break;
                    default:
                        setErrorMessage('An unknown error occurred. Please try again.');
                }
            
            setNotificationVisible(true);
            console.log(error.message);
        } finally {
            setLoading(false);
        }
    };


    return (
        <View style={{ flex: 1, position: 'relative' }}>

            <View style={login_styles.login_image_container}>
                <Image source={images.wellcome_pic} resizeMode='contain' style={{ width: '80%', height: '80%' }} />
            </View>

            <View style={login_styles.hello_container}>
                <View style={login_styles.wellcome_container}>
                    <Text style={login_styles.text_title}>Wellcome Back</Text>
                </View>

                <View style={login_styles.wellcome_container}>
                    <Text style={login_styles.text_15}>Today is a new day. It's your day. You shape it.
                    </Text>
                    <Text style={login_styles.text_15}>Sign in to start managing your projects</Text>
                </View>

            </View>

            <View style={login_styles.sign_in_container}>
                <View style={login_styles.input_container}>
                    <Text style={login_styles.text_blue}>Email</Text>
                    <TextInput
                        style={[login_styles.text_input]}
                        placeholder="Example@email.com"
                        placeholderTextColor={'#8897AD'}
                        onChangeText={setEmail}
                        value={email}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>
                <View style={login_styles.input_container}>
                    <Text style={login_styles.text_blue}>Password</Text>
                    <View style={login_styles.text_input_container}>
                        <TextInput
                            style={[login_styles.text_input]}
                            placeholder="At least 8 characters"
                            placeholderTextColor={'#8897AD'}
                            onChangeText={setPassword}
                            value={password}
                            autoCapitalize="none"
                            secureTextEntry={!showPassword}
                        />

                        <TouchableOpacity
                            style={login_styles.eyeIconContainer}
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
                <View style={login_styles.forgot_password_container}>
                    <TouchableOpacity style={login_styles.forgot_password}>
                        <Text style={login_styles.text_blue}>Forgot Password?</Text>
                    </TouchableOpacity>
                </View>
                <CustomButton
                    title="Sign In"
                    onPress={handleSignIn}
                    style={login_styles.signin_button}
                    disabled={isLoginDisabled}
                    disabledStyle={login_styles.signin_button_disable}
                    loading={loading}
                />
            </View>

            <View style={login_styles.sign_up_container}>
                <View style={login_styles.sign_up_title}>
                    <Text style={login_styles.text_15}>Don't you have an account? </Text>
                    <TouchableOpacity onPress={() => { navigation.navigate('Register') }}>
                        <Text style={login_styles.text_blue}>Sign up</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {notificationVisible ?
                <Animated.View
                    entering={BounceInRight.duration(500)}
                    exiting={LightSpeedOutRight.duration(500)}
                    style={login_styles.noti_container}>
                    <Text style={[login_styles.text_15]}>{errorMessage}</Text>
                </Animated.View>
                :
                null
            }
        </View>
    )
}