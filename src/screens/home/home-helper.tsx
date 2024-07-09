// File: helpers.ts
import firestore from '@react-native-firebase/firestore';
import { Location } from '../../../types/homeTypes';
import { TaskType } from '../../../types/taskType';
import { Applications } from '../../../types/applications.type';


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
                        name: data.last_name + ' ' + data.first_name
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
            const taskLocations: TaskType[] = [];

            taskQuerySnapshot.forEach(doc => {
                const data = doc.data();

                if (data.location && data.location.latitude !== undefined && data.location.longitude !== undefined) {
                    taskLocations.push({
                        latitude: data.location.latitude,
                        longitude: data.location.longitude,
                        id: doc.id,
                        task_name: data.task_name,
                        task_des: data.task_description,
                        start_date: new Date(data.start_date.seconds * 1000 + data.start_date.nanoseconds / 1000000),
                        end_date: new Date(data.end_date.seconds * 1000 + data.end_date.nanoseconds / 1000000),
                        status: data.status
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
            userId: location.id, // Add user ID
        }
    }));

    return {
        type: 'FeatureCollection',
        features: features
    };
};

export const convertToTaskGeoJson = (locations: TaskType[]): GeoJSON.FeatureCollection<GeoJSON.Point> => {
    const features: GeoJSON.Feature<GeoJSON.Point>[] = locations.map(location => ({
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [location.longitude, location.latitude] as [number, number]
        },
        properties: {
            task_name: location.task_name,
            id: location.id, // Add user ID
            task_des: location.task_des,
            start_date: location.start_date,
            end_date: location.end_date,
            status: location.status,
        }
    }));

    return {
        type: 'FeatureCollection',
        features: features
    };
};

export const fetchApplication = (taskId: any, setApplication: any) => {
    const unsubscribeApplication = firestore()
        .collection('applications')
        .where('task_id', '==', taskId)
        .onSnapshot(async (querySnapshot) => {
            const application: Applications[] = [];

            querySnapshot.forEach(doc => {
                const data = doc.data();
                application.push({
                    id: doc.id,
                    application_date: new Date(data.application_date.seconds * 1000 + data.application_date.nanoseconds / 1000000),
                    first_name: data.first_name,
                    last_name: data.last_name,
                    rating: data.rating,
                    status: data.status,
                    task_id: data.task_id,
                    user_id: data.user_id
                })
                
            });
            setApplication(application)
        }, (error) => {
            console.error('Error fetching user locations from Firestore: ', error);
        });
        return () => {
            unsubscribeApplication();
        }; 
}

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
