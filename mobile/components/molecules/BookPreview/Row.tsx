import React, { ComponentProps, forwardRef } from "react";
import { StyleSheet } from "react-native";
import BookImage from "../../atoms/book/BookImage.tsx";
import { Book } from "@ursula/shared-types/derived.ts";
import { TitleText } from "../../atoms/TitleText.tsx";
import BookAuthors from "../../atoms/book/BookAuthors.tsx";
import { StyledView } from "../../organisms/StyledView.tsx";
import { ListItem, YStack } from "tamagui";

interface Props {
  book: Book;
  imageSize?: number;
  onPress?: ComponentProps<typeof ListItem>["onPress"];
}

function BookPreviewRow({ book, imageSize, onPress }: Props, ref) {
  const imageHeight = imageSize || 50;

  return (
    <ListItem
      ref={ref}
      onPress={onPress}
      icon={<BookImage book={book} size={imageHeight} />}
      backgroundColor={"transparent"}
      textAlign={"left"}
      style={{
        textAlign: "left",
      }}
    >
      <YStack style={styles.textContainer}>
        <TitleText fontSize={20}>{book.title}</TitleText>
        <BookAuthors bookId={book.id} />
      </YStack>
    </ListItem>
  );
}

const styles = StyleSheet.create({
  textContainer: {
    flexDirection: "column",
    textAlign: "left",
    flex: 4,
  },
});

export default forwardRef(BookPreviewRow);
