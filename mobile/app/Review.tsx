import React, { useMemo, useState } from "react";
import useReviews from "../hooks/useReviews";
import { View } from "../components/organisms/Themed";
import { ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function Review() {
  const params = useLocalSearchParams();
  const isbn: number = Number.parseInt(params.isbn as string);
  const { data, isLoading } = useReviews();
  const [comparator, setComparator] = useState<number>();

  const reviewComparison = useMemo(() => {
    if (!data || !data.data) {
      return;
    }

    const reviewCount = data.data.length;

    return 0;
  }, [data]);

  if (isLoading) {
    return (
      <View>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <>Reviews Loaded</>;
}
