import { Link, Redirect, router, Tabs } from "expo-router";
import { Pressable } from "react-native";
import { useThemeColor } from "../../../theme.ts";
import { TabBar } from "../../../components/containers/TabBar.tsx";
import { Home, Book, User, Settings2 } from "@tamagui/lucide-icons";

export default function TabLayout() {
  const color = useThemeColor("primary");
  console.log("In tab layout");

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "blue",
        headerRight: () => {
          console.log("in header right");
          return (
            <Link
              href={"/settings"}
              asChild
              style={{
                padding: 5,
              }}
            >
              <Pressable>
                <Settings2 color={color} />
              </Pressable>
            </Link>
          );
        },
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
