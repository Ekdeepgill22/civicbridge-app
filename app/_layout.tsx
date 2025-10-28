import { AuthProvider } from "@/contexts/AuthContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false}}>
        <Stack.Screen name="(auth)/login" options={{ headerShown: false}} />
        <Stack.Screen name="(auth)/signup" options={{ headerShown: false}} />
        <Stack.Screen name="(screens)/home" options={{ headerShown: false}} />
      </Stack>
    </AuthProvider>
  );
}
