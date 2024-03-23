import { Tabs } from "expo-router";
import { useThemeColor } from "../../../theme.ts";
import { TabBar } from "../../../components/containers/TabBar.tsx";
import { Home, Book, User } from "@tamagui/lucide-icons";
import { DefaultHeader } from "../../../components/atoms/DefaultHeader.tsx";

export default function TabLayout() {
  const color = useThemeColor("primary");

  return (
    <Tabs
      screenOptions={{
        header: DefaultHeader,
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