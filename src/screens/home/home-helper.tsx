// File: helpers.ts
import firestore from '@react-native-firebase/firestore';
import { Location } from '../../../types/homeTypes';
import { Task } from '../../../types/taskType';
import { Applications } from '../../../types/applications.type';
import { iUser } from '../../../types/userType';
import { formatDate } from '../../constants/formatDate';
import messaging from '@react-native-firebase/messaging';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigations/navigation';
import { useStreamVideoClient } from '@stream-io/video-react-native-sdk';
type HomeScreenRouteProp = StackNavigationProp<RootStackParamList>;

export const fetchUserLocations = (userID: string, setGeoJsonData: any, setTaskGeoJsonData: any) => {
    const unsubscribeUsers = firestore()
        .collection('users')
        .where('role', '==', 'employee')
        .onSnapshot(async (querySnapshot) => {
            const locations: Location[] = [];

            querySnapshot.forEach(doc => {
                const data = doc.data();

                if (data.location) {
                    locations.push({
                        latitude: data.location.latitude,
                        longitude: data.location.longitude,
                        id: doc.id,
                        name: data.last_name + ' ' + data.first_name,
                        avatar: data.avatar
                    });
                }
            });

            const geoJson = convertToGeoJson(locations);

            setGeoJsonData(geoJson);
        }, (error) => {
            console.error('Error fetching user locations from Firestore: ', error);
        });

    const unsubscribeTasks = firestore()
        .collection('tasks')
        .where('user_id', '==', userID)
        .onSnapshot(async (taskQuerySnapshot) => {
            const taskLocations: Task[] = [];

            taskQuerySnapshot.forEach(doc => {
                const data = doc.data();

                if (data.location && data.location.latitude !== undefined && data.location.longitude !== undefined && data.status === 'process') {
                    taskLocations.push({
                        location: data.location,
                        id: doc.id,
                        task_name: data.task_name,
                        task_description: data.task_description,
                        start_date: formatDate(data.start_date),
                        end_date: formatDate(data.end_date),
                        status: data.status,
                        quantity: data.quantity.toString(),
                        price: data.price.toString()
                    });
                }
            });

            const taskGeoJson = convertToTaskGeoJson(taskLocations);
            setTaskGeoJsonData(taskGeoJson);
        }, (error) => {
            console.error('Error fetching task locations from Firestore: ', error);
        });

    return () => {
        unsubscribeUsers();
        unsubscribeTasks();
    };
};

export const convertToGeoJson = (locations: Location[]): GeoJSON.FeatureCollection<GeoJSON.Point> => {
    const features: GeoJSON.Feature<GeoJSON.Point>[] = locations.map(location => ({
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [location.longitude, location.latitude]
        },
        properties: {
            title: location.name,
            userId: location.id,
            avatar: location.avatar // Add user ID
        }
    }));

    return {
        type: 'FeatureCollection',
        features: features
    };
};

export const convertToTaskGeoJson = (locations: Task[]): GeoJSON.FeatureCollection<GeoJSON.Point> => {
    const features: GeoJSON.Feature<GeoJSON.Point>[] = locations.map(location => ({
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [location.location.longitude, location.location.latitude] as [number, number]
        },
        properties: {
            task_name: location.task_name,
            id: location.id, // Add user ID
            task_description: location.task_description,
            start_date: location.start_date,
            end_date: location.end_date,
            status: location.status,
            price: location.price,
            quantity: location.quantity,
        }
    }));

    return {
        type: 'FeatureCollection',
        features: features
    };
};

export const fetchApplication = (taskId: string, setApplication: React.Dispatch<React.SetStateAction<Applications[] | undefined>>) => {

    const unsubscribeApplication = firestore()
        .collection('applications')
        .where('task_id', '==', taskId)
        .onSnapshot(async (querySnapshot) => {
            const application: Applications[] = [];
            const applicationPromises: Promise<void>[] = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const applicationPromise = new Promise<void>((resolve, reject) => {
                    firestore()
                        .collection('users')
                        .doc(data.user_id)
                        .onSnapshot((userSnapshot) => {
                            const userData = userSnapshot.data();
                            if (userData) {
                                application.push({
                                    id: doc.id,
                                    application_date: new Date(data.application_date.seconds * 1000 + data.application_date.nanoseconds / 1000000),
                                    first_name: userData.first_name,
                                    last_name: userData.last_name,
                                    rating: data.rating,
                                    status: data.status,
                                    task_id: data.task_id,
                                    user_id: data.user_id,
                                    avatar: userData.avatar,
                                    fcmToken: userData.fcmToken
                                });
                            }
                            resolve();
                        }, reject);
                });

                applicationPromises.push(applicationPromise);
            });

            await Promise.all(applicationPromises);

            setApplication(application);
        }, (error) => {
            console.error('Error fetching user locations from Firestore: ', error);
        });

    return () => {
        unsubscribeApplication();
    };
};


