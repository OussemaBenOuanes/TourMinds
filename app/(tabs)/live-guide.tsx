import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { Camera, CameraView } from 'expo-camera';
import Constants from 'expo-constants';
import { useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PinchGestureHandler, PinchGestureHandlerGestureEvent, State } from 'react-native-gesture-handler';
import { styles } from '../../constants/LiveGuideStyles';
import { GeminiLiveService } from '../../services/GeminiLiveService';

export default function LiveGuideScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [hasAudioPermission, setHasAudioPermission] = useState<boolean | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const [zoom, setZoom] = useState(0);
  const [cameraType, setCameraType] = useState<'back' | 'front'>('back');
  const [muted, setMuted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const lastZoom = useRef(0);
  
  // Gemini Live API
  const geminiService = useRef<GeminiLiveService | null>(null);
  const recordingRef = useRef<Audio.Recording | null>(null);

  useEffect(() => {
    initializePermissions();
    initializeGeminiService();
    
    return () => {
      cleanup();
    };
  }, []);

  const initializePermissions = async () => {
    // Camera permissions
    const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(cameraStatus === 'granted');
    
    // Audio permissions
    const { status: audioStatus } = await Audio.requestPermissionsAsync();
    setHasAudioPermission(audioStatus === 'granted');
    
    // Configure audio mode
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: false,
      playThroughEarpieceAndroid: false,
    });
  };

  const initializeGeminiService = async () => {
    try {
      const apiKey = Constants.expoConfig?.extra?.EXPO_PUBLIC_GEMINI_API_KEY || process.env.EXPO_PUBLIC_GEMINI_API_KEY;
      
      if (!apiKey) {
        Alert.alert('Error', 'Gemini API key not found');
        return;
      }

      geminiService.current = new GeminiLiveService(apiKey);
      
      // Set up event handlers
      geminiService.current.onServerContent = (content) => {
        console.log('Gemini response:', content);
        // Handle text or audio responses here
      };
      
      geminiService.current.onSetupComplete = () => {
        setIsConnected(true);
        console.log('Gemini Live API ready');
      };

      // Connect to Gemini Live API
      await geminiService.current.connect({
        model: 'models/gemini-2.0-flash-exp',
        responseModalities: 'AUDIO',
        systemInstruction: 'You are a helpful AI assistant providing live guidance through voice interactions. Be concise and helpful.',
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: 'Aoede'
            }
          }
        }
      });
      
    } catch (error) {
      console.error('Failed to initialize Gemini service:', error);
      Alert.alert('Error', 'Failed to connect to Gemini Live API');
    }
  };

  const startRecording = async () => {
    try {
      if (!hasAudioPermission) {
        Alert.alert('Permission required', 'Audio permission is required for voice interaction');
        return;
      }

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync({
        android: {
          extension: '.wav',
          outputFormat: Audio.AndroidOutputFormat.MPEG_4,
          audioEncoder: Audio.AndroidAudioEncoder.AAC,
          sampleRate: 16000,
          numberOfChannels: 1,
          bitRate: 128000,
        },
        ios: {
          extension: '.wav',
          outputFormat: Audio.IOSOutputFormat.LINEARPCM,
          audioQuality: Audio.IOSAudioQuality.HIGH,
          sampleRate: 16000,
          numberOfChannels: 1,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {
          mimeType: 'audio/wav',
          bitsPerSecond: 128000,
        },
      });

      await recording.startAsync();
      recordingRef.current = recording;
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = async () => {
    try {
      if (!recordingRef.current) return;

      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      
      if (uri && geminiService.current) {
        // Convert audio to PCM format and send to Gemini
        // Note: This is a simplified example. In production, you'd need proper audio conversion
        const response = await fetch(uri);
        const arrayBuffer = await response.arrayBuffer();
        geminiService.current.sendRealtimeInput(arrayBuffer);
      }
      
      recordingRef.current = null;
      setIsRecording(false);
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  };

  const cleanup = () => {
    if (recordingRef.current) {
      recordingRef.current.stopAndUnloadAsync();
    }
    if (geminiService.current) {
      geminiService.current.disconnect();
    }
  };

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
  const handleMute = () => {
    setMuted((m) => !m);
    if (muted && isRecording) {
      stopRecording();
    }
  };

  const handleVoiceInteraction = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  };

  if (hasPermission === null || hasAudioPermission === null) {
    return <View style={styles.container} />;
  }
  
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={{ color: '#fff' }}>No access to camera</Text>
      </View>
    );
  }

  if (hasAudioPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={{ color: '#fff' }}>No access to microphone</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Connection status indicator */}
      <View style={styles.statusIndicator}>
        <View style={[styles.statusDot, { backgroundColor: isConnected ? '#4CAF50' : '#F44336' }]} />
        <Text style={styles.statusText}>
          {isConnected ? 'Gemini Connected' : 'Connecting...'}
        </Text>
      </View>

      <View style={styles.cameraBox}>
        <PinchGestureHandler
          onGestureEvent={onPinchEvent}
          onHandlerStateChange={onPinchStateChange}
        >
          <View style={[StyleSheet.absoluteFill, { pointerEvents: 'box-none' }]}>
            <CameraView
              ref={cameraRef}
              style={StyleSheet.absoluteFill}
              facing={cameraType}
              zoom={zoom}
            />
          </View>
        </PinchGestureHandler>
      </View>

      {/* Control buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.circleButton} onPress={handleMute}>
          <MaterialIcons name={muted ? 'mic-off' : 'mic'} size={28} color="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.circleButton, isRecording && styles.recordingButton]} 
          onPress={handleVoiceInteraction}
        >
          <MaterialIcons 
            name={isRecording ? 'stop' : 'keyboard-voice'} 
            size={28} 
            color="#fff" 
          />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.circleButton} onPress={handleSwitchCamera}>
          <Ionicons name="camera-reverse" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}