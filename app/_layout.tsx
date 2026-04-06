import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ApolloProvider } from '@apollo/client';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { apolloClient } from '../src/services/apolloClient';
import "../global.css";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ApolloProvider client={apolloClient}>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
          <Stack.Screen name="blood-type-setup" />
          <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
          <Stack.Screen name="safety-check" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
          <Stack.Screen name="map-navigation" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="donor-id" options={{ presentation: 'fullScreenModal', animation: 'fade' }} />
          <Stack.Screen name="mission-complete" options={{ animation: 'fade' }} />
          <Stack.Screen name="notifications" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="request/[id]" options={{ animation: 'slide_from_right' }} />
        </Stack>
      </ApolloProvider>
    </GestureHandlerRootView>
  );
}
