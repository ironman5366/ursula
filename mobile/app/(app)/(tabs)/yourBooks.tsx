import { Stack } from "expo-router";
import React, { ComponentProps, useState } from "react";
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
import RankingList from "../../../pages/RankingList";
import ReadingList from "../../../pages/ReadingList.tsx";
import { DefaultHeader } from "../../../components/atoms/DefaultHeader.tsx";
import SearchContainer from "../../../components/containers/SearchContainer";

function TabWithActiveIndicator({
  value,
  currentTab,
  ...props
}: ComponentProps<typeof Tabs.Tab> & {
  currentTab: string;
}) {
  const active = currentTab === value;
  return (
    <Tabs.Tab
      {...props}
      value={value}
      borderBottomWidth={active ? 2 : 0}
      borderBottomColor={"$claret"}
    >
      {props.children}
    </Tabs.Tab>
  );
}

export default function YourBooks() {
  const [currentTab, setCurrentTab] = useState("wantToRead");

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
            <Tabs.List
              disablePassBorderRadius
              loop={false}
              borderBottomLeftRadius={0}
              borderBottomRightRadius={0}
              paddingBottom="$1.5"
              backgroundColor="transparent"
            >
              <TabWithActiveIndicator
                paddingHorizontal="$3"
                paddingVertical="$2"
                flex={1}
                my="$2"
                value="wantToRead"
                currentTab={currentTab}
              >
                <Text>Want to read</Text>
              </TabWithActiveIndicator>
              <TabWithActiveIndicator
                paddingHorizontal="$3"
                paddingVertical="$2"
                my="$2"
                borderBottomColor={currentTab === "tab2" ? "$claret" : "gray"}
                value={"alreadyRead"}
                flex={1}
                currentTab={currentTab}
              >
                <Text>Already read</Text>
              </TabWithActiveIndicator>
            </Tabs.List>
          </YStack>

          <AnimatePresence exitBeforeEnter>
            <AnimatedYStack
              key={currentTab}
              animation="100ms"
              x={0}
              opacity={1}
              flex={1}
            >
              <TabsContent value="wantToRead">
                <ReadingList />
              </TabsContent>

              <TabsContent value="alreadyRead">
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
