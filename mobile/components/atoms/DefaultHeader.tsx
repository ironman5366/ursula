import { SafeAreaView } from "react-native";
import { Text, XStack } from "tamagui";
import SettingsButton from "./SettingsButton.tsx";

export function DefaultHeader() {
  return (
    <SafeAreaView>
      <XStack  height="$3" px="$3" justifyContent="space-between">
        <Text fontSize="$8">Ursula</Text>
        <SettingsButton />
      </XStack>
    </SafeAreaView>
  );
}
