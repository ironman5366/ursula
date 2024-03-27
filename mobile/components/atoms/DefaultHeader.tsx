import { Platform, SafeAreaView } from "react-native";
import { Text, XStack, YStack } from "tamagui";
import SettingsButton from "./SettingsButton.tsx";
import { StyledView } from "../organisms/StyledView.tsx";

export function DefaultHeader() {
  return (
    <SafeAreaView>
      <YStack>
        {Platform.OS === "android" && (
          <StyledView
            style={{
              height: 20,
            }}
          />
        )}
        <XStack height="$3" px="$3" justifyContent="space-between">
          <Text fontSize="$8">Ursula</Text>
          <SettingsButton />
        </XStack>
      </YStack>
    </SafeAreaView>
  );
}
