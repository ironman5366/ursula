import React, { ComponentProps, useMemo } from "react";
import { Button, Text, XStack, YStack } from "tamagui";
import FloatingActionBar from "./index.tsx";
import { router, Tabs } from "expo-router";

const TabBarButton = ({ route, descriptors, index, state, navigation }) => {
  const { options } = descriptors[route.key];
  const label =
    options.tabBarLabel !== undefined
      ? options.tabBarLabel
      : options.title !== undefined
      ? options.title
      : route.name;

  const isFocused = useMemo(() => state.index === index, [state.index, index]);

  const handlePress = () => {
    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate({ name: route.name, merge: true });
    }
  };

  const handleLongPress = () => {
    navigation.emit({
      type: "tabLongPress",
      target: route.key,
    });
  };

  return (
    <XStack
      borderRadius="$10"
      backgroundColor={isFocused ? "#fff" : "transparent"}
    >
      <Button
        px={15}
        py={10}
        unstyled
        onPress={handlePress}
        onLongPress={handleLongPress}
        flexDirection="row"
        alignItems="center"
        icon={options.tabBarIcon({ color: isFocused ? "#000" : "#fff" })}
      >
        <Text fontWeight="bold" color={isFocused ? "#000" : "#fff"}>
          {isFocused ? label : ""}
        </Text>
      </Button>
    </XStack>
  );
};

type TabBarProps = ComponentProps<ComponentProps<typeof Tabs>["tabBar"]>;

export default function TabBar({
  state,
  descriptors,
  navigation,
}: TabBarProps) {
  return (
    <FloatingActionBar>
      <YStack alignContent="space-between">
        <XStack>
          {state.routes.map((route, index) => {
            return (
              <TabBarButton
                key={route.key}
                route={route}
                state={state}
                navigation={navigation}
                descriptors={descriptors}
                index={index}
              />
            );
          })}
        </XStack>
      </YStack>
    </FloatingActionBar>
  );
}
