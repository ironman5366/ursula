import { Button, StyleSheet } from "react-native";
import { ThemedView } from "../../components/organisms/Themed";
import SearchContainer from "../../components/SearchContainer";
import { supabase } from "../../utils/supabase";

export default function SettingsScreen() {
  return (
    <ThemedView style={styles.container}>
      <Button
        title={"Sign Out"}
        onPress={() => {
          console.log("Signing out...");
          supabase.auth.signOut();
        }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
