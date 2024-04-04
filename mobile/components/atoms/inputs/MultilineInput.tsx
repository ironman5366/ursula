import React, { ComponentProps } from "react";
import StyledInput from "../StyledInput.tsx";

export default function MultilineInput(
  props: ComponentProps<typeof StyledInput>
) {
  return (
    <StyledInput
      style={{
        minWidth: "80%",
      }}
      multiline={true}
      {...props}
    />
  );
}
