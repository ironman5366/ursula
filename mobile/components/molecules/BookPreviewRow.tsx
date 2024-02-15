import React, { useCallback } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { ThemedView } from "../organisms/Themed";
import BookImage from "../atoms/BookImage";
import useBookAuthors from "../../hooks/useBookAuthors";
import { Book } from "../../../shared-types/derived";
import { useNavigation } from "expo-router";
import { TitleText } from "../atoms/TitleText.tsx";
import { useTheme } from "@react-navigation/native";
import { StyledText } from "../atoms/StyledText.tsx";

interface Props {
  book: Book;
  imageSize?: number;
}

export default function BookPreviewRow({ book, imageSize }: Props) {
  const navigation = useNavigation();
  const theme = useTheme();

  const onPressCallback = useCallback(() => {
    navigation.navigate("BookDetailRoute", {
      id: book.id,
    });
  }, [book]);

  const { data: authors } = useBookAuthors({ book });

  return (
    <TouchableOpacity onPress={onPressCallback}>
      <ThemedView
        style={[
          {
            borderWidth: 2,
            borderRadius: 5,
            borderColor: theme.colors.primary,
          },
          styles.container,
        ]}
      >
        <ThemedView style={styles.imageContainer}>
          <BookImage book={book} size={imageSize || 50} />
        </ThemedView>
        <ThemedView style={styles.textContainer}>
          <TitleText fontSize={20}>{book.name}</TitleText>
          <StyledText>
            {authors?.map((author) => author.name).join(", ")}
          </StyledText>
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    borderRadius: 5,
    padding: 5,
    marginVertical: 3,
  },
  imageContainer: {
    flex: 1,
  },
  textContainer: {
    flexDirection: "column",
    flex: 4,
  },
});
