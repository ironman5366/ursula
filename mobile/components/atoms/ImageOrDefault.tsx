import React, { ComponentProps } from "react";
import { Image, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyledView } from "../organisms/StyledView.tsx";
import { StyledText } from "./StyledText.tsx";

type ImageProps = ComponentProps<typeof Image>;

// Same as image except source is allowed to be gone
type Props = Omit<ImageProps, "source"> & {
  source?: ImageProps["source"];
};

export default function ImageOrDefault({ style, source, ...props }: Props) {
  if (source) {
    return <Image style={style} source={source} {...props} />;
  } else {
    return (
      <StyledView style={style}>
        <Ionicons name={"image"} />
      </StyledView>
    );
  }
}
