import { ActivityIndicator, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { RootStackParamList } from "../../navigations/navigation";
import firestore from '@react-native-firebase/firestore';
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { layout } from "../../constants/dimensions/dimension";
import { images } from "../../images";
import { Net_dut } from "../../components/net-dut";
import Icon from "react-native-vector-icons/FontAwesome";
import auth from '@react-native-firebase/auth';
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';



type iUser = {
    birthday: string;
    full_name: string;
    gender: string;
    introduction: string;
    phone: string;
    rating: number;
};

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const formatDate = (date: Date): string => {

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
};



export const ProfileScreen = () => {
    const [userId, setUserId] = useState<string | null>('');
    const [user, setUser] = useState<iUser | null>(null);
    const [profileId, setProfileId] = useState<string>('')
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const [image, setImage] = useState({
        avatar: images.avartar_pic,
        cover: images.background_pic,
    })

    const [loading, setLoading] = useState({
        avatarLoading: false,
        coverLoading: false
    });


    const handleLogOut = async () => {
        auth()
            .signOut()
            .then(() => {
                navigation.replace('Login')
            });
    }

    const getData = async () => {
        // setLoading(true)
        const user_Id = auth().currentUser?.uid
        if (user_Id) {
            setUserId(user_Id)
        }

        const snapshot = await firestore().collection('profile').where('user_id', '==', user_Id).get();


        if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            setProfileId(doc.id)
            const userData = doc.data();
            const formattedUserData: iUser = {
                birthday: formatDate(userData.birthday.toDate()), // Convert Firestore Timestamp to JavaScript Date
                full_name: userData.full_name,
                gender: userData.gender,
                introduction: userData.introduction,
                phone: userData.phone,
                rating: userData.rating,

            };
            setUser(formattedUserData);



        } else {
            console.log("No user found with the given ID");
        }
    };

    const getImgae = async () => {
        setLoading(prev => ({
            ...prev, avatarLoading: true
        }))

        setLoading(prev => ({
            ...prev, coverLoading: true
        }))
        const avatarRef = storage().ref(`users/${userId}/avatar.jpg`);
        const coverRef = storage().ref(`users/${userId}/cover.jpg`);

        try {
            const avatarDownloadUrl = await avatarRef.getDownloadURL();
            const coverDownloadUrl = await coverRef.getDownloadURL();
            setImage(prev => ({
                ...prev, avatar: avatarDownloadUrl
            }));
            setImage(prev => ({
                ...prev, cover: coverDownloadUrl
            }));
            setLoading(prev => ({
                ...prev, avatarLoading: false
            }))
            setLoading(prev => ({
                ...prev, coverLoading: false
            }))
        } catch (error) {
            setImage(prev => ({
                ...prev, avatar: images.avartar_pic
            }));
            setImage(prev => ({
                ...prev, cover: images.background_pic
            }));
        }
    }

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        getImgae()
    }, []);

    const pickImages = async (type: number) => {
        try {
            const pickedImage = await ImagePicker.openPicker({
                multiple: false,
                mediaType: 'photo',
            });
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

                const storageRef = storage().ref(`users/${userId}/${fileName}`);
                await storageRef.putFile(uploadUri);

            }
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            {!loading.coverLoading ?
                <TouchableOpacity style={styles.title_container} onPress={() => { pickImages(1) }}>
                    <Image source={image.cover === images.background_pic ? images.background_pic : { uri: image.cover }}
                        resizeMode='cover'
                        style={{ width: '100%', height: '100%' }} />
                    <TouchableOpacity style={styles.cover_image} onPress={() => { pickImages(1) }}>
                        <Icon name="camera" size={15} color={'black'} />
                        <Text style={[styles.text_15, { marginLeft: 5 }]}>Change cover image</Text>
                    </TouchableOpacity>
                </TouchableOpacity>

                :
                <ActivityIndicator size="large" color="#0000ff" />
            }


            <View style={styles.avatar_info_container}>
                {!loading.avatarLoading ?
                    <TouchableOpacity style={styles.avatar_container} onPress={() => { pickImages(0) }}>
                        <View style={styles.camera_avatar_container}>
                            <Icon name="camera" size={15} color={'white'} />
                        </View>

                        <Image source={image.avatar === images.avartar_pic ? images.avartar_pic : { uri: image.avatar }}
                            resizeMode='cover'
                            style={{ height: '100%', width: '100%', borderRadius: 100 }} />
                    </TouchableOpacity>
                    :
                    <ActivityIndicator size="large" color="#0000ff" />
                }


                <View style={styles.name_info_container}>
                    <Text style={styles.text_20}>
                        {user?.full_name}
                    </Text>
                    <Text style={styles.text_15}>
                        {user?.birthday}
                    </Text>
                </View>

            </View>

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
                        {user?.rating.toFixed(1)}
                    </Text>
                    <Text style={styles.task_title}>
                        Rating Review
                    </Text>
                </View>
            </View>

            <View style={styles.intro_container}>
                <Text style={styles.text_15}>{user?.introduction}</Text>
            </View>

            <TouchableOpacity style={styles.manage_container}>
                <View style={styles.manage_title}>
                    <Icon name="tasks" size={20} color={'black'} style={{ marginRight: 10 }} />
                    <Text style={styles.text_15}>Manage Tasks</Text>
                </View>
                <View>
                    <Icon name="angle-right" size={30} color={'black'} />
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.manage_container}>
                <View style={styles.manage_title}>
                    <Icon name="edit" size={20} color={'black'} style={{ marginRight: 10 }} />
                    <Text style={styles.text_15}>Edit Profile</Text>
                </View>
                <View>
                    <Icon name="angle-right" size={30} color={'black'} />
                </View>
            </TouchableOpacity>


            <View style={styles.logout_container}>
                <TouchableOpacity style={styles.logout_button} onPress={() => { handleLogOut() }}>
                    <Text style={styles.text_logout}>Log out</Text>
                </TouchableOpacity>
            </View>


            {/* <Net_dut/> */}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 10,
        position: 'relative'
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
