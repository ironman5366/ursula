import React, { forwardRef, ComponentProps } from "react";
import { Button } from "tamagui";

type Props = Pick<
  ComponentProps<typeof Button>,
  "iconAfter" | "onPress" | "children"
>;

function FloatingButton({ iconAfter, onPress, children }: Props, ref) {
  return (
    <Button
      ref={ref}
      width={300}
      unstyled
      alignSelf="center"
      height={50}
      px={10}
      fontWeight="bold"
      color="white"
      flexDirection="row"
      alignItems="center"
      alignContent="space-between"
      justifyContent="space-between"
      iconAfter={iconAfter}
      onPress={onPress}
    >
      {children}
    </Button>
  );
}

export default forwardRef(FloatingButton);
