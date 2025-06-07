import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
    boxShadow: Platform.OS === 'web'
      ? '0px 4px 16px rgba(0,0,0,0.15)'
      : undefined,
    // Remove deprecated shadow* props for web
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 8,
      },
    }),
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
  statusIndicator: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    zIndex: 10,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  recordingButton: {
    backgroundColor: '#F44336',
  },
});
