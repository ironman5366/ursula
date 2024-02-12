import React, { PropsWithChildren } from "react";
import { SafeAreaView, StyleSheet, TouchableOpacity } from "react-native";
import { View } from "./organisms/Themed";
import SearchBar from "./atoms/SearchBar";

export default function SearchContainer({ children }: PropsWithChildren<{}>) {
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        // TODO: can I fix the typechecker with these navigate calls?
        // @ts-ignore
        onPress={() => navigation.navigate("Search")}
      >
        <View style={styles.searchBarContainer}>
          <SearchBar editable={false} />
        </View>
        <View style={styles.children}>{children}</View>
      </TouchableOpacity>
      <View style={{ flex: 1 }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 5,
    padding: 10,
    justifyContent: "center",
  },
  children: {},
});
