import React, { useCallback } from "react";
import { ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import Card from "../atoms/Card";
import { Text, View } from "../organisms/Themed";
import BookImage from "../atoms/BookImage";
import useBookAuthors from "../../hooks/useBookAuthors";
import { Book } from "../../../shared-types/derived";
import { useNavigation } from "expo-router";

export interface BookPreviewCardProps {
  book: Book;
  onPress?: () => void;
  imageSize?: number;
}

export default function BookPreviewCard({
  book,
  onPress,
  imageSize,
}: BookPreviewCardProps) {
  const navigation = useNavigation();

  const onPressCallback = useCallback(() => {
    // @ts-ignore
    navigation.navigate("BookDetail", {
      id: book.id,
    });
  }, [book]);

  const { data: authors } = useBookAuthors({ book });

  return (
    <TouchableOpacity disabled={!book} onPress={onPress || onPressCallback}>
      <Card style={styles.container}>
        {book ? (
          <>
            <View style={styles.imageContainer}>
              <BookImage book={book} size={imageSize || 50} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{book.name}</Text>
              {authors && (
                <Text style={styles.subtitle}>
                  {authors.map((author) => author.name).join(", ")}
                </Text>
              )}
            </View>
          </>
        ) : (
          <ActivityIndicator />
        )}
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 5,
  },
  imageContainer: {
    paddingRight: 5,
  },
  textContainer: {},
  title: {
    fontSize: 20,
  },
  subtitle: {
    fontSize: 15,
  },
});
