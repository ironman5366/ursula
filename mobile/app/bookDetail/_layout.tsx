import { Stack } from "expo-router";

export default function BookDetailLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          title: "Book",
        }}
      />
    </Stack>
  );
}
