
import firestore, { GeoPoint } from '@react-native-firebase/firestore';
import { Task, TaskType } from '../../../types/taskType';



export const fetchTasks = (currentUser: any, setTasksList: any, setTaskPercent: any) => {
    const unsubscribeTasks = firestore()
        .collection('tasks')
        .where('user_id', '==', currentUser?.uid)
        .onSnapshot(async (taskQuerySnapshot) => {
            const tasksList: TaskType[] = [];

            taskQuerySnapshot.forEach(doc => {
                const data = doc.data();
                if (data) {
                    tasksList.push({
                        id: doc.id,
                        task_name: data.task_name,
                        task_des: data.task_description,
                        start_date: new Date(data.start_date.seconds * 1000 + data.start_date.nanoseconds / 1000000),
                        end_date: new Date(data.end_date.seconds * 1000 + data.end_date.nanoseconds / 1000000),
                        status: data.status,
                        longitude: data.location._longitude,
                        latitude: data.location._latitude
                    });
                }
            });
            setTasksList(tasksList);
            setTaskPercent((prev: any) => ({ ...prev, tasks: tasksList.length, tasksDone: tasksList.length }))
        }, (error) => {
            console.error('Error fetching task locations from Firestore: ', error);
        });
    return () => {
        unsubscribeTasks();
    };
}

export const fetchTaskDetail = (taskId: any, setTaskDetail: any,) => {
    const unsubscribeTasks = firestore()
        .collection('tasks')
        .doc(taskId)
        .onSnapshot(async (taskQuerySnapshot) => {
            const data = taskQuerySnapshot.data()
            if (data) {
                const taskDetail: TaskType = {
                    id: taskQuerySnapshot.id,
                    task_name: data.task_name,
                    task_des: data.task_description,
                    start_date: new Date(data.start_date.seconds * 1000 + data.start_date.nanoseconds / 1000000),
                    end_date: new Date(data.end_date.seconds * 1000 + data.end_date.nanoseconds / 1000000),
                    status: data.status,
                    longitude: data.location._longitude,
                    latitude: data.location._latitude
                }
                setTaskDetail(taskDetail)
            }

        }, (error) => {
            console.error('Error fetching task details from Firestore: ', error);
        });
    return () => {
        unsubscribeTasks();
    };
}

export const AddNew = (selectedLocation: any, taskItem: Task, user_id: any, handleBack: () => void, taskId: string | null, handleLoading: () => void) => {
    handleLoading()
    if (selectedLocation && taskId === null) {

        firestore()
            .collection('tasks')
            .add({
                task_name: taskItem.task_name,
                task_description: taskItem.task_description,
                user_id: user_id,
                location: new GeoPoint(selectedLocation.center[1], selectedLocation.center[0]),
                status: 'process',
                start_date: taskItem.start_date,
                end_date: taskItem.end_date
            })
            .then(() => {
                handleBack()
                handleLoading()
            })
    } else if (selectedLocation && taskId) {
        firestore()
            .collection('tasks')
            .doc(taskId)
            .set({
                task_name: taskItem.task_name,
                task_description: taskItem.task_description,
                user_id: user_id,
                location: new GeoPoint(selectedLocation.center[1], selectedLocation.center[0]),
                status: 'process',
                start_date: taskItem.start_date,
                end_date: taskItem.end_date
            })
            .then(() => {
                handleLoading()
                handleBack()
            })
    }
}

export const handleDeleteTask = async (taskId: string, handleBack: () => void) => {
    try {
        await firestore()
            .collection('tasks')
            .doc(taskId)
            .delete();
        handleBack()
    } catch (error) {
        console.error('Error deleting document: ', error);
    }
}

export const handleFinishTask = async (handleBack: () => void, TaskDetail: TaskType | null, user_id: any) => {
    if (TaskDetail) {
        try {
            await firestore()
                .collection('tasks')
                .doc(TaskDetail.id)
                .set({
                    task_name: TaskDetail.task_name,
                    task_description: TaskDetail.task_des,
                    user_id: user_id,
                    location: new GeoPoint(TaskDetail.latitude, TaskDetail.longitude),
                    status: 'finished',
                    start_date: TaskDetail.start_date,
                    end_date: TaskDetail.end_date
                })
            handleBack()
        } catch (error) {
            console.error('Error update document: ', error);
        }
    }

}