export interface FirestoreTimestamp {
    _seconds: number;
    _nanoseconds: number;
}

function convertFirestoreTimestampToDate(timestamp: FirestoreTimestamp): Date {
    return new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000);
}


export function formatDate(timestamp: FirestoreTimestamp): string {
    const date: Date = convertFirestoreTimestampToDate(timestamp);
    const day: string = String(date.getDate()).padStart(2, '0');
    const month: string = String(date.getMonth() + 1).padStart(2, '0');
    const year: number = date.getFullYear();

    return `${day}/${month}/${year}`;
}

export const convertStringToDate = (dateString: string): Date => {
    const [day, month, year] = dateString.split('/').map(part => parseInt(part, 10));
    // month - 1 because months are zero-indexed (0-11) in JavaScript Date object
    return new Date(year, month - 1, day);
};