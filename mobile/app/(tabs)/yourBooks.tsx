import React, { ComponentProps } from "react";
import { useWindowDimensions } from "react-native";
import {
  SceneMap,
  TabView,
  TabBar as MaterialTabBar,
} from "react-native-tab-view";
import ReadingList from "../../pages/ReadingList.tsx";
import RankingList from "../../pages/RankingList";
import { Stack } from "expo-router";
import { useThemeColor } from "../../theme.ts";

const renderScene = SceneMap({
  readingList: ReadingList,
  rankingList: RankingList,
});

type TabBarProps = ComponentProps<typeof MaterialTabBar>;

function TabBar(props: TabBarProps) {
  const backgroundColor = useThemeColor("background");
  const indicatorColor = useThemeColor("primary");
  const textColor = useThemeColor("text");

  return (
    <MaterialTabBar
      {...props}
      indicatorStyle={{
        backgroundColor: indicatorColor,
      }}
      labelStyle={{
        color: textColor,
        textTransform: "none",
      }}
      style={{
        backgroundColor,
      }}
    />
  );
}

export default function YourBooks() {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "readingList", title: "Want to Read" },
    { key: "rankingList", title: "Already Read" },
  ]);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Your Books",
        }}
      />

      <TabView
        renderTabBar={TabBar}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />
    </>
  );
}
