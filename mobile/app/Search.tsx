import React, { useState } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { View } from "../components/organisms/Themed";
import SearchBar from "../components/atoms/SearchBar";
import useDebounce from "../hooks/useDebounce";
import useSearchBooks from "../hooks/useSearchBooks";
import SearchResultList from "../components/molecules/SearchResultList";

export default function Search() {
  const [name, setName] = useState("");
  const debouncedName = useDebounce(name, 200);
  const { data, isLoading, isSuccess } = useSearchBooks({
    name: debouncedName,
    enabled: !!debouncedName,
  });

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }} />
      <SearchBar value={name} onChangeText={setName} />
      <View style={{ flex: 1 }} />
      <View style={styles.searchResultsContainer}>
        {isLoading && debouncedName ? <ActivityIndicator size={"large"} /> : (
          data && <SearchResultList books={data} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  searchResultsContainer: {
    flex: 20,
  },
});
