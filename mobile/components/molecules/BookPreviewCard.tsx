import React, { useCallback } from "react";
import Book from "../../../types/Book";
import { ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import Card from "../atoms/Card";
import { Text, View } from "../organisms/Themed";
import VolumeImage from "../atoms/VolumeImage";

export interface BookCardProps {
  book: Book | undefined;
  onPress?: () => void;
  imageSize?: number;
}

export default function BookPreviewCard({
  book,
  onPress,
  imageSize,
}: BookCardProps) {
  const onPressCallback = useCallback(() => {
    if (book) {
      // @ts-ignore
      navigation.navigate("BookDetail", {
        id: book.id,
      });
    }
  }, [book]);

  const { isLoading, data: authors };

  return (
    <TouchableOpacity disabled={!book} onPress={onPress || onPressCallback}>
      <Card style={styles.container}>
        {book ? (
          <>
            <View style={styles.imageContainer}>
              <VolumeImage volumeInfo={book} size={imageSize || 50} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{book.title}</Text>
              {book.authors && (
                <Text style={styles.subtitle}>{book.authors.join(", ")}</Text>
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
