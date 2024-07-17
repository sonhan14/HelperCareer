import { GeoPoint } from "@react-native-firebase/firestore"

// export interface TaskType {
//     id: string,
//     task_name: string,
//     task_des: string,
//     start_date: string,
//     end_date: string,
//     status: string,
//     latitude: number,
//     longitude: number,
// }

export type Task = {
    id: string,
    task_name: string,
    task_description: string,
    user_id?: string,
    location: GeoPoint,
    status: string,
    start_date: string,
    end_date: string,
}