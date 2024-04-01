import React from "react";
import Animated, { BounceInDown, BounceOutDown } from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { useActionBarContext } from "../../../contexts/ActionBarContext";

export default function FloatingActionBar({
  children,
  height = 55,
  borderRadius = 1000,
}) {
  const { actionBarVisible } = useActionBarContext();

  if (!actionBarVisible) {
    return <></>;
  }

  return (
    <Animated.View
      key="floating-action-bar"
      entering={BounceInDown.duration(500)}
      exiting={BounceOutDown.duration(400)}
      style={{
        position: "absolute",
        bottom: 0,
        gap: 20,
        overflow: "hidden",
        paddingHorizontal: 20,
        minWidth: 300,
        marginBottom: 40,
        alignSelf: "center",
      }}
    >
      <BlurView
        tint={"dark"}
        intensity={60}
        style={{
          gap: 20,
          overflow: "hidden",
          paddingHorizontal: 20,
          minWidth: 300,
          height: height,
          flexDirection: "row",
          alignSelf: "center",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: 5,
          borderRadius: borderRadius,
          borderColor: "transparent",
        }}
      >
        {children}
      </BlurView>
    </Animated.View>
  );
}
