import { useEffect } from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SessionProvider, useSession } from "@/context/session";

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { isSignedIn, onboarded, loading } = useSession();

  useEffect(() => {
    if (!loading) SplashScreen.hideAsync();
  }, [loading]);

  if (loading) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!isSignedIn}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>

      <Stack.Protected guard={isSignedIn && onboarded === false}>
        <Stack.Screen name="(onboarding)" />
      </Stack.Protected>

      <Stack.Protected guard={isSignedIn && onboarded === true}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>
    </Stack>
  );
}
export default function RootLayout() {
  return (
    <SessionProvider>
      <RootNavigator />
    </SessionProvider>
  );
}