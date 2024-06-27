import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, TouchableOpacityProps, ViewStyle } from 'react-native';


interface CustomButtonProps extends TouchableOpacityProps {
    title: string;
    loading?: boolean;
    disabledStyle?: ViewStyle;
}

export const CustomButton: React.FC<CustomButtonProps> = ({ title, loading, disabledStyle, style, ...props }) => {
    return (
        <TouchableOpacity
            style={[props.disabled ? disabledStyle : style]}
            {...props}
        >
            {!loading ? (
                <Text style={{color: 'white', fontSize: 20, fontWeight: '500'}}>{title}</Text>
            ) : (
                <ActivityIndicator size="small" color="#ffffff" />
            )}
        </TouchableOpacity>
    );
};
