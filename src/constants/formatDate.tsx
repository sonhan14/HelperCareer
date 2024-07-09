export const formatDate = (date: Date): string => {

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
};

export const convertStringToDate = (dateString: string): Date => {
    const [day, month, year] = dateString.split('/').map(part => parseInt(part, 10));
    // month - 1 because months are zero-indexed (0-11) in JavaScript Date object
    return new Date(year, month - 1, day);
};