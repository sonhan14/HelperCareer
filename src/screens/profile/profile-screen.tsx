import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { RootStackParamList } from "../../navigations/navigation";
import firestore from '@react-native-firebase/firestore';
import { useEffect, useLayoutEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { layout } from "../../constants/dimensions/dimension";
import { images } from "../../images";
import auth from '@react-native-firebase/auth';
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import ProfileImageSection from "../../components/cover-avatar";
import SweepButton from "../../components/sweep-button";
import { useDispatch, useSelector } from "react-redux";
import { clearUserData, selectUserData } from "../../redux/user/userSlice";
import { EditProfile } from "./profile-edit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Feature } from "../../../types/homeTypes";
import { ProfileAdress } from "./profile-address";





type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList>;



export const ProfileScreen = () => {
    const userData = useSelector(selectUserData);
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const [isModal, setIsModal] = useState(false);
    const [isAddress, setIsAddress] = useState(false);
    const [image, setImage] = useState({
        avatar: images.avartar_pic,
        cover: images.background_pic,
    })

    const dispatch = useDispatch()

    const openEdit = () => {
        if (userData) {
            setIsModal(true)
        }
    }

    const closeEdit = () => {
        setIsModal(false)
    }

    const openAddress = () => {
        if (userData) {
            setIsAddress(true)
        }
    }

    const closeAddress = () => {
        setIsAddress(false)

    }

    const handleLogOut = async () => {
        try {
            await Promise.all([
                AsyncStorage.removeItem('userEmail'),
                AsyncStorage.removeItem('userPassword'),
                dispatch(clearUserData()),
                auth().signOut()
            ]);
            console.log('Logged out successfully!');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    useEffect(() => {
        if (userData) {
            setImage((prev) => ({
                ...prev, avatar: userData.avatar, cover: userData.cover
            }))
        }
    }, [userData]);

    const pickImages = async (type: number) => {
        const currentImageState = { ...image };
        try {
            const pickedImage = await ImagePicker.openPicker({
                multiple: false,
                mediaType: 'photo',
            });
            if (!pickedImage) {
                return;
            }
            if (pickedImage) {
                const imagePath = pickedImage.path;

                type === 0 ?
                    setImage(prev => ({
                        ...prev, avatar: imagePath
                    }))
                    :
                    setImage(prev => ({
                        ...prev, cover: imagePath
                    }))
                const uploadUri = Platform.OS === 'ios' ? imagePath.replace('file://', '') : imagePath;
                const fileName = type === 0 ? 'avatar.jpg' : 'cover.jpg';

                const storageRef = storage().ref(`users/${userData?.id}/${fileName}`);
                await storageRef.putFile(uploadUri);
                try {
                    const imageUrl = await storageRef.getDownloadURL();
                    type === 0 ?
                        await firestore()
                            .collection('users')
                            .doc(userData?.id)
                            .update({
                                avatar: imageUrl,
                            })
                        :
                        await firestore()
                            .collection('users')
                            .doc(userData?.id)
                            .update({
                                cover: imageUrl,
                            })

                } catch (error) {
                    console.error('Image upload error: ', error);
                }

            }
        } catch (error) {
            setImage(currentImageState);
        }
    };




    return (
        <SafeAreaView style={styles.container}>
            <ProfileImageSection
                image={image}
                pickImages={pickImages}
                user={userData}
                isEditable={true}
                openMap={openAddress}
            />
            <View style={styles.review_container}>
                <View style={styles.task_container}>
                    <Text style={styles.task_number}>
                        500
                    </Text>
                    <Text style={styles.task_title}>
                        Tasks Completed
                    </Text>
                </View>
                <View style={styles.task_container}>
                    <Text style={styles.task_number}>
                        {userData?.rating.toFixed(1)}
                    </Text>
                    <Text style={styles.task_title}>
                        Rating Review
                    </Text>
                </View>
            </View>

            <View style={styles.intro_container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={[styles.text_15, { textAlign: 'justify' }]}>{userData?.introduction}</Text>
                </ScrollView>
            </View>

            <SweepButton onPress={() => openEdit()} iconName="edit" label="Edit Profile" />
            <SweepButton onPress={() => { navigation.navigate('AboutApp') }} iconName="tasks" label="About" />

            <View style={styles.logout_container}>
                <TouchableOpacity style={styles.logout_button} onPress={() => { handleLogOut() }}>
                    <Text style={styles.text_logout}>Log out</Text>
                </TouchableOpacity>
            </View>

            {isModal && userData ? <EditProfile isModal={isModal} userData={userData} closeModal={closeEdit} /> : null}
            {isAddress && userData ? <ProfileAdress isAddress={isAddress} closeModal={closeAddress} /> : null}

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 10,
        position: 'relative',
        backgroundColor: 'white'
    },
    text_30: {
        color: 'black',
        fontSize: 30,
        fontWeight: '500'
    },
    title_container: {
        height: layout.height * 0.2,
        width: layout.width,
        position: 'absolute'
    },
    avatar_info_container: {
        height: layout.height * 0.12,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: layout.height * 0.17,

    },
    avatar_container: {
        height: layout.height * 0.12,
        width: layout.height * 0.12,
        borderRadius: 100,
        position: 'relative',

    },
    name_info_container: {
        height: layout.height * 0.12,
        width: '50%',
        justifyContent: 'center',
        marginLeft: 15
    },
    text_20: {
        color: 'black',
        fontWeight: '500',
        fontSize: 20
    },
    text_15: {
        color: 'black',
        fontWeight: '400',
        fontSize: 15
    },
    edit_container: {
        height: layout.height * 0.12,
        width: '20%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    review_container: {
        height: layout.height * 0.07,
        width: '100%',
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: 20
    },
    task_container: {
        height: layout.height * 0.07,
        width: '50%',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    task_title: {
        color: 'black',
        fontWeight: '300',
        fontSize: 14
    },
    task_number: {
        color: 'black',
        fontWeight: '500',
        fontSize: 20
    },
    intro_container: {
        height: layout.height * 0.2,
        width: '100%',
        marginTop: 50,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'black',
        padding: 10
    },
    manage_container: {
        width: '100%',
        height: layout.height * 0.05,
        borderRadius: 10,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        borderWidth: 0.08
    },
    manage_title: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '40%'
    },
    text_logout: {
        color: 'white',
        fontWeight: '500',
        fontSize: 20
    },
    logout_container: {
        height: layout.height * 0.05,
        width: '100%',
        alignItems: 'center',
        marginTop: 20
    },
    logout_button: {
        height: layout.height * 0.05,
        width: layout.width * 0.5,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red'
    },
    camera_avatar_container:
    {
        position: 'absolute',
        zIndex: 1,
        right: 5,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        height: 30,
        width: 30,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cover_image: {
        position: 'absolute',
        backgroundColor: 'white',
        padding: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 5,
        bottom: 10,
        right: 10
    }
});
