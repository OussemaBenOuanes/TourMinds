import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const AiChatIcon = ({ size = 24, color = '#000000' }) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <G clipPath="url(#clip0_4418_4514)">
        <Path
          opacity="0.4"
          d="M18.4698 16.83L18.8598 19.99C18.9598 20.82 18.0698 21.4 17.3598 20.97L13.1698 18.48C12.7098 18.48 12.2599 18.45 11.8199 18.39C12.5599 17.52 12.9998 16.42 12.9998 15.23C12.9998 12.39 10.5398 10.09 7.49985 10.09C6.33985 10.09 5.26985 10.42 4.37985 11C4.34985 10.75 4.33984 10.5 4.33984 10.24C4.33984 5.68999 8.28985 2 13.1698 2C18.0498 2 21.9998 5.68999 21.9998 10.24C21.9998 12.94 20.6098 15.33 18.4698 16.83Z"
          fill={color}
        />
        <Path
          d="M13 15.2298C13 16.4198 12.56 17.5198 11.82 18.3898C10.83 19.5898 9.26 20.3598 7.5 20.3598L4.89 21.9098C4.45 22.1798 3.89 21.8098 3.95 21.2998L4.2 19.3298C2.86 18.3998 2 16.9098 2 15.2298C2 13.4698 2.94 11.9198 4.38 10.9998C5.27 10.4198 6.34 10.0898 7.5 10.0898C10.54 10.0898 13 12.3898 13 15.2298Z"
          fill={color}
        />
      </G>
      <Defs>
        <ClipPath id="clip0_4418_4514">
          <Rect width="24" height="24" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

const LiveGuideIcon = ({ size = 24, color = "#000000" }) => {
  return (
    <Svg width={size} height={size} viewBox={`0 0 24 24`} fill="none">
      <G clipPath="url(#clip0_4418_3389)">
        <Path d="M17 2C20 2 22 4 22 7V9" stroke={color} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M2 9V7C2 4 4 2 7 2H12.77" stroke={color} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M22.0002 15V17C22.0002 20 20.0002 22 17.0002 22H11.4702" stroke={color} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M2 15V17C2 20 4 22 7 22" stroke={color} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M6.7002 9.25977L12.0002 12.3298L17.2602 9.27979" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M12 17.7703V12.3203" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M10.7602 6.29055L7.56023 8.07058C6.84023 8.47058 6.24023 9.48057 6.24023 10.3106V13.7006C6.24023 14.5306 6.83023 15.5406 7.56023 15.9406L10.7602 17.7205C11.4402 18.1005 12.5602 18.1005 13.2502 17.7205L16.4502 15.9406C17.1702 15.5406 17.7702 14.5306 17.7702 13.7006V10.3106C17.7702 9.48057 17.1802 8.47058 16.4502 8.07058L13.2502 6.29055C12.5602 5.90055 11.4402 5.90055 10.7602 6.29055Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </G>
      <Defs>
        <ClipPath id="clip0_4418_3389">
          <Rect width="24" height="24" fill="white"/>
        </ClipPath>
      </Defs>
    </Svg>
  );
};

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="ai-chat"
        options={{
          title: 'AI Chat',
          tabBarIcon: ({ color, size }) => <AiChatIcon size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="live-guide"
        options={{
          title: 'Live Guide',
          tabBarIcon: ({ color, size }) => <LiveGuideIcon size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
