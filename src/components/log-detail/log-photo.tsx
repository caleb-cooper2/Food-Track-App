import {Image} from 'expo-image';
import {useState} from 'react';
import {StyleSheet, View} from 'react-native';

import {LogIcon} from '@/components/logs/log-icon';
import {useTheme} from '@/hooks/use-theme';
import {foodIconFor} from '@/utils/food-icon';

type LogPhotoProps = {
    log: Log;
};

const NO_PHOTO_ASPECT_RATIO = 4 / 3;

export function LogPhoto({ log }: LogPhotoProps) {
    const theme = useTheme();
    const [aspectRatio, setAspectRatio] = useState(3 / 4);

    if (log.imageUri) {
        return (
            <Image
                source={{ uri: log.imageUri }}
                style={[styles.photo, { aspectRatio, backgroundColor: theme.background }]}
                contentFit="contain"
                onLoad={(event) => setAspectRatio(event.source.width / event.source.height)}
            />
        );
    }

    // No captured photo found for log -> fall back to generated icon
    const { color } = foodIconFor(log.description);
    return (
        <View style={[styles.photo, styles.placeholder, { aspectRatio: NO_PHOTO_ASPECT_RATIO, backgroundColor: `${color}1A` }]}>
            <LogIcon description={log.description} size={64} />
        </View>
    );
}

const styles = StyleSheet.create({
    photo: {
        alignSelf: 'center',
        width: '100%',
        maxHeight: 420,
        borderRadius: 16
    },
    placeholder: {
        alignItems: 'center',
        justifyContent: 'center'
    }
});
