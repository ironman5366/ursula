import { Link, Tabs } from "expo-router";
import { Pressable, useColorScheme } from "react-native";
import { Colors, useThemeColor } from "../../theme.ts";
import TabBarIcon from "../../components/atoms/TabBarIcon.tsx";

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
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Ursula",
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="yourBooks"
        options={{
          title: "Your Books",
          tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color} />,
        }}
      />
      <Tabs.Screen
        name="yourProfile"
        options={{
          title: "Your Profile",
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}
