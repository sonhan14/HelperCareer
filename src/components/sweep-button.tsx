import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface SweepButtonProps {
    onPress: () => void;
    iconName: string;
    label: string;
}

const SweepButton: React.FC<SweepButtonProps> = ({ onPress, iconName, label }) => {
    return (
        <TouchableOpacity style={styles.manage_container} onPress={onPress}>
            <View style={styles.manage_title}>
                <Icon name={iconName} size={20} color={'black'} style={{ marginRight: 10 }} />
                <Text style={styles.text_15}>{label}</Text>
            </View>
            <View>
                <Icon name="angle-right" size={30} color={'black'} />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    manage_container: {
        width: '100%',
        height: 50,
        borderRadius: 10,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        borderWidth: 0.08
    },
    manage_title: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '40%'
    },
    text_15: {
        color: 'black',
        fontWeight: '400',
        fontSize: 15
    }
});

export default SweepButton;
