// src/contexts/EmployeeContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface EmployeeContextProps {
    isEmployee: number;
    setIsEmployee: React.Dispatch<React.SetStateAction<number>>;
}

interface EmployeeProviderProps {
    children: ReactNode;
}

const EmployeeContext = createContext<EmployeeContextProps | undefined>(undefined);

export const EmployeeProvider: React.FC<EmployeeProviderProps> = ({ children }) => {
    const [isEmployee, setIsEmployee] = useState<number>(0);

    return (
        <EmployeeContext.Provider value={{ isEmployee, setIsEmployee }}>
            {children}
        </EmployeeContext.Provider>
    );
};

export const useEmployee = (): EmployeeContextProps => {
    const context = useContext(EmployeeContext);
    if (!context) {
        throw new Error('useEmployee must be used within an EmployeeProvider');
    }
    return context;
};
