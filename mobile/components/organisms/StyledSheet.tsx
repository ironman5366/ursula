import React, { ComponentProps } from "react";
import { Sheet } from "tamagui";

type SheetProps = ComponentProps<typeof Sheet>;
type FrameProps = ComponentProps<typeof Sheet.Frame>;

type Props = Omit<FrameProps, "position"> &
  Pick<SheetProps, "open" | "onOpenChange" | "position" | "onPositionChange">;

export default function StyledSheet({
  open,
  onOpenChange,
  position,
  onPositionChange,
  ...props
}: Props) {
  return (
    <Sheet
      snapPoints={[70, 35]}
      snapPointsMode={"percent"}
      dismissOnSnapToBottom
      position={position}
      zIndex={200_0000}
      animation="medium"
      open={open}
      onOpenChange={onOpenChange}
      forceRemoveScrollEnabled={open}
      onPositionChange={onPositionChange}
    >
      <Sheet.Overlay
        animation="lazy"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
      <Sheet.Handle backgroundColor={"$cambridgeBlue"} />
      <Sheet.Frame
        padding="$4"
        justifyContent="center"
        alignItems="center"
        space="$5"
        {...props}
      />
    </Sheet>
  );
}
