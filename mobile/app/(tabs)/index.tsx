import { Dimensions, SafeAreaView, StyleSheet, TextInput } from "react-native";

import { Text, View, ViewProps } from "../../components/organisms/Themed";
import SearchBar from "../../components/atoms/SearchBar";
import useSearchBooks from "../../hooks/useSearchBooks";
import { useState } from "react";
import useDebounce from "../../hooks/useDebounce";

const windowHeight = Dimensions.get("window").height;

export default function Index() {
  const [name, setName] = useState("");
  const debouncedName = useDebounce(name, 200);
  const { data, isLoading, isSuccess } = useSearchBooks(
    debouncedName,
    !!debouncedName
  );

  console.log("data", data, "isLoading", isLoading, "isSuccess", isSuccess);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }} />
      <SearchBar value={name} onChangeText={setName} />
      <View style={{ flex: 5 }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  // The searchbar should be 20% down
  searchBarContainer: {
    paddingTop: "10%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
