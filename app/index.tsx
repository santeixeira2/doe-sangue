import { Redirect } from 'expo-router';
import { useAuthStore } from '../src/store/authStore';

export default function Index() {
  const { isAuthenticated, isOnboarded, hasCompletedSetup } = useAuthStore();

  if (!isOnboarded) {
    return <Redirect href="/onboarding" />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  if (!hasCompletedSetup) {
    return <Redirect href="/blood-type-setup" />;
  }

  return <Redirect href="/(tabs)" />;
}
