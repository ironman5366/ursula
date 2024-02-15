import { Link, Stack } from "expo-router";
import { StyleSheet } from "react-native";

import { ThemedView } from "../components/organisms/Themed";
import { StyledText } from "../components/atoms/StyledText.tsx";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <ThemedView style={styles.container}>
        <StyledText style={styles.title}>This screen doesn't exist.</StyledText>

        <Link href="/" style={styles.link}>
          <StyledText style={styles.linkText}>Go to home screen!</StyledText>
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: "#2e78b7",
  },
});
