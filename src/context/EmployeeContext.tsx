// src/contexts/EmployeeContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface EmployeeContextProps {
    isTask: number;
    setIsTask: React.Dispatch<React.SetStateAction<number>>;

}

interface EmployeeProviderProps {
    children: ReactNode;
}

const EmployeeContext = createContext<EmployeeContextProps | undefined>(undefined);

export const EmployeeProvider: React.FC<EmployeeProviderProps> = ({ children }) => {
    const [isTask, setIsTask] = useState<number>(0);

    return (
        <EmployeeContext.Provider value={{ isTask, setIsTask }}>
            {children}
        </EmployeeContext.Provider>
    );
};
export const useTask = (): EmployeeContextProps => {
    const context = useContext(EmployeeContext);
    if (!context) {
        throw new Error('useTask must be used within an EmployeeProvider');
    }
    return context;
};


