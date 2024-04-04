import React from "react";
import { StyledText } from "../../atoms/StyledText.tsx";

export default function Note({ note }: { note: string }) {
  return (
    <StyledText
      style={{
        margin: 8,
      }}
    >
      <StyledText style={{ fontWeight: "bold" }}>Note: </StyledText>
      <StyledText style={{ fontStyle: "italic" }}>{note}</StyledText>
    </StyledText>
  );
}
