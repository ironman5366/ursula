import React, { useState } from "react";
import { Card } from "tamagui";
import { StyledText } from "../../atoms/StyledText.tsx";
import BannerCard from "./BannerCard.tsx";
import { Pressable } from "react-native";
import StyledSheet from "../StyledSheet.tsx";

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
      <StyledSheet
        open={open}
        onOpenChange={setOpen}
        position={position}
        onPositionChange={setPosition}
      >
        <StyledText>TODO: Implement the rest of the card</StyledText>
      </StyledSheet>
    </>
  );
}
