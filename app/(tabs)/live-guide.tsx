import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Camera, CameraView } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PinchGestureHandler, PinchGestureHandlerGestureEvent, State } from 'react-native-gesture-handler';

export default function LiveGuideScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const [zoom, setZoom] = useState(0);
  const [cameraType, setCameraType] = useState<'back' | 'front'>('back');
  const [muted, setMuted] = useState(false);
  const [paused, setPaused] = useState(false);
  const lastZoom = useRef(0);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // Pinch gesture handler using react-native-gesture-handler
  const onPinchEvent = (event: PinchGestureHandlerGestureEvent) => {
    let newZoom = lastZoom.current * event.nativeEvent.scale;
    newZoom = Math.max(0, Math.min(1, newZoom));
    setZoom(newZoom);
  };

  const onPinchStateChange = (event: PinchGestureHandlerGestureEvent) => {
    if (event.nativeEvent.state === State.BEGAN) {
      lastZoom.current = zoom;
    }
  };

  // Camera switcher between front and back
  const handleSwitchCamera = () => {
    setCameraType((prev) => (prev === 'back' ? 'front' : 'back'));
  };

  // Mute and pause handlers (placeholders)
  const handleMute = () => setMuted((m) => !m);
  const handlePause = () => setPaused((p) => !p);

  if (hasPermission === null) {
    return <View style={styles.container} />;
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text>No access to camera</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.cameraBox}>
        <PinchGestureHandler
          onGestureEvent={onPinchEvent}
          onHandlerStateChange={onPinchStateChange}
        >
          <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
            <CameraView
              ref={cameraRef}
              style={StyleSheet.absoluteFill}
              facing={cameraType}
              zoom={zoom}
            />
          </View>
        </PinchGestureHandler>
      </View>
      {/* 3 circular buttons with icons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.circleButton} onPress={handleMute}>
          <MaterialIcons name={muted ? 'mic-off' : 'mic'} size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.circleButton} onPress={handlePause}>
          <MaterialIcons name={paused ? 'play-arrow' : 'pause'} size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.circleButton} onPress={handleSwitchCamera}>
          <Ionicons name="camera-reverse" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F2E2D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraBox: {
    // Make the rectangle smaller and responsive, especially on iOS
    width: '90%',
    aspectRatio: 3 / 4, // 3:4 portrait ratio
    maxHeight: Platform.OS === 'ios' ? 380 : 480,
    minHeight: 220,
    borderRadius: 32,
    backgroundColor: '#183C3A',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    marginTop: Platform.OS === 'ios' ? 32 : 40,
    marginBottom: Platform.OS === 'ios' ? 16 : 24,
    flexShrink: 0,
  },
  cameraContent: {
    width: 100,
    height: 100,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#0F2E2D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: Platform.OS === 'ios' ? 32 : 16,
    gap: 32,
  },
  circleButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#222a',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
    elevation: 2,
  },
  switchText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
