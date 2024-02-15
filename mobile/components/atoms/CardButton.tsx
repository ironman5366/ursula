import React, { ComponentProps } from "react";
import StyledButton from "../organisms/StyledButton.tsx";

export default function CardButton(props: ComponentProps<typeof StyledButton>) {
  return (
    <StyledButton
      {...props}
      style={{
        flex: 1,
        margin: 10,
        justifyContent: "center",
        alignItems: "center",
      }}
    />
  );
}
