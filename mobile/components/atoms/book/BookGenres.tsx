import React from "react";
import { useBookGenres } from "../../../hooks/genres.ts";
import { Text } from "tamagui";

interface Props {
  book: { id: number };
}

export default function BookGenres({ book: { id } }: Props) {
  const { data: genres, isLoading } = useBookGenres(id);

  if (isLoading) {
    return <Text>Loading..</Text>;
  } else {
    return <Text>{genres?.map((genre) => genre?.name || "").join(", ")}</Text>;
  }
}
