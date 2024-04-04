import React, { ComponentProps } from "react";
import { Card } from "tamagui";
import { BlurView } from "expo-blur";

export default function BannerCard({
  children,
  ...props
}: ComponentProps<typeof Card>) {
  return (
    <Card
      width={"$12"}
      alignItems={"center"}
      justifyContent={"center"}
      {...props}
    >
      {children}
    </Card>
  );
}
