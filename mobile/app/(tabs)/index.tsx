import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { useThemeColor, View } from "../../components/organisms/Themed";
import useSearchBooks from "../../hooks/useSearchBooks";
import React, { useState } from "react";
import useDebounce from "../../hooks/useDebounce";
import { useNavigation } from "expo-router";
import { useTheme } from "@react-navigation/native";
import SearchBar from "../../components/atoms/SearchBar";
import Ionicons from "@expo/vector-icons/Ionicons";
import { TitleText } from "../../components/atoms/TitleText";

export default function Index() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }} />
      <TouchableOpacity
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
