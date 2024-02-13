import React, { useCallback } from "react";
import { ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import Card from "../atoms/Card";
import { Text, View } from "../organisms/Themed";
import BookImage from "../atoms/BookImage";
import useBookAuthors from "../../hooks/useBookAuthors";
import useBook from "../../hooks/useBook";
import { Book } from "../../../shared-types/derived";

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
  const onPressCallback = useCallback(() => {
    // @ts-ignore
    navigation.navigate("BookDetail", {
      id: book.id,
    });
  }, [book]);

  const { data: author } = useBookAuthors({ book });

  return (
    <TouchableOpacity disabled={!book} onPress={onPress || onPressCallback}>
      <Card style={styles.container}>
        {book ? (
          <>
            <View style={styles.imageContainer}>
              <BookImage book={book} size={imageSize || 50} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{book.title}</Text>
              {author && <Text style={styles.subtitle}>{author.name}</Text>}
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
