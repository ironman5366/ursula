import { Stack } from "expo-router";
import React, { useState } from "react";
import {
  AnimatePresence,
  StackProps,
  TabLayout,
  Tabs,
  TabsContentProps,
  TabsTabProps,
  YStack,
  styled,
  Text,
} from "tamagui";
import SearchContainer from "../../../components/containers/SearchContainer.tsx";
import RankingList from "../../../pages/RankingList";
import ReadingList from "../../../pages/ReadingList.tsx";
import { DefaultHeader } from "../../../components/atoms/DefaultHeader.tsx";

export default function YourBooks() {
  const [tabState, setTabState] = useState<{
    currentTab: string;
    intentAt: TabLayout | null;
    activeAt: TabLayout | null;
    prevActiveAt: TabLayout | null;
  }>({
    activeAt: null,
    currentTab: "tab1",
    intentAt: null,
    prevActiveAt: null,
  });

  const setCurrentTab = (currentTab: string) =>
    setTabState({ ...tabState, currentTab });
  const setIntentIndicator = (intentAt) =>
    setTabState({ ...tabState, intentAt });
  const setActiveIndicator = (activeAt) =>
    setTabState({ ...tabState, prevActiveAt: tabState.activeAt, activeAt });
  const { activeAt, intentAt, prevActiveAt, currentTab } = tabState;

  /**
   * -1: from left
   *  0: n/a
   *  1: from right
   */
  const direction = (() => {
    if (!activeAt || !prevActiveAt || activeAt.x === prevActiveAt.x) {
      return 0;
    }
    return activeAt.x > prevActiveAt.x ? -1 : 1;
  })();

  const enterVariant =
    direction === 1 ? "isLeft" : direction === -1 ? "isRight" : "defaultFade";
  const exitVariant =
    direction === 1 ? "isRight" : direction === -1 ? "isLeft" : "defaultFade";

  const handleOnInteraction: TabsTabProps["onInteraction"] = (type, layout) => {
    if (type === "select") {
      setActiveIndicator(layout);
    } else {
      setIntentIndicator(layout);
    }
  };
  return (
    <>
      <Stack.Screen
        options={{
          title: "Books",
          header: DefaultHeader,
        }}
      />
      <SearchContainer editable={false}>
        <Tabs
          value={currentTab}
          onValueChange={setCurrentTab}
          orientation="horizontal"
          flex={1}
          flexGrow={1}
          flexDirection="column"
          activationMode="manual"
          height="100%"
        >
          <YStack>
            <AnimatePresence>
              {intentAt && (
                <TabsRovingIndicator
                  width={intentAt.width}
                  height="$0.5"
                  x={intentAt.x}
                  bottom={0}
                />
              )}
            </AnimatePresence>
            <AnimatePresence>
              {activeAt && (
                <TabsRovingIndicator
                  active
                  width={activeAt.width}
                  height="$0.5"
                  x={activeAt.x}
                  bottom={0}
                />
              )}
            </AnimatePresence>
            <Tabs.List
              disablePassBorderRadius
              loop={false}
              borderBottomLeftRadius={0}
              borderBottomRightRadius={0}
              paddingBottom="$1.5"
              backgroundColor="transparent"
            >
              <Tabs.Tab
                unstyled
                paddingHorizontal="$3"
                paddingVertical="$2"
                flex={1}
                my="$2"
                borderBottomWidth="$1"
                borderBottomColor={currentTab === "tab1" ? "black" : "gray"}
                value="tab1"
                onInteraction={handleOnInteraction}
              >
                <Text>Want to read</Text>
              </Tabs.Tab>
              <Tabs.Tab
                unstyled
                paddingHorizontal="$3"
                paddingVertical="$2"
                value="tab2"
                my="$2"
                borderBottomWidth="$1"
                borderBottomColor={currentTab === "tab2" ? "black" : "gray"}
                flex={1}
                onInteraction={handleOnInteraction}
              >
                <Text>Already read</Text>
              </Tabs.Tab>
            </Tabs.List>
          </YStack>

          <AnimatePresence
            exitBeforeEnter
            custom={{ enterVariant, exitVariant }}
          >
            <AnimatedYStack
              key={currentTab}
              animation="100ms"
              x={0}
              opacity={1}
              flex={1}
            >
              <TabsContent value="tab1">
                <ReadingList />
              </TabsContent>

              <TabsContent value="tab2">
                <RankingList />
              </TabsContent>
            </AnimatedYStack>
          </AnimatePresence>
        </Tabs>
      </SearchContainer>
    </>
  );
}

const TabsContent = (props: TabsContentProps) => {
  return (
    <Tabs.Content
      width="100%"
      height={7800}
      py="$2"
      alignItems="center"
      justifyContent="center"
      flex={1}
      flexGrow={1}
      {...props}
    >
      {props.children}
    </Tabs.Content>
  );
};

const TabsRovingIndicator = ({
  active,
  ...props
}: { active?: boolean } & StackProps) => {
  return (
    <YStack
      position="absolute"
      backgroundColor="$color5"
      opacity={0.7}
      animation="100ms"
      enterStyle={{
        opacity: 0,
      }}
      exitStyle={{
        opacity: 0,
      }}
      {...(active && {
        backgroundColor: "$color8",
        opacity: 0.6,
      })}
      {...props}
    />
  );
};

const AnimatedYStack = styled(YStack, {
  variants: {
    isLeft: { true: { x: -25, opacity: 0 } },
    isRight: { true: { x: 25, opacity: 0 } },
    defaultFade: { true: { opacity: 0 } },
  } as const,
});
