import React from "react";
import { useNavigation } from "expo-router";
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  View,
  Text,
} from "react-native";
import { TitleText } from "../components/atoms/TitleText";
import BookImage from "../components/atoms/BookImage";
import useIdParam from "../hooks/useIdParam";
import useBook from "../hooks/useBook";

export default function BookDetail() {
  const id = useIdParam();
  const { data: book } = useBook(id);

  if (!book) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  return <View style={styles.container}></View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
  },
});
