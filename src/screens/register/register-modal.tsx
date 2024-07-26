import { Image, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { images } from "../../images"
import { layout } from "../../constants/dimensions/dimension"
import { color } from "../../constants/colors/color"
import { useEffect, useState } from "react"
import DateTimePicker from '@react-native-community/datetimepicker';
import Animated, { FadeIn, FlipInXDown, FlipOutXDown, interpolate, LightSpeedInRight, LightSpeedOutRight, RollInLeft, RollOutLeft, RollOutRight, StretchOutX, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
import { validateVietnamesePhoneNumber } from "./register-validation"
import FastImage from "react-native-fast-image"
import { StartInfo } from "./start-info"
import { FinishInfo } from "./finish-info"
import ImagePicker from 'react-native-image-crop-picker';
import { Feature } from "../../../types/homeTypes"
import { AddInfo } from "./register-helper"
import { useDispatch } from "react-redux"


export type accountInfo = {
    first_name: string,
    last_name: string,
    birth_day: Date,
    phone: string,
    intro: string,
    gender: string,
}

export const ProfileModal = ({ isModal, userId, navigation, email, password }: { isModal: boolean, userId: string, navigation: any, email: string, password: string }) => {

    const [step, setStep] = useState<number>(0)
    const [account, setAccount] = useState<accountInfo>({
        first_name: '',
        last_name: '',
        birth_day: new Date(),
        phone: '',
        intro: '',
        gender: '',
    })
    const [loading, setLoading] = useState<boolean>(false)
    const dispatch = useDispatch();
    const [isValid, setIsValid] = useState('')
    const [image, setImage] = useState<string>('')
    const animationValue = useSharedValue(0)
    const [selectedLocation, setSelectedLocation] = useState<Feature>(
        {
            id: '',
            full_address: 'string',
            center: [0, 0]
        }
    );
    const animationStyle = useAnimatedStyle(() => {
        return {
            height: animationValue.value,
            borderWidth: interpolate(
                animationValue.value,
                [0, layout.height * 0.2],
                [0, 1]
            )
        }
    })

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showGenderOptions, setShowGenderOptions] = useState(false);

    const onChangeDate = (event: any, selectedDate: any) => {
        const currentDate = selectedDate || account.birth_day;
        setShowDatePicker(Platform.OS === 'ios');
        setAccount((prev) => ({ ...prev, birth_day: currentDate }));
    };

    const selectGender = (gender: string) => {
        setAccount((prev) => ({ ...prev, gender }));
        setShowGenderOptions(false); // Hide gender options after selection
    };

    const handleAddInfo = () => {
        AddInfo({ password, userId, account, email, image, selectedLocation, dispatch, setLoading })
    }

    const pickImages = async () => {
        const currentImageState = image;
        try {
            const pickedImage = await ImagePicker.openPicker({
                mediaType: 'photo',
            });
            if (!pickedImage) {
                return;
            }
            if (pickedImage) {
                const imagePath = pickedImage.path;
                setImage(imagePath);
            }
        } catch (error) {
            setImage(currentImageState);
        }
    };

    useEffect(() => {
        if (account.phone) {
            if (!validateVietnamesePhoneNumber(account.phone)) {
                setIsValid('Phone number must be VietNamese phone number')
            } else {
                setIsValid('')
            }
        } else {
            setIsValid('')
        }
    }, [account.phone]);

    useEffect(() => {
        animationValue.value = withTiming(showGenderOptions ? layout.height * 0.2 : 0, { duration: 500 })
    }, [showGenderOptions])

    const isRegister = !account.last_name || !account.first_name || !account.birth_day || !account.intro || !account.phone;
    const isButton = !account.last_name || !account.first_name || !account.birth_day || !account.gender || image === ''


    return (
        <Modal
            animationType={'slide'}
            visible={isModal}>
            {step === 0 ?
                <StartInfo setStep={setStep} />
                : step === 1 ?
                    <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                        <Animated.View style={styles.container} entering={LightSpeedInRight.duration(500)} exiting={StretchOutX.duration(500)}>
                            <View style={styles.login_image_container}>
                                <Text style={styles.text_title}>Complete your profile</Text>
                                <TouchableOpacity style={styles.avatar_container} onPress={() => pickImages()}>
                                    <FastImage source={image === '' ? images.avatar_animation : { uri: image }} resizeMode={'cover'} style={styles.avatar} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.sign_in_container}>
                                <View style={styles.input_container}>
                                    <Text style={styles.text_input_blue}>First Name</Text>
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
                                    <Text style={styles.text_input_blue}>Last Name</Text>
                                    <TextInput
                                        style={[styles.text_input,]}
                                        placeholder="Fang"
                                        placeholderTextColor={'#8897AD'}
                                        onChangeText={(text) => { setAccount(prev => ({ ...prev, last_name: text })) }}
                                        value={account.last_name}
                                        autoCapitalize='words'
                                    />
                                </View>
                                <View style={styles.input_container}>
                                    <Text style={styles.text_input_blue}>Birthday</Text>
                                    <View style={styles.button_shadow}>
                                        <TouchableOpacity style={[styles.input_birthday]} onPress={() => { setShowDatePicker(true) }}>
                                            <Text style={[styles.text_input_birthday]}>{account.birth_day.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={styles.input_container}>
                                    <Text style={styles.text_input_blue}>Gender</Text>
                                    <View style={styles.button_shadow}>
                                        <TouchableOpacity style={[styles.input_birthday]} onPress={() => { setShowGenderOptions(true) }}>
                                            <Text style={[styles.text_input_birthday]}>{account.gender || 'Select Gender'}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <Animated.View style={[styles.genderOptions, animationStyle]} >
                                    <TouchableOpacity style={styles.genderOption} onPress={() => selectGender('Male')}>
                                        <Text style={styles.genderOptionText}>Male</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.genderOption} onPress={() => selectGender('Female')}>
                                        <Text style={styles.genderOptionText}>Female</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.genderOption} onPress={() => selectGender('Other')}>
                                        <Text style={styles.genderOptionText}>Other</Text>
                                    </TouchableOpacity>
                                </Animated.View>


                                {showDatePicker && (
                                    <DateTimePicker
                                        testID="dateTimePicker"
                                        value={account.birth_day}
                                        mode="date"
                                        is24Hour={true}
                                        display="default"
                                        onChange={onChangeDate}
                                    />
                                )}
                            </View>
                            <TouchableOpacity
                                onPress={() => { setStep(2) }}
                                style={isButton ? styles.signin_button_disable : styles.signin_button}
                                disabled={isButton}
                            >
                                <Text style={styles.text_button}>Continue</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </ScrollView>
                    :
                    <FinishInfo account={account} setAccount={setAccount} isRegister={isRegister} isValid={isValid} selectedLocation={selectedLocation} setSelectedLocation={setSelectedLocation} handleAddInfo={handleAddInfo} loading={loading} />
            }
        </Modal >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    login_image_container: {
        width: layout.width,
        height: layout.height * 0.2,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginVertical: 15,
    },

    hello_container: {
        height: layout.height * 0.1,
        width: layout.width,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    text_button: {
        color: 'white',
        fontSize: 20,
        fontWeight: '500'
    },
    wellcome_container: {
        width: '100%',
        height: '100%',
        alignItems: 'center'
    },
    text_title: {
        color: color.link_text,
        fontSize: 25,
        fontWeight: '700',
        textAlign: 'center'
    },
    sign_in_container: {
        width: layout.width,
        paddingHorizontal: 20,

    },
    input_birthday: {
        height: '100%',
        width: '100%',
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
        shadowColor: 'black',
        shadowOpacity: 0.3,
        elevation: 5,
    },
    text_input_birthday: {
        height: '100%',
        textAlignVertical: 'center',
        width: '100%',
        backgroundColor: 'white',
    },
    button_shadow: {
        width: '100%',
        height: '70%',
        backgroundColor: 'white',
        paddingHorizontal: 10,
        borderRadius: 10,
        shadowColor: 'black',
        shadowOpacity: 0.3,
        elevation: 5,
    },
    signin_button_disable: {
        backgroundColor: '#49B4F1',
        width: layout.width - 20,
        height: layout.height * 0.07,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
        opacity: 0.5
    },
    signin_button: {
        backgroundColor: '#49B4F1',
        width: layout.width - 20,
        height: layout.height * 0.07,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50
    },
    genderOptions: {
        width: '100%',
        borderColor: '#D4D7E3',
        borderRadius: 10,
        backgroundColor: '#FFF',
        paddingHorizontal: 10,

    },
    genderOption: {
        paddingVertical: 10,
    },
    genderOptionText: {
        fontSize: 16,
        color: color.link_text,
    },
    name_input: {
        height: '15%',
        width: '100%',
        marginBottom: 10,
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    first_name_container: {
        height: '100%',
        width: '45%'
    },
    text_name: {
        color: color.link_text,
        fontSize: 15,
        fontWeight: '500',
    },
    avatar_container: {
        height: layout.height * 0.15,
        width: layout.height * 0.15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    avatar: {
        height: layout.height * 0.12,
        width: layout.height * 0.12,
        borderRadius: 100,
    }
})