import { BlurView } from "expo-blur";
import React, { useMemo } from "react";
import Animated, { BounceInDown, BounceOutDown } from "react-native-reanimated";
import { Button, Text, XStack, YStack } from "tamagui";

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

export function ReactiveContainerIdkWhy({
  state,
  descriptors,
  navigation,
  ...rest
}: any) {
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

// TODO: Strongly type this
export function TabBar({ state, descriptors, navigation, ...rest }: any) {
  return (
    <ReactiveContainerIdkWhy
      state={state}
      descriptors={descriptors}
      navigation={navigation}
      {...rest}
    />
  );
}

export function FloatingActionBar({
  children,
  height = 55,
  borderRadius = 1000,
}) {
  return (
    <Animated.View
      key="floating-action-bar"
      entering={BounceInDown.duration(500)}
      exiting={BounceOutDown.duration(400)}
      style={{
        position: "absolute",
        bottom: 0,
        gap: 20,
        overflow: "hidden",
        paddingHorizontal: 20,
        minWidth: 300,
        marginBottom: 40,
        alignSelf: "center",
      }}
    >
      <BlurView
        tint={"dark"}
        intensity={60}
        style={{
          gap: 20,
          overflow: "hidden",
          paddingHorizontal: 20,
          minWidth: 300,
          height: height,
          flexDirection: "row",
          alignSelf: "center",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: 5,
          borderRadius: borderRadius,
          borderColor: "transparent",
        }}
      >
        {children}
      </BlurView>
    </Animated.View>
  );
}
