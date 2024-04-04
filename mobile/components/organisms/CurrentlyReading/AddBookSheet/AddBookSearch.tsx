import React, { useState } from "react";
import { ActivityIndicator } from "react-native";
import useDebounce from "../../../../hooks/useDebounce.ts";
import useSearch from "../../../../hooks/useSearch.ts";
import { Button, Card, XStack, YStack } from "tamagui";
import SearchBar from "../../../molecules/SearchBar.tsx";
import { BookSearchResult } from "@ursula/shared-types/SearchResult.ts";
import useBook from "../../../../hooks/useBook.ts";
import BookPreviewCard from "../../../molecules/BookPreview/Card.tsx";
import { Book } from "@ursula/shared-types/derived.ts";
import { Link } from "expo-router";

interface Props {
  selectBook: (book: Book) => void;
  onOpenChange: (open: boolean) => void;
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

export function AddBookSearch({ selectBook, onOpenChange }: Props) {
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 500);
  const { data: results, isLoading } = useSearch({
    query: debounced,
    enabled: !!debounced,
    filter: (r) => r.entity_type === "books",
    limit: 3,
  });

  const showSearch = !!debounced && !isLoading;

  return (
    <YStack gap={"$3"}>
      <SearchBar editable value={query} onChangeText={(val) => setQuery(val)} />
      {isLoading && !!query && <ActivityIndicator />}
      {showSearch && (
        <YStack gap={"$3"}>
          {results.map((result: BookSearchResult) => (
            <BookSearchLoader
              key={result.entity_id_numeric}
              result={result}
              selectBook={selectBook}
              onOpenChange={onOpenChange}
            />
          ))}
          <Link href={`/search/?query=${query}`} asChild>
            <Button
              onPress={() => {
                onOpenChange(false);
                setQuery("");
              }}
            >
              More
            </Button>
          </Link>
        </YStack>
      )}
    </YStack>
  );
}
