import React from "react";
import { VolumeInfo } from "../../types/Volume";
import { Image } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export interface VolumeImageProps {
  volumeInfo: VolumeInfo;
  size: number;
}

export default function VolumeImage({ volumeInfo, size }: VolumeImageProps) {
  if (volumeInfo.imageLinks) {
    return (
      <Image
        source={{
          uri: volumeInfo.imageLinks.thumbnail,
        }}
        style={{
          height: size,
          width: size,
        }}
      />
    );
  } else {
    return <Ionicons name={"image"} size={size} />;
  }
}
