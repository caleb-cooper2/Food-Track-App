import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {StyleSheet, View} from 'react-native';

import {foodIconFor} from '@/utils/food-icon';

type LogIconProps = {
    description: string;
    size?: number;
};

export function LogIcon({ description, size = 48 }: LogIconProps) {
    const { icon, color } = foodIconFor(description);

    return (
        <View style={[styles.root, { width: size, height: size, borderRadius: size * 0.28, backgroundColor: `${color}26` }]}>
            <MaterialCommunityIcons name={icon} size={size * 0.52} color={color} />
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        alignItems: 'center',
        justifyContent: 'center'
    }
});
