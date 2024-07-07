import { GeoPoint } from "@react-native-firebase/firestore"

export interface TaskType {
    id: string,
    task_name: string,
    task_des: string,
    start_date: Date,
    end_date: Date,
    status: string,
    latitude: number,
    longitude: number,
}

export type Task = {
    task_name: string,
    task_description: string,
    user_id?: string,
    location: GeoPoint,
    status: string,
    start_date: Date,
    end_date: Date,
}