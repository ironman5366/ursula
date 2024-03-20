import { MoveRight } from "@tamagui/lucide-icons";
import { Link } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native";
import { Button, Text, XStack, YStack } from "tamagui";
import DismissKeyboardContainer from "../../components/containers/DismissKeyboardContainer.tsx";
import { FloatingActionBar } from "../../components/containers/TabBar.tsx";

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
              color="$claret"
            >
              There's nothing like a good book. Welcome to Ursula.
            </Text>
          </YStack>
        </SafeAreaView>
        <FloatingActionBar>
          <Link href="/(onboard)/login" asChild>
            <Button
              width={300}
              unstyled
              alignSelf="center"
              height={50}
              px={10}
              fontWeight="bold"
              color="white"
              href="/(onboard)/signup"
              flexDirection="row"
              alignItems="center"
              alignContent="space-between"
              justifyContent="space-between"
              iconAfter={<MoveRight size="$1" />}
            >
              Get Started
            </Button>
          </Link>
        </FloatingActionBar>
      </YStack>
    </DismissKeyboardContainer>
  );
}
