import { Stack } from "expo-router";
import { GenrePickerProvider } from "@/components/genres/GenrePickerProvider";

export default function OnboardingLayout() {
  return (
    <GenrePickerProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </GenrePickerProvider>
  );
}