import React, { ComponentProps } from "react";
import { Button } from "tamagui";

type Props = Pick<
  ComponentProps<typeof Button>,
  "iconAfter" | "onPress" | "children"
>;
export default function FloatingButton({
  iconAfter,
  onPress,
  children,
}: Props) {
  return (
    <Button
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
