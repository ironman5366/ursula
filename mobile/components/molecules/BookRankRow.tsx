import React from "react";
import { Pressable, StyleSheet } from "react-native";
import ReviewWithBook from "../../types/ReviewWithBook.ts";
import { XStack } from "tamagui";
import { GripVertical } from "@tamagui/lucide-icons";
import { StyledView } from "../organisms/StyledView.tsx";
import { StyledText } from "../atoms/StyledText.tsx";
import { BookPreviewLinkRow } from "./BookPreview/Link.tsx";
import Note from "../atoms/Note.tsx";

interface Props {
  review: ReviewWithBook;
  rank: number;
  drag?: () => void;
}

export default function BookRankRow({ rank, review, drag }: Props) {
  return (
    <Pressable onLongPress={drag}>
      <XStack
        style={styles.container}
        borderBottomWidth={1}
        borderBottomColor="#00000022"
      >
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
          <BookPreviewLinkRow book={review.book} />
          {review.review.note && <Note note={review.review.note} />}
        </StyledView>
        {drag && (
          <XStack flex={1} flexGrow={1} py="$2" px="$3" alignItems="center">
            <GripVertical color="#00000044" />
          </XStack>
        )}
      </XStack>
    </Pressable>
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
