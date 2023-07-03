import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import SearchBar from "../components/atoms/SearchBar";
import useDebounce from "../hooks/useDebounce";
import useSearchBooks from "../hooks/useSearchBooks";
import SearchResultList from "../components/molecules/SearchResultList";

export default function Search() {
  const [name, setName] = useState("");
  const debouncedName = useDebounce(name, 200);
  const { data, isLoading, isSuccess } = useSearchBooks(
    debouncedName,
    !!debouncedName
  );

  return (
    <View style={styles.container}>
      <SearchBar value={name} onChangeText={setName} />
      <View style={styles.searchResultsContainer}>
        {isLoading ? (
          <ActivityIndicator size={"large"} />
        ) : (
          data && <SearchResultList volumes={data.items} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchResultsContainer: {
    flex: 10,
  },
});
