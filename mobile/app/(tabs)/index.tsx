import { SafeAreaView, StyleSheet, TouchableOpacity } from "react-native";

import { View } from "../../components/organisms/Themed";
import React from "react";
import { useNavigation } from "expo-router";
import SearchBar from "../../components/atoms/SearchBar";
import { TitleText } from "../../components/atoms/TitleText";

export default function Index() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }} />
      <TouchableOpacity
        // TODO: can I fix the typechecker with these navigate calls?
        // @ts-ignore
        onPress={() => navigation.navigate("Search")}
      >
        <View style={styles.searchBarContainer}>
          <SearchBar editable={false} />
        </View>
      </TouchableOpacity>
      <View style={{ flex: 1 }} />
      <TitleText>Your Books</TitleText>
      <View style={{ flex: 2 }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  // The searchbar should be 20% down
  searchBarContainer: {
    paddingTop: "10%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 5,
    padding: 10,
    justifyContent: "center",
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
