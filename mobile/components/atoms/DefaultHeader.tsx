import { SafeAreaView } from "react-native";
import { XStack, Text } from "tamagui";

export function DefaultHeader() {
  return (
    <SafeAreaView>
      <XStack height="$3" px="$3" justifyContent="space-between">
        <Text fontSize="$8">Ursula</Text>
      </XStack>
    </SafeAreaView>
  );
}
