
import firestore, { GeoPoint } from '@react-native-firebase/firestore';
import { Task } from '../../../types/taskType';
import { formatDate, parseDate } from '../../constants/formatDate';



export const fetchTasks = (userId: string, setTasksList: any, setTaskPercent: any, setTaskDone: any) => {
    const unsubscribeTasks = firestore()
        .collection('tasks')
        .where('user_id', '==', userId)
        .onSnapshot(async (taskQuerySnapshot) => {
            const tasksList: Task[] = [];

            taskQuerySnapshot.forEach(doc => {
                const data = doc.data();
                if (data) {
                    tasksList.push({
                        id: doc.id,
                        task_name: data.task_name,
                        task_description: data.task_description,
                        start_date: formatDate(data.start_date),
                        end_date: formatDate(data.end_date),
                        status: data.status,
                        location: data.location
                    });
                }
            });
            setTasksList(tasksList.filter((task: Task) => task.status === 'process'));
            setTaskPercent((prev: any) => ({ ...prev, tasks: tasksList.length, tasksDone: tasksList.filter((task: Task) => task.status === 'finished').length }))
            setTaskDone(tasksList.filter((task: Task) => task.status === 'finished'))
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
                const taskDetail: Task = {
                    id: taskQuerySnapshot.id,
                    task_name: data.task_name,
                    task_description: data.task_description,
                    start_date: formatDate(data.start_date),
                    end_date: formatDate(data.end_date),
                    status: data.status,
                    location: data.location
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
                start_date: parseDate(taskItem.start_date),
                end_date: parseDate(taskItem.end_date)
            })
            .then(() => {
                handleBack()
                handleLoading()
            })
    } else if (selectedLocation && taskId) {
        firestore()
            .collection('tasks')
            .doc(taskId)
            .update({
                task_name: taskItem.task_name,
                task_description: taskItem.task_description,
                user_id: user_id,
                location: new GeoPoint(selectedLocation.center[1], selectedLocation.center[0]),
                status: 'process',
                start_date: parseDate(taskItem.start_date),
                end_date: parseDate(taskItem.end_date)
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

export const handleFinishTask = async (handleBack: () => void, taskId: string) => {
    if (taskId) {
        try {
            await firestore()
                .collection('tasks')
                .doc(taskId)
                .update({
                    status: 'finished',
                })
            handleBack()
        } catch (error) {
            console.error('Error update document: ', error);
        }
    }

}