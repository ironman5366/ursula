import { BlurView } from "expo-blur";
import React, { useMemo } from "react";
import { useColorScheme } from "react-native";
import { Button, XStack, Text } from "tamagui";

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
      borderRadius="$11"
      backgroundColor={isFocused ? "#fff" : "transparent"}
    >
      <Button
        mx={15}
        my={10}
        unstyled
        onPress={handlePress}
        onLongPress={handleLongPress}
        flexDirection="row"
        alignItems="center"
        icon={options.tabBarIcon({ color: isFocused ? "#000" : "#fff" })}
      >
        <Text fontWeight="bold" color={isFocused ? "#000" : "#fff"}>
          {label}
        </Text>
      </Button>
    </XStack>
  );
};

export function TabBar({ state, descriptors, navigation, ...rest }) {
  return (
    <FloatingActionBar>
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
    </FloatingActionBar>
  );
}

export function FloatingActionBar({ children }) {
  let colorScheme = useColorScheme();

  return (
    <BlurView
      tint={colorScheme === "dark" ? "light" : "dark"}
      intensity={60}
      style={{
        position: "absolute",
        bottom: 0,
        gap: 20,
        overflow: "hidden",
        paddingHorizontal: 20,
        minWidth: 300,
        height: 55,
        marginBottom: 40,
        flexDirection: "row",
        alignSelf: "center",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 5,
        borderRadius: 1000,
        borderColor: "transparent",
      }}
    >
      {children}
    </BlurView>
  );
}