export const hanleAccepted = (item: Applications) => {
    const { id, ...itemWithoutId } = item;
    firestore().collection('applications').doc(item.id).set({
        ...itemWithoutId,
        status: 'accepted'
    })
}

export const hanleRejected = (item: Applications) => {
    const { id, ...itemWithoutId } = item;
    firestore().collection('applications').doc(item.id).set({
        ...itemWithoutId,
        status: 'rejected'
    })
}

export const fetchEmployee = (setEmployeeList: any) => {
    const unsubscribeEmployee = firestore().collection('users')
        .where('role', '==', 'employee')
        .onSnapshot(async (querySnapshot) => {
            const employeeList: iUser[] = [];
            querySnapshot.forEach(doc => {
                const data = doc.data()
                if (data) {
                    const formattedUserData: iUser = {
                        id: doc.id,
                        birthday: formatDate(data.birthday),
                        first_name: data.first_name,
                        last_name: data.last_name,
                        gender: data.gender,
                        introduction: "Helo my name is " + data.first_name,
                        phone: data.phone,
                        rating: data.rating,
                        role: data.role,
                        email: data.email,
                        fcmToken: data.fcmToken,
                        avatar: data.avatar,
                        cover: data.cover,
                        longitude: data?.location.longitude,
                        latitude: data?.location.latitude
                    };
                    employeeList.push(formattedUserData)
                }
            })
            setEmployeeList(employeeList)
        })
    return () => {
        unsubscribeEmployee();
    };
}

export const checkMessage = async (navigation: HomeScreenRouteProp, setLoading: React.Dispatch<React.SetStateAction<boolean>>, client: any, userData: iUser) => {
    setLoading(false)
    const message = await messaging().getInitialNotification();


    if (message && message.data) {
        const userId = message.data.senderId ? String(message.data.senderId) : undefined;
        const chatId = message.data.chatboxId ? String(message.data.chatboxId) : undefined;
        const callId = message.data.callId ? String(message.data.callId) : undefined;

        if (userId && chatId) {
            const snapshot = await firestore().collection('users').doc(userId).onSnapshot(async (querySnapshot) => {
                const doc = querySnapshot.data();
                if (doc) {
                    const formattedUserData: iUser = {
                        id: userId,
                        birthday: formatDate(doc?.birthday),
                        first_name: doc?.first_name,
                        last_name: doc?.last_name,
                        gender: doc?.gender,
                        introduction: doc?.introduction,
                        phone: doc?.phone,
                        rating: doc?.rating,
                        email: doc?.email,
                        fcmToken: doc?.fcmToken,
                        avatar: doc?.avatar,
                        cover: doc?.cover,
                        longitude: doc?.location.longitude,
                        latitude: doc?.location.latitude
                    };
                    setLoading(true)
                    navigation.navigate('ChatBox', { receiver: formattedUserData, chatId: chatId })
                }
            }, (error) => {
                console.error('Error fetching user details from Firestore: ', error);
            })
            return () => {
                snapshot();
            };
        }
        if (callId) {
            const newCall = client.call('default', callId);
            try {
                setLoading(true)
                await newCall.join()
            } catch (error) {
                console.error("Error creating or joining the call", error);
            }
            navigation.navigate('CallScreen', { receiverId: userData.id, receiverName: userData.last_name + ' ' + userData.first_name, call: newCall })
        }
    }
    setLoading(true)
}

// export const checkCallMessage = async (setCall: any, setLoading: React.Dispatch<React.SetStateAction<boolean>>, client: any) => {
//     setLoading(false)

//     const message = await messaging().getInitialNotification();

//     if (message && message.data) {
//         const callId = message.data.userId ? String(message.data.callId) : undefined;


//         if (callId && client) {
//             const newCall = client.call('default', callId);
//             try {
//                 await newCall.getOrCreate({
//                     ring: true,
//                 });
//                 setCall(newCall);
//             } catch (error) {
//                 console.error("Error creating or joining the call", error);
//             }
//         }
//         navigation.navigate('CallScreen', { receiverId: userData.id, receiverName: userData.last_name + ' ' + userData.first_name, call: call })
//     }
//     setLoading(true)
// }