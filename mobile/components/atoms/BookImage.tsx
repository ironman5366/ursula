import React, { useEffect } from "react";
import { ActivityIndicator, Image } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Book } from "../../../shared-types/derived";
import { supabase } from "../../utils/supabase.ts";
import { Book as BookIcon } from "@tamagui/lucide-icons";
import { BookCovers, useBookCover } from "../../hooks/useBookCover.ts";

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
