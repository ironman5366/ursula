import React, { useState } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { View } from "../components/organisms/Themed";
import SearchBar from "../components/atoms/SearchBar";
import useDebounce from "../hooks/useDebounce";
import useSearchVolumes from "../hooks/useSearchVolumes";
import SearchResultList from "../components/molecules/SearchResultList";

export default function Search() {
  const [name, setName] = useState("");
  const debouncedName = useDebounce(name, 200);
  const { data, isLoading, isSuccess } = useSearchVolumes(
    debouncedName,
    !!debouncedName,
  );

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }} />
      <SearchBar value={name} onChangeText={setName} />
      <View style={{ flex: 1 }} />
      <View style={styles.searchResultsContainer}>
        {isLoading && debouncedName ? <ActivityIndicator size={"large"} /> : (
          data && <SearchResultList volumes={data.items} />
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
