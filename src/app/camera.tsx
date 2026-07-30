import {
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { useCallback, useRef, useState } from "react";
import {
  Alert,
  Button,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { estimateFoodVolume, VolumeEstimateResponse } from "@/services/volumeEstimation";

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null);
  const [capturedUri, setCapturedUri] = useState<string | null>(null);
  const [facing, setFacing] = useState<CameraType>("back");
  const [isCapturing, setIsCapturing] = useState(false);
  const [result, setResult] = useState<VolumeEstimateResponse | null>(null);

  const takePicture = useCallback(async () => {
    if (isCapturing) return;
    setIsCapturing(true);
    try {
      const photo = await ref.current?.takePictureAsync({
        skipProcessing: true,
        quality: 0.92, // preserve EXIF focal length accuracy
        exif: true,
      });
      if (photo?.uri) setCapturedUri(photo.uri);
    } finally {
      setIsCapturing(false);
    }
  }, [isCapturing]);

  const pickFromLibrary = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 0.92,
      exif: true,
    });
    if (!result.canceled && result.assets.length > 0) {
      setCapturedUri(result.assets[0].uri);
    }
  }, []);

  const handleVolumeEstimation = async () => {
    if (!capturedUri) return;

    setResult(null);

    const response = await estimateFoodVolume(capturedUri);

    if (!response.success) {
      Alert.alert("Volume estimation failed", response.error);
      return;
    }

    setResult(response.data);
  }

  const retake = useCallback(() => setCapturedUri(null), []);

  const toggleFacing = useCallback(() => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  }, []);

  if (!permission) return null;

  if (!permission.granted) {
    return (
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>
            Camera access is needed to estimate food volume.
          </Text>
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
            facing={facing}
            responsiveOrientationWhenOrientationLocked
        />

        {!capturedUri && (
            <>
              <View style={styles.hintBanner} pointerEvents="none">
                <Text style={styles.hintText}>Hold ~30 cm above the plate</Text>
              </View>

              <View style={styles.shutterBar}>
                <Pressable onPress={pickFromLibrary} style={styles.sideButton} hitSlop={12}>
                  <Feather name="image" size={28} color="white" />
                </Pressable>

                <Pressable
                    onPress={takePicture}
                    disabled={isCapturing}
                    style={({ pressed }) => [
                      styles.shutterBtn,
                      pressed && styles.shutterBtnPressed,
                    ]}
                >
                  <View
                      style={[
                        styles.shutterBtnInner,
                        isCapturing && styles.shutterBtnCapturing,
                      ]}
                  />
                </Pressable>

                <Pressable onPress={toggleFacing} style={styles.sideButton} hitSlop={12}>
                  <FontAwesome6 name="rotate-left" size={28} color="white" />
                </Pressable>
              </View>
            </>
        )}

        {capturedUri && (
            <View style={StyleSheet.absoluteFill}>
              <Image
                  source={{ uri: capturedUri }}
                  style={StyleSheet.absoluteFill}
                  contentFit="cover"
                  transition={120}
              />

              <View style={styles.previewBar}>
                <Pressable onPress={retake} style={styles.previewAction}>
                  <AntDesign name="reload" size={22} color="white" />
                  <Text style={styles.previewActionLabel}>Retake</Text>
                </Pressable>

                <Pressable
                    onPress={handleVolumeEstimation}
                    style={[styles.previewAction, styles.previewActionPrimary]}
                >
                  <Feather name="zap" size={22} color="white" />
                  <Text style={styles.previewActionLabel}>Analyse</Text>
                </Pressable>
              </View>
            </View>
        )}
      </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000",
  },
  permissionContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 16,
  },
  permissionText: {
    textAlign: "center",
    fontSize: 16,
    color: "#333",
  },

  // Distance hint
  hintBanner: {
    position: "absolute",
    top: 60,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.45)",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  hintText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
    letterSpacing: 0.2,
  },

  // Shutter bar
  shutterBar: {
    position: "absolute",
    bottom: 48,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 40,
  },
  sideButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  shutterBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  shutterBtnPressed: {
    opacity: 0.6,
  },
  shutterBtnInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "white",
  },
  shutterBtnCapturing: {
    backgroundColor: "rgba(255,255,255,0.4)",
  },

  // Preview action bar
  previewBar: {
    position: "absolute",
    bottom: 48,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    paddingHorizontal: 32,
  },
  previewAction: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  previewActionPrimary: {
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  previewActionLabel: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
});