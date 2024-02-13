import React from "react";
import { Image } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Book } from "../../../shared-types/derived";

export interface Props {
  book: Book;
  size: number;
}

export default function BookImage({ book, size }: Props) {
  if (book.large_thumbnail_url) {
    return (
      <Image
        source={{
          uri: book.large_thumbnail_url,
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
