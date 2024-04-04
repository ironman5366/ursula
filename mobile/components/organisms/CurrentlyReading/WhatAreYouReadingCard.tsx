import React, { useState } from "react";
import { Card } from "tamagui";
import { StyledText } from "../../atoms/StyledText.tsx";
import BannerCard from "./BannerCard.tsx";
import { Pressable } from "react-native";
import AddBookSheet from "./AddBookSheet.tsx";

export default function WhatAreYouReadingCard() {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState(0);

  return (
    <>
      <Pressable onPress={() => setOpen(true)}>
        <BannerCard backgroundColor={"$lightGray"}>
          <Card.Header>
            <StyledText>What are you reading?</StyledText>
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
