import Feather from '@expo/vector-icons/Feather';
import {CameraView, useCameraPermissions} from 'expo-camera';
import {useCallback, useRef, useState} from 'react';
import {Button, Pressable, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type CaptureStepProps = {
    onCancel: () => void;
    onCaptured: (uri: string) => void;
};

export function CaptureStep({onCancel, onCaptured}: CaptureStepProps) {
    const [permission, requestPermission] = useCameraPermissions();
    const ref = useRef<CameraView>(null);
    const insets = useSafeAreaInsets();
    const [flashOn, setFlashOn] = useState(false);
    const [isCapturing, setIsCapturing] = useState(false);

    const takePicture = useCallback(async () => {
        if (isCapturing) return;
        setIsCapturing(true);
        try {
            const photo = await ref.current?.takePictureAsync({
                quality: 0.92, // preserve EXIF focal length accuracy
                exif: true
            });
            if (photo?.uri) onCaptured(photo.uri);
        } finally {
            setIsCapturing(false);
        }
    }, [isCapturing, onCaptured]);

    if (!permission) return null;

    if (!permission.granted) {
        return (
            <View style={styles.permissionContainer}>
                <Text style={styles.permissionText}>Camera access is needed to log a meal.</Text>
                <Button onPress={requestPermission} title="Grant permission" />
            </View>
        );
    }

    return (
        <View style={styles.root}>
            <CameraView
                style={StyleSheet.absoluteFill}
                ref={ref}
                mode="picture"
                facing="back"
                flash={flashOn ? 'on' : 'off'}
                responsiveOrientationWhenOrientationLocked
            />

            <View style={[styles.topBar, {paddingTop: insets.top + 12}]}>
                <Pressable onPress={onCancel} style={styles.topBarChip} hitSlop={12}>
                    <Text style={styles.topBarLabel}>Cancel</Text>
                </Pressable>

                <Pressable onPress={() => setFlashOn((prev) => !prev)} style={[styles.topBarChip, styles.flashButton]} hitSlop={12}>
                    <Feather name="zap" size={16} color={flashOn ? '#FFD60A' : 'white'} />
                    <Text style={[styles.topBarLabel, flashOn && styles.flashLabelActive]}>Flash</Text>
                </Pressable>
            </View>

            <View style={styles.guideFrame} pointerEvents="none">
                <View style={[styles.corner, styles.cornerTopLeft]} />
                <View style={[styles.corner, styles.cornerTopRight]} />
                <View style={[styles.corner, styles.cornerBottomLeft]} />
                <View style={[styles.corner, styles.cornerBottomRight]} />
            </View>

            <View style={styles.shutterBar}>
                <Pressable
                    onPress={takePicture}
                    disabled={isCapturing}
                    style={({pressed}) => [styles.shutterBtn, pressed && styles.shutterBtnPressed]}
                >
                    <View style={[styles.shutterBtnInner, isCapturing && styles.shutterBtnCapturing]} />
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#000'
    },
    permissionContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        gap: 16
    },
    permissionText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#333'
    },

    topBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20
    },
    topBarLabel: {
        color: 'white',
        fontSize: 15,
        fontWeight: '600'
    },
    topBarChip: {
        backgroundColor: 'rgba(0,0,0,0.45)',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20
    },
    flashButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6
    },
    flashLabelActive: {
        color: '#FFD60A'
    },

    guideFrame: {
        position: 'absolute',
        top: '16%',
        left: '8%',
        right: '8%',
        bottom: '30%'
    },
    corner: {
        position: 'absolute',
        width: 28,
        height: 28,
        borderColor: 'rgba(255,255,255,0.85)'
    },
    cornerTopLeft: {
        top: 0,
        left: 0,
        borderTopWidth: 3,
        borderLeftWidth: 3,
        borderTopLeftRadius: 8
    },
    cornerTopRight: {
        top: 0,
        right: 0,
        borderTopWidth: 3,
        borderRightWidth: 3,
        borderTopRightRadius: 8
    },
    cornerBottomLeft: {
        bottom: 0,
        left: 0,
        borderBottomWidth: 3,
        borderLeftWidth: 3,
        borderBottomLeftRadius: 8
    },
    cornerBottomRight: {
        bottom: 0,
        right: 0,
        borderBottomWidth: 3,
        borderRightWidth: 3,
        borderBottomRightRadius: 8
    },

    shutterBar: {
        position: 'absolute',
        bottom: 48,
        left: 0,
        right: 0,
        alignItems: 'center'
    },
    shutterBtn: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 4,
        borderColor: 'white',
        alignItems: 'center',
        justifyContent: 'center'
    },
    shutterBtnPressed: {
        opacity: 0.6
    },
    shutterBtnInner: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'white'
    },
    shutterBtnCapturing: {
        backgroundColor: 'rgba(255,255,255,0.4)'
    }
});
