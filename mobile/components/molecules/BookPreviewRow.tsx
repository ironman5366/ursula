import React, { ComponentProps, forwardRef } from "react";
import { Pressable, StyleSheet } from "react-native";
import BookImage from "../atoms/BookImage";
import { Book } from "../../../shared-types/derived";
import { TitleText } from "../atoms/TitleText.tsx";
import { useTheme } from "@react-navigation/native";
import { StyledText } from "../atoms/StyledText.tsx";
import BookAuthors from "../atoms/BookAuthors.tsx";
import { StyledView } from "../organisms/StyledView.tsx";

interface Props {
  book: Book;
  imageSize?: number;
  onPress?: ComponentProps<typeof Pressable>["onPress"];
}

function BookPreviewRow({ book, imageSize, onPress }: Props, ref) {
  const theme = useTheme();

  const imageHeight = imageSize || 50;

  return (
    <Pressable onPress={onPress} ref={ref}>
      <StyledView
        style={[
          {
            borderWidth: 2,
            borderRadius: 5,
            borderColor: theme.colors.primary,
          },
          styles.container,
          {
            minHeight: imageHeight + 10,
          },
        ]}
      >
        <StyledView style={styles.imageContainer}>
          <BookImage book={book} size={imageHeight} />
        </StyledView>
        <StyledView style={styles.textContainer}>
          <TitleText fontSize={20}>{book.name}</TitleText>
          <BookAuthors bookId={book.id} />
        </StyledView>
      </StyledView>
    </Pressable>
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

export default forwardRef(BookPreviewRow);
