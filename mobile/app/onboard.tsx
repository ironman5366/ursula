import { MoveRight } from "@tamagui/lucide-icons";
import React from "react";
import { SafeAreaView } from "react-native";
import { YStack, Button, Text } from "tamagui";
import DismissKeyboardContainer from "../components/containers/DismissKeyboardContainer.tsx";
import { FloatingActionBar } from "../components/containers/TabBar.tsx";
import { Link } from "expo-router";

export default function Onboard() {
  return (
    <DismissKeyboardContainer>
      <YStack fullscreen display="flex">
        <SafeAreaView>
          <YStack alignItems="center" py="$8">
            <Text fontSize="$8">Ursula</Text>
            <Text
              fontFamily="$body"
              mt="$18"
              px="$2"
              textAlign="center"
              fontSize="$11"
            >
              Maybe some cool tagline three lines
            </Text>
          </YStack>
        </SafeAreaView>
        <FloatingActionBar>
          <Link href="/signup">
            Get Started ss
            <MoveRight />
          </Link>
        </FloatingActionBar>
      </YStack>
    </DismissKeyboardContainer>
  );
}
