export interface TaskType {
    id: string,
    task_name: string,
    task_des: string,
    start_date: Date,
    end_date: Date,
    status: string,
    latitude?: number,
    longitude?: number,
}