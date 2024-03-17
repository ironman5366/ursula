import { Link, Tabs } from "expo-router";
import { Pressable, useColorScheme } from "react-native";
import { Colors, useThemeColor } from "../../theme.ts";
import TabBarIcon from "../../components/atoms/TabBarIcon.tsx";
import { TabBar } from "../../components/containers/TabBar.tsx";
import { Home, Book, User } from "@tamagui/lucide-icons";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const color = useThemeColor("tint");

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerRight: () => (
          <Link href={"/settings"} asChild>
            <Pressable>
              <TabBarIcon name="gear" color={color} />
            </Pressable>
          </Link>
        ),
        headerRightContainerStyle: {
          paddingRight: 10,
        },
      }}
      tabBar={TabBar}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Ursula",
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => <Home color={color} />,
        }}
      />
      <Tabs.Screen
        name="yourBooks"
        options={{
          title: "Books",
          tabBarIcon: ({ color }) => <Book color={color} />,
        }}
      />
      <Tabs.Screen
        name="yourProfile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <User color={color} />,
        }}
      />
    </Tabs>
  );
}
