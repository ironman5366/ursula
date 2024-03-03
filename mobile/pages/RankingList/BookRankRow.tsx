import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { StyledText } from "../../components/atoms/StyledText.tsx";
import ReviewWithBook from "../../types/ReviewWithBook.ts";
import { StyledView } from "../../components/organisms/StyledView.tsx";
import Ionicons from "@expo/vector-icons/Ionicons";
import BookPreviewLink from "../../components/atoms/BookPreviewLink.tsx";

interface Props {
  review: ReviewWithBook;
  rank: number;
  drag: () => void;
}

export default function BookRankRow({ rank, review, drag }: Props) {
  return (
    <StyledView style={styles.container}>
      <StyledView style={styles.number}>
        <StyledText
          style={{
            fontWeight: "600",
          }}
        >
          # {rank}
        </StyledText>
      </StyledView>
      <StyledView style={styles.preview}>
        <BookPreviewLink book={review.book} />
      </StyledView>
      <StyledView style={styles.dragHandle}>
        <Pressable onLongPress={drag}>
          <Ionicons name={"list-outline"} size={30} />
        </Pressable>
      </StyledView>
    </StyledView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 10,
    flexDirection: "row",
    paddingRight: 10,
    paddingLeft: 5,
  },
  number: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  preview: {
    flex: 8,
  },
  dragHandle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
