import React from "react";
import { View } from "../../components/organisms/Themed";
import SearchContainer from "../../components/SearchContainer.tsx";
import { StyleSheet, useWindowDimensions } from "react-native";
import { SceneMap, TabView } from "react-native-tab-view";
import ReadingList from "../../pages/ReadingList.tsx";
import RankingList from "../../pages/RankingList.tsx";

const renderScene = SceneMap({
  readingList: ReadingList,
  rankingList: RankingList,
});

export default function YourBooks() {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "readingList", title: "Want to Read" },
    { key: "rankingList", title: "Already Read" },
  ]);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
  );
}
