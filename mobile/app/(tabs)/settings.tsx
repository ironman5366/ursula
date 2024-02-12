import { Button, StyleSheet } from "react-native";
import { View } from "../../components/organisms/Themed";
import SearchContainer from "../../components/SearchContainer";
import { supabase } from "../../utils/supabase";

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Button
        title={"Sign Out"}
        onPress={() => {
          supabase.auth.signOut();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
