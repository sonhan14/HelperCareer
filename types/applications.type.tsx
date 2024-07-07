export interface Applications {
    id: string,
    application_date: Date,
    first_name :string,
    last_name: string,
    rating: string,
    status: string,
    task_id: string,
    user_id: string
}

export interface EmployeeListProps {
    showEmployee: boolean;
    employeeList: Applications[],
    handleAction: (item: Applications, actionType: 'accept' | 'reject') => void;
}