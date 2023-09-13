import { SafeAreaView, StyleSheet, TouchableOpacity } from "react-native";

import { useThemeColor, View } from "../../components/organisms/Themed";
import React from "react";
import { useNavigation } from "expo-router";
import SearchBar from "../../components/atoms/SearchBar";
import { TitleText } from "../../components/atoms/TitleText";
import ISBNPreviewCard from "../../components/atoms/ISBNPreviewCard";
import useRankedReviews from "../../hooks/useRankedReviews";

export default function Index() {
  const navigation = useNavigation();
  const { data: reviews } = useRankedReviews();
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
      {
        // TODO: would be nice to number the books here. Also, fix styling. Also also, use FlatList?
      }
      {reviews &&
        reviews.data &&
        reviews.data.map((row) => (
          <View style={styles.reviewedContainer} key={row.id}>
            <ISBNPreviewCard isbn={row.isbn} />
          </View>
        ))}
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
  reviewedContainer: {
    flex: 1,
    width: "80%",
  },
});
