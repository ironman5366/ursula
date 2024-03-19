import React from "react";
import { Image } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Book } from "../../../shared-types/derived";
import { supabase } from "../../utils/supabase.ts";
import { Book as BookIcon } from "@tamagui/lucide-icons";

export interface Props {
  book: Book;
  size: number;
}

const aspectRatio = 0.625;

export default function BookImage({ book, size }: Props) {
  return <BookIcon size={30} />;
  /** TODO: bring this back with the new cover setup
  if (book.large_thumbnail_key) {
    const {
      data: { publicUrl },
    } = supabase.storage
      .from("book_thumbnails")
      .getPublicUrl(book.large_thumbnail_key);

    return (
      <Image
        source={{
          uri: publicUrl,
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
   **/
}
