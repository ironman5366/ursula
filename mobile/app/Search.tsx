import React, { useState } from "react";
import { StyleSheet, Text } from "react-native";
import SearchContainer from "../components/SearchContainer";
import useDebounce from "../hooks/useDebounce.ts";
import useSearchBooks from "../hooks/useSearchBooks.ts";
import { Book } from "@ursula/shared-types/derived.ts";
import SearchResultList from "../components/molecules/SearchResultList.tsx";

export default function Search() {
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 500);

  const { data, isLoading } = useSearchBooks({
    name: debounced,
    enabled: !!debounced,
  });

  return (
    <SearchContainer
      editable
      onChangeText={(text) => setQuery(text)}
      value={query}
    >
      <SearchResultList books={data} />
    </SearchContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },
});
