import { Dimensions, SafeAreaView, StyleSheet, TextInput } from "react-native";

import { Text, View, ViewProps } from "../../components/organisms/Themed";
import SearchBar from "../../components/molecules/SearchBar";

const windowHeight = Dimensions.get("window").height;

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }} />
      <SearchBar />
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
