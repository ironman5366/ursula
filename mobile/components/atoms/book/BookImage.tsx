import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "@tamagui/image";
import React from "react";
import { ActivityIndicator } from "react-native";
import { Book } from "@ursula/shared-types/derived.ts";
import { BookCovers, useBookCover } from "../../../hooks/useBookCover.ts";

export interface Props {
  book: Book;
  size: number;
}

const aspectRatio = 0.625;

/**
 * Look at the available image urls and choose the best one for the given size
 */
function chooseImageUrl(imageUrls: BookCovers, size: number): string | null {
  let prioritizedUrls: string[];

  if (size < 100) {
    prioritizedUrls = [
      imageUrls.small_url,
      imageUrls.medium_url,
      imageUrls.large_url,
    ];
  } else if (size < 300) {
    prioritizedUrls = [
      imageUrls.medium_url,
      imageUrls.large_url,
      imageUrls.small_url,
    ];
  } else {
    prioritizedUrls = [
      imageUrls.large_url,
      imageUrls.medium_url,
      imageUrls.small_url,
    ];
  }

  for (const url of prioritizedUrls) {
    if (url) {
      return url;
    }
  }
}
export default function BookImage({ book, size }: Props) {
  const { data } = useBookCover(book);

  if (!data) {
    return <ActivityIndicator size={"small"} />;
  } else {
    // Figure out which, if any url we can use
    let chosenUrl: string | null = chooseImageUrl(data, size);

    if (chosenUrl) {
      return (
        <Image
          source={{
            uri: chosenUrl,
          }}
          style={{
            borderRadius: 10,
            height: size,
            width: size * aspectRatio,
          }}
        />
      );
    } else {
      return <Ionicons name={"image"} size={size} />;
    }
  }
}
