import { router, Tabs } from "expo-router";
import { Home, Book, User, Bot } from "@tamagui/lucide-icons";
import { DefaultHeader } from "../../../components/atoms/DefaultHeader.tsx";
import TabBar from "../../../components/organisms/FloatingActionBar/TabBar.tsx";

export default function TabLayout() {
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
        name="chat"
        options={{
          title: "AI Librarian",
          tabBarIcon: ({ color }) => <Bot color={color} />,
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
