import React from "react";
import { Stack } from "expo-router";
import useIdParam from "../../hooks/useIdParam.ts";
import useBook from "../../hooks/useBook.ts";
import { StyleSheet } from "react-native";
import { ThemedView } from "../../components/organisms/Themed.tsx";
import LoadingScreen from "../../components/atoms/LoadingScreen.tsx";

export default function Rank() {
  const id = useIdParam();
  const { data: book } = useBook(id);

  if (!book) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: `Review ${book.name}`,
        }}
      />
      <ThemedView style={styles.container}></ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
