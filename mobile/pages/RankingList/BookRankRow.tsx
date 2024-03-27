import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { StyledText } from "../../components/atoms/StyledText.tsx";
import ReviewWithBook from "../../types/ReviewWithBook.ts";
import { StyledView } from "../../components/organisms/StyledView.tsx";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useThemeColor } from "../../theme.ts";
import BookPreviewLinkRow from "../../components/molecules/BookPreview/Link.tsx";
import { XStack } from "tamagui";
import { GripVertical } from "@tamagui/lucide-icons";

interface Props {
  review: ReviewWithBook;
  rank: number;
  drag: () => void;
}

export default function BookRankRow({ rank, review, drag }: Props) {
  const color = useThemeColor("text");

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
        </StyledView>
        <XStack flex={1} flexGrow={1} py="$2" px="$3" alignItems="center">
          <GripVertical color="#00000044" />
        </XStack>
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
