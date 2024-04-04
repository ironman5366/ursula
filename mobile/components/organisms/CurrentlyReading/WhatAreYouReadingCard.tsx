import React from "react";
import { Card } from "tamagui";
import { StyledText } from "../../atoms/StyledText.tsx";
import BannerCard from "./BannerCard.tsx";
import { Pressable } from "react-native";

export default function WhatAreYouReadingCard() {
  return (
    <Pressable>
      <BannerCard backgroundColor={"$lightGray"}>
        <Card.Header>
          <StyledText>What are you reading?</StyledText>
        </Card.Header>
      </BannerCard>
    </Pressable>
  );
}
