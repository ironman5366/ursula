import React, { Dispatch, SetStateAction } from "react";
import useDebounce from "../../hooks/useDebounce.ts";
import useUsernameTaken from "../../hooks/usernameTaken.ts";
import { useSession } from "../../contexts/SessionContext.ts";
import { Text, XStack, Input } from "tamagui";
import { ActivityIndicator } from "react-native";
import { Check } from "@tamagui/lucide-icons";

function UsernameTaken({ username }: { username: string }) {
  const debouncedUsername = useDebounce(username, 500);
  const {
    data: takenBy,
    isLoading,
    isFetched,
  } = useUsernameTaken(debouncedUsername);
  const { session } = useSession();

  if (!isFetched) {
    return <></>;
  }

  if (isLoading) {
    return <ActivityIndicator size={"small"} />;
  } else {
    if (takenBy === null || takenBy === session.user.id) {
      return <Check color={"$cambridgeBlue"} />;
    } else {
      return (
        <XStack alignItems={"center"}>
          <Text color={"$claret"}>This username is taken</Text>
        </XStack>
      );
    }
  }
}

interface Props {
  username: string;
  setUsername: Dispatch<SetStateAction<string>>;
}

export default function UsernameInput({ username, setUsername }: Props) {
  return (
    <XStack alignItems={"center"} padding={"$1"}>
      <Text fontWeight={"bold"}>@</Text>
      <Input
        padding={0}
        placeholder={"Pick a username"}
        borderWidth={"$0"}
        value={username}
        autoCorrect={false}
        autoComplete={"off"}
        autoCapitalize={"none"}
        placeholderTextColor={"black"}
        onChangeText={(val) => setUsername(val)}
      />
      <UsernameTaken username={username} />
    </XStack>
  );
}
