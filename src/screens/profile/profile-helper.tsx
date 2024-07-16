import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

import storage from '@react-native-firebase/storage';
import { useSelector } from 'react-redux';
import { selectUserData } from '../../redux/user/userSlice';
import { images } from '../../images';
import { iUser } from '../../../types/userType';



interface ImageProps {
    setLoading: React.Dispatch<React.SetStateAction<{
        avatarLoading: boolean;
        coverLoading: boolean;
    }>>,
    setImage: React.Dispatch<React.SetStateAction<{
        avatar: any;
        cover: any;
    }>>,
    userData: iUser
}

export const getImgae = async ({ setLoading, setImage, userData }: ImageProps) => {

    setLoading((prev: any) => ({
        ...prev, avatarLoading: true
    }))

    setLoading((prev: any) => ({
        ...prev, coverLoading: true
    }))
    const avatarRef = storage().ref(`users/${userData?.id}/avatar.jpg`);
    try {
        const avatarDownloadUrl = await avatarRef.getDownloadURL();
        setImage(prev => ({
            ...prev, avatar: avatarDownloadUrl
        }));

    } catch (error) {
        setImage(prev => ({
            ...prev, avatar: images.avartar_pic
        }));
    }

    const coverRef = storage().ref(`users/${userData?.id}/cover.jpg`);
    try {
        const coverDownloadUrl = await coverRef.getDownloadURL();
        setImage(prev => ({
            ...prev, cover: coverDownloadUrl
        }));


    } catch (error) {
        setImage(prev => ({
            ...prev, cover: images.background_pic
        }));
    }
    setLoading(prev => ({
        ...prev, coverLoading: false
    }))
    setLoading(prev => ({
        ...prev, avatarLoading: false
    }))
}

