import React, { useState } from "react";
import { Card, XStack } from "tamagui";
import { StyledText } from "../../atoms/StyledText.tsx";
import BannerCard from "./BannerCard.tsx";
import { Pressable } from "react-native";
import AddBookSheet from "./AddBookSheet";
import { Pencil, SquarePen } from "@tamagui/lucide-icons";

export default function WhatAreYouReadingCard() {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState(0);

  return (
    <>
      <Pressable onPress={() => setOpen(true)}>
        <BannerCard backgroundColor={"$lightGray"}>
          <Card.Header>
            <XStack>
              <StyledText>What are you reading?</StyledText>
              <SquarePen />
            </XStack>
          </Card.Header>
        </BannerCard>
      </Pressable>
      <AddBookSheet
        open={open}
        onOpenChange={setOpen}
        position={position}
        onPositionChange={setPosition}
      />
    </>
  );
}
