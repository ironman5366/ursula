import React, { useState } from "react";
import { ActivityIndicator, ScrollView } from "react-native";
import useDebounce from "../../../../hooks/useDebounce.ts";
import useSearch from "../../../../hooks/useSearch.ts";
import { Card, XStack, YStack } from "tamagui";
import SearchBar from "../../../molecules/SearchBar.tsx";
import { BookSearchResult } from "@ursula/shared-types/SearchResult.ts";
import useBook from "../../../../hooks/useBook.ts";
import BookPreviewCard from "../../../molecules/BookPreview/Card.tsx";
import { StyledText } from "../../../atoms/StyledText.tsx";
import { Book } from "@ursula/shared-types/derived.ts";

interface Props {
  selectBook: (book: Book) => void;
}

function BookSearchLoader({
  result,
  selectBook,
}: { result: BookSearchResult } & Props) {
  const { data: book, isLoading } = useBook(result.entity_id_numeric);

  if (isLoading) {
    return (
      <Card>
        <XStack gap={"$3"}>
          <ActivityIndicator />
        </XStack>
      </Card>
    );
  }

  return <BookPreviewCard book={book} onPress={() => selectBook(book)} />;
}

export function AddBookSearch({ selectBook }: Props) {
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 500);
  const { data: results, isLoading } = useSearch({
    query: debounced,
    enabled: !!debounced,
    filter: (r) => r.entity_type === "books",
  });

  return (
    <YStack gap={"$3"}>
      <SearchBar editable value={query} onChangeText={(val) => setQuery(val)} />
      <ScrollView>
        {debounced && isLoading ? (
          <ActivityIndicator />
        ) : (
          (results || []).map((r) =>
            r.entity_type === "books" ? (
              <BookSearchLoader
                key={r.entity_id_numeric}
                result={r}
                selectBook={selectBook}
              />
            ) : (
              <></>
            )
          )
        )}
      </ScrollView>
    </YStack>
  );
}
