import React, { ComponentProps, useState } from "react";
import StyledSheet from "../StyledSheet.tsx";
import { YStack } from "tamagui";
import SearchBar from "../../molecules/SearchBar.tsx";
import useDebounce from "../../../hooks/useDebounce.ts";
import useSearch from "../../../hooks/useSearch.ts";
import BookPreviewCard from "../../molecules/BookPreview/Card.tsx";
import SearchResultItem from "../../../pages/Search/Item.tsx";
import { ScrollView } from "react-native";

export default function AddBookSheet(
  props: Omit<ComponentProps<typeof StyledSheet>, "children">
) {
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 500);
  const { data: results, isLoading } = useSearch({
    query: debounced,
    enabled: !!debounced,
    filter: (r) => r.entity_type === "books",
  });

  return (
    <StyledSheet {...props}>
      <YStack>
        <ScrollView>
          <SearchBar
            editable
            value={query}
            onChangeText={(val) => setQuery(val)}
          />
          {results &&
            results.map((r) => (
              <SearchResultItem result={r} key={r.entity_id_numeric} />
            ))}
        </ScrollView>
      </YStack>
    </StyledSheet>
  );
}
