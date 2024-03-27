import { MoveRight } from "@tamagui/lucide-icons";
import { Link } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native";
import { Button, Image, Text, XStack, YStack } from "tamagui";
import DismissKeyboardContainer from "../../components/containers/DismissKeyboardContainer.tsx";
import { FloatingActionBar } from "../../components/containers/TabBar.tsx";

export default function Onboard() {
  return (
    <DismissKeyboardContainer>
      <YStack fullscreen display="flex" flex={1}>
        <SafeAreaView style={{ flex: 1 }}>
          <YStack pb="$10" pt="$5" alignItems="center" flexGrow={1}>
            <TextLogo />
            <Image
              source={require("../../assets/images/reading.gif")}
              height={300}
              width={300}
              mt="auto"
            />
            <YStack maxWidth="85%" mt="auto" mb="$7">
              <Text textAlign="left" fontSize="$9">
                There's nothing like a{" "}
              </Text>
              <XStack backgroundColor="black" px="$2" mr="auto" gap="$3">
                <Text fontWeight="700" color="white" fontSize="$9">
                  good book
                </Text>
              </XStack>
              <Text mt="$3" textAlign="left" fontSize="$5">
                Ursula is a platform for book lovers to rank, share, and
                discover new books.
              </Text>
            </YStack>
          </YStack>
        </SafeAreaView>
        <FloatingActionBar>
          <Link href="/(onboard)/login" asChild>
            <Button
              unstyled
              alignSelf="center"
              px={10}
              fontWeight="bold"
              flexGrow={1}
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
function TextLogo() {
  return <Text fontSize="$8">Ursula</Text>;
}
