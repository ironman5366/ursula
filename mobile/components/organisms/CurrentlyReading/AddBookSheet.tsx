import React, { ComponentProps } from "react";
import StyledSheet from "../StyledSheet.tsx";
import { StyledText } from "../../atoms/StyledText.tsx";

export default function AddBookSheet(
  props: Omit<ComponentProps<typeof StyledSheet>, "children">
) {
  return (
    <StyledSheet {...props}>
      <StyledText>TODO: Implement the rest of the card</StyledText>
    </StyledSheet>
  );
}
