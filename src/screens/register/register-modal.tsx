import { Image, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { images } from "../../images"
import { layout } from "../../constants/dimensions/dimension"
import { color } from "../../constants/colors/color"
import { useState } from "react"
import DateTimePicker from '@react-native-community/datetimepicker';
import Animated, { FadeIn } from "react-native-reanimated"
import firestore from '@react-native-firebase/firestore';



type accountInfo = {
    first_name: string,
    last_name: string,
    birth_day: Date,
    phone: string,
    intro: string,
    gender: string,

}

export const ProfileModal = ({ isModal, userId, navigation, email }: { isModal: boolean, userId: string, navigation: any, email: string }) => {


    const [account, setAccount] = useState<accountInfo>({
        first_name: '',
        last_name: '',
        birth_day: new Date(),
        phone: '',
        intro: '',
        gender: '',
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

    const handleAddInfo = async () => {

        firestore()
            .collection('users')
            .doc(userId)
            .set({
                first_name: account.first_name,
                last_name: account.last_name,
                gender: account.gender,
                birthday: account.birth_day,
                introduction: account.intro,
                phone: account.phone,
                rating: 5.0,
                email: email,
                role: 'Owner'
            })
            .then(() => {
                navigation.replace('MainTabs', { userId: userId })
            })
    }

    const isRegister = !account.last_name || !account.first_name || !account.birth_day || !account.intro || !account.phone;

    return (
        <Modal
            animationType={'slide'}
            visible={isModal}>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.container}>
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
                            <Text style={styles.text_input_blue}>Full Name: </Text>
                            <View style={styles.name_container}>
                                <TextInput
                                    style={[styles.text_input, {width: '40%'}]}
                                    placeholder="William"
                                    placeholderTextColor={'#8897AD'}
                                    onChangeText={(text) => { setAccount(prev => ({ ...prev, first_name: text })) }}
                                    value={account.first_name}
                                    autoCapitalize='words'
                                />
                                <TextInput
                                    style={[styles.text_input, {width: '40%'}]}
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
                            <TouchableOpacity style={[styles.input_birthday]} onPress={() => { setShowDatePicker(true) }}>
                                <Text style={[styles.text_input, { textAlignVertical: 'center' }]}>{account.birth_day.toLocaleDateString()}</Text>
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
                                value={account.birth_day}
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

                        <View style={[styles.input_container]}>
                            <Text style={styles.text_input_blue}>Introduce: </Text>
                            <TextInput
                                style={[styles.text_input, { height: 100 }]}
                                placeholder="Hi, I'm William"
                                placeholderTextColor={'#8897AD'}
                                onChangeText={(text) => { setAccount(prev => ({ ...prev, intro: text })) }}
                                value={account.intro}
                                numberOfLines={4}
                                multiline={true}
                            />
                        </View>
                        <TouchableOpacity
                            onPress={() => { handleAddInfo() }}
                            style={isRegister ? styles.signin_button_disable : styles.signin_button}
                            disabled={isRegister}
                        >
                            <Text style={styles.text_button}>Contitnue</Text>
                        </TouchableOpacity>
                    </View>


                </View>
            </ScrollView>

        </Modal >
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
        fontSize: 30,
        fontWeight: '500'
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
    name_container: {
        width: '100%',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
})