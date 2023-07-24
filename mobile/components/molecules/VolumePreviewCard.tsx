import React, { useCallback } from "react";
import { VolumeInfo } from "../../types/Volume";
import Card from "../atoms/Card";
import { ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "../organisms/Themed";
import VolumeImage from "../atoms/VolumeImage";
import { getISBN } from "../../utils/isbn";
import { useNavigation } from "expo-router";

export interface VolumePreviewCardProps {
  volumeInfo: VolumeInfo | undefined;
  onPress?: () => void;
  imageSize?: number;
}

export default function VolumePreviewCard({
  volumeInfo,
  onPress,
  imageSize,
}: VolumePreviewCardProps) {
  const navigation = useNavigation();

  // If the caller didn't provide an OnPress action, navigate to the book detail page
  const onPressCallback = useCallback(() => {
    if (volumeInfo) {
      // @ts-ignore
      navigation.navigate("bookDetail", {
        isbn: getISBN(volumeInfo),
      });
    }
  }, [volumeInfo]);

  return (
    <TouchableOpacity
      disabled={!volumeInfo}
      onPress={onPress || onPressCallback}
    >
      <Card style={styles.container}>
        {volumeInfo ? (
          <>
            <View style={styles.imageContainer}>
              <VolumeImage volumeInfo={volumeInfo} size={imageSize || 50} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{volumeInfo.title}</Text>
              {volumeInfo.authors && (
                <Text style={styles.subtitle}>
                  {volumeInfo.authors.join(", ")}
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
