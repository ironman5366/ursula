import React, { ComponentProps, forwardRef } from "react";
import StyledButton from "../organisms/StyledButton.tsx";

function CardButton(props: ComponentProps<typeof StyledButton>, ref) {
  return (
    <StyledButton
      {...props}
      ref={ref}
      style={{
        flex: 1,
        margin: 10,
        justifyContent: "center",
        alignItems: "center",
      }}
    />
  );
}

export default forwardRef(CardButton);
