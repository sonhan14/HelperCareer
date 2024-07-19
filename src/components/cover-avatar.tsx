import React from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { iUser } from '../../types/userType';
import { images } from '../images';
import { layout } from '../constants/dimensions/dimension';
import FastImage from 'react-native-fast-image';


interface ProfileImageSectionProps {
    image: {
        avatar: string;
        cover: string;
    };
    pickImages?: (type: number) => void;
    user: iUser | null;
    isEditable: boolean;
}

const ProfileImageSection: React.FC<ProfileImageSectionProps> = ({ image, pickImages, user, isEditable }) => {
    return (
        <>

            <TouchableOpacity
                style={styles.title_container}
                onPress={() => isEditable && pickImages && pickImages(1)}
                disabled={!isEditable}
            >
                <Image
                    source={image.cover === images.background_pic ? images.background_pic : { uri: image.cover }}
                    resizeMode='cover'
                    style={{ width: '100%', height: '100%' }}
                />
                {isEditable && (
                    <TouchableOpacity style={styles.cover_image} onPress={() => pickImages && pickImages(1)}>
                        <Icon name="camera" size={15} color={'black'} />
                        <Text style={[styles.text_15, { marginLeft: 5 }]}>Change cover image</Text>
                    </TouchableOpacity>
                )}
            </TouchableOpacity>


            <View style={styles.avatar_info_container}>
                <TouchableOpacity
                    style={styles.avatar_container}
                    onPress={() => isEditable && pickImages && pickImages(0)}
                    disabled={!isEditable}
                >
                    {isEditable && (
                        <View style={styles.camera_avatar_container}>
                            <Icon name="camera" size={15} color={'white'} />
                        </View>
                    )}
                    <Image
                        source={image.avatar === images.avartar_pic ? images.avartar_pic : { uri: image.avatar }}
                        resizeMode='cover'
                        style={{ height: '100%', width: '100%', borderRadius: 100 }}
                    />
                </TouchableOpacity>


                <View style={styles.name_info_container}>
                    <Text style={styles.text_20}>
                        {user?.first_name} {user?.last_name}
                    </Text>
                    <Text style={styles.text_15}>
                        {user?.birthday}
                    </Text>
                    <TouchableOpacity style={styles.address_button}>
                        <FastImage source={images.address_location} resizeMode='contain' style={{ height: 20, width: 20 }} />
                        <Text style={styles.text_address}>Ha Noi</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
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
        width: '70%',
        justifyContent: 'flex-end',
        marginLeft: 15,
        paddingBottom: 5
        // backgroundColor: 'red',
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
    },
    address_button: {
        height: 20,
        width: '100%',
        flexDirection: 'row'
    },
    text_address: {
        color: 'green',
        fontSize: 16,
        fontWeight: '500'
    }
});

export default ProfileImageSection;
