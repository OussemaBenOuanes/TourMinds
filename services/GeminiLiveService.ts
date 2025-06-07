import { Platform } from 'react-native';

export interface GeminiLiveConfig {
  model: string;
  responseModalities: 'TEXT' | 'AUDIO';
  systemInstruction?: string;
  speechConfig?: {
    voiceConfig: {
      prebuiltVoiceConfig: {
        voiceName: string;
      };
    };
  };
}

export class GeminiLiveService {
  private ws: WebSocket | null = null;
  private apiKey: string;
  private isConnected = false;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  connect(config: GeminiLiveConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${this.apiKey}`;
        
        this.ws = new WebSocket(wsUrl);
        
        this.ws.onopen = () => {
          console.log('Gemini Live API connected');
          this.isConnected = true;
          
          // Send setup configuration
          const setupMessage = {
            setup: {
              model: config.model,
              generationConfig: {
                responseModalities: [config.responseModalities],
                speechConfig: config.speechConfig,
              },
              systemInstruction: config.systemInstruction ? {
                parts: [{ text: config.systemInstruction }]
              } : undefined,
            }
          };
          
          this.send(setupMessage);
          resolve();
        };
        
        this.ws.onerror = (error) => {
          console.error('Gemini Live API error:', error);
          reject(error);
        };
        
        this.ws.onclose = () => {
          console.log('Gemini Live API disconnected');
          this.isConnected = false;
        };
        
        this.ws.onmessage = (event) => {
          this.handleMessage(JSON.parse(event.data));
        };
        
      } catch (error) {
        reject(error);
      }
    });
  }

  private handleMessage(message: any) {
    console.log('Received message:', message);
    
    if (message.serverContent) {
      // Handle server responses
      this.onServerContent?.(message.serverContent);
    }
    
    if (message.setupComplete) {
      console.log('Setup complete');
      this.onSetupComplete?.();
    }
  }

  sendRealtimeInput(audioData: ArrayBuffer) {
    if (!this.isConnected || !this.ws) return;
    
    const message = {
      realtimeInput: {
        mediaChunks: [{
          mimeType: 'audio/pcm;rate=16000',
          data: this.arrayBufferToBase64(audioData)
        }]
      }
    };
    
    this.send(message);
  }

  sendClientContent(text: string) {
    if (!this.isConnected || !this.ws) return;
    
    const message = {
      clientContent: {
        turns: [{
          role: 'user',
          parts: [{ text }]
        }],
        turnComplete: true
      }
    };
    
    this.send(message);
  }

  private send(message: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.isConnected = false;
    }
  }

  // Event handlers (can be overridden)
  onServerContent?: (content: any) => void;
  onSetupComplete?: () => void;
  onAudioResponse?: (audioData: ArrayBuffer) => void;
}
