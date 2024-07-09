import { useEffect, useState } from "react"
import { Image, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { layout } from "../../constants/dimensions/dimension"
import Animated, { FadeIn, LightSpeedInRight, LightSpeedOutRight } from "react-native-reanimated"
import { color } from "../../constants/colors/color"
import { images } from "../../images"
import firestore from '@react-native-firebase/firestore';
import { validateVietnamesePhoneNumber } from "../register/register-validation"
import DateTimePicker from '@react-native-community/datetimepicker';
import { iUser } from "../../../types/userType"
import { convertStringToDate, formatDate } from "../../constants/formatDate"
import { useDispatch } from "react-redux"
import { setUserData } from "../../redux/user/userSlice"


type editModal = {
    isModal: boolean,
    userData: iUser,
    closeModal: () => void
}

type accountInfo = {
    first_name: string,
    last_name: string,
    birthday: Date,
    phone: string,
    introduction: string,
    gender: string,
}


export const EditProfile = ({ isModal, userData, closeModal }: editModal) => {
    const dispatch = useDispatch();
    const [account, setAccount] = useState<accountInfo>({
        first_name: userData.first_name,
        last_name: userData.last_name,
        birthday: convertStringToDate(userData.birthday),
        phone: userData.phone,
        introduction: userData.introduction,
        gender: userData.gender,
    })

    const [isValid, setIsValid] = useState('')


    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showGenderOptions, setShowGenderOptions] = useState(false);
    const onChangeDate = (event: any, selectedDate: any) => {
        const currentDate = selectedDate || account.birthday;
        setShowDatePicker(Platform.OS === 'ios');
        setAccount((prev) => ({ ...prev, birthday: currentDate }));
    };

    const selectGender = (gender: string) => {
        setAccount((prev) => ({ ...prev, gender }));
        setShowGenderOptions(false); // Hide gender options after selection
    };

    const handleEditInfo = async () => {
        try {
            await firestore()
                .collection('users')
                .doc(userData.id)
                .update({
                    ...account,
                });
            const formattedUserData: iUser = {
                ...userData,
                ...account,
                birthday: formatDate(account.birthday),
            };
            dispatch(setUserData(formattedUserData));
            closeModal()
        } catch (error) {
            console.error("Error updating user information: ", error);
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

    const isRegister = !account.last_name || !account.first_name || !account.birthday || !account.introduction || !account.phone;


    return (
        <Modal
            animationType={'slide'}
            visible={isModal}
        >
            <View style={styles.container}>
                <View style={styles.login_image_container}>
                    <Image source={images.register_pic} resizeMode='contain' style={{ width: '80%', height: '80%' }} />
                </View>

                <View style={styles.hello_container}>
                    <View style={styles.wellcome_container}>
                        <Text style={styles.text_title}>Let change some infomation</Text>
                    </View>
                </View>

                <View style={styles.sign_in_container}>
                    <View style={[styles.name_input, {height: '13%'}]}>
                        <View style={styles.first_name_container}>
                            <Text style={styles.text_name}>First Name: </Text>
                            <TextInput
                                style={[styles.text_input]}
                                placeholder="William"
                                placeholderTextColor={'#8897AD'}
                                onChangeText={(text) => { setAccount(prev => ({ ...prev, first_name: text })) }}
                                value={account.first_name}
                                autoCapitalize='words'
                            />
                        </View>

                        <View style={styles.first_name_container}>
                            <Text style={styles.text_name}>Last Name: </Text>
                            <TextInput
                                style={[styles.text_input,]}
                                placeholder="Fang"
                                placeholderTextColor={'#8897AD'}
                                onChangeText={(text) => { setAccount(prev => ({ ...prev, last_name: text })) }}
                                value={account.last_name}
                                autoCapitalize='words'
                            />
                        </View>
                    </View>

                    <View style={styles.birthday_container}>
                        <Text style={styles.text_birthday}>Birthday: </Text>
                        <TouchableOpacity style={[styles.input_birthday, { width: '30%' }]} onPress={() => { setShowDatePicker(true) }}>
                            <Text style={[styles.text_input, { textAlignVertical: 'center' }]}>{formatDate(account.birthday)}</Text>
                        </TouchableOpacity>

                        <Text style={[styles.text_birthday]}>Gender: </Text>
                        <TouchableOpacity style={[styles.input_birthday]} onPress={() => { setShowGenderOptions(true) }}>
                            <Text style={[styles.text_input, { textAlignVertical: 'center' }]}>{account.gender || 'Select Gender'}</Text>
                        </TouchableOpacity>
                    </View>

                    {showGenderOptions && (
                        <Animated.View style={styles.genderOptions} entering={FadeIn.duration(500)}>
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
                    )}

                    {showDatePicker && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={new Date(account.birthday)}
                            mode="date" // Set mode: 'date', 'time', or 'datetime'
                            is24Hour={true}
                            display="default" // Set display: 'default', 'spinner', 'calendar' (only for iOS)
                            onChange={onChangeDate}
                        />
                    )}

                    <View style={[styles.input_container]}>
                        <Text style={styles.text_input_blue}>Phone: </Text>
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

                    <View style={[styles.input_container]}>
                        <Text style={styles.text_input_blue}>Introduce: </Text>
                        <TextInput
                            style={[styles.text_input, { height: 100 }]}
                            placeholder="Hi, I'm William"
                            placeholderTextColor={'#8897AD'}
                            onChangeText={(text) => { setAccount(prev => ({ ...prev, intro: text })) }}
                            value={account.introduction}
                            numberOfLines={4}
                            multiline={true}
                        />
                    </View>
                    <TouchableOpacity
                        onPress={() => { handleEditInfo() }}
                        style={isRegister || isValid !== '' ? styles.signin_button_disable : styles.signin_button}
                        disabled={isRegister}
                    >
                        <Text style={styles.text_button}>Edit Profile</Text>
                    </TouchableOpacity>
                </View>


            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    login_image_container: {
        width: layout.width,
        height: layout.height * 0.25,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    error_text: {
        color: 'red',
        fontSize: 12,
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
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'center'
    },
    sign_in_container: {
        width: layout.width,
        height: layout.height * 0.7,
        paddingHorizontal: 20,

    },
    birthday_container: {
        width: '100%',
        height: '10%',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    input_birthday: {
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        width: '25%'
    },
    input_container: {
        width: '100%',
        height: '15%',
        marginBottom: 10,
        justifyContent: 'space-between',
    },
    text_input_blue: {
        color: color.link_text,
        fontSize: 15,
        fontWeight: '500',
        width: '30%'
    },
    text_birthday: {
        color: color.link_text,
        fontSize: 15,
        fontWeight: '500',
        width: '20%',
        textAlign: 'center',
        textAlignVertical: 'center'
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
    signin_button_disable: {
        backgroundColor: color.button_color,
        width: '100%',
        height: '10%',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50
    },
    signin_button: {
        backgroundColor: '#49B4F1',
        width: '100%',
        height: '10%',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50
    },
    genderOptions: {
        width: '100%',
        marginTop: 10,
        borderColor: '#D4D7E3',
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: '#FFF',
        paddingHorizontal: 10,
        paddingVertical: 5,
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
    }
})