import { Stack, router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, SafeAreaView } from "react-native";
import { XStack, Text, Button } from "tamagui";
import SearchContainer from "../../components/containers/SearchContainer.tsx";
import SearchResultList from "../../components/organisms/SearchResultList";
import useDebounce from "../../hooks/useDebounce.ts";
import useSearch from "../../hooks/useSearch.ts";
import { XCircle } from "@tamagui/lucide-icons";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
export default function Search() {
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 500);
  const [dirty, setDirty] = useState(false);

  const { data, isLoading } = useSearch({
    query: debounced,
    enabled: !!debounced,
  });

  const showLoading = isLoading && !!debounced;

  const popRoute = () => router.canGoBack() && router.back();
  useEffect(() => {
    if (!debounced && dirty) {
      setDirty(false);
      popRoute();
    }
    if (debounced) {
      setDirty(true);
    }
  }, [debounced, dirty]);

  return (
    <SearchContainer
      editable
      onChangeText={(text) => setQuery(text)}
      value={query}
    >
      <Stack.Screen
        options={{
          title: "Search",
          header: (props) => <SearchHeader {...props} />,
          animation: "fade",
        }}
      />
      {showLoading ? (
        <ActivityIndicator />
      ) : (
        <SearchResultList results={data || []} />
      )}
    </SearchContainer>
  );
}

export function SearchHeader(props: NativeStackHeaderProps) {
  return (
    <SafeAreaView>
      <XStack
        height="$3"
        px="$3"
        justifyContent="space-between"
        alignContent="center"
        alignItems="center"
      >
        <Text fontSize="$8"></Text>
        <Button onPress={router.back} circular unstyled p={2}>
          <XCircle size={20} />
        </Button>
      </XStack>
    </SafeAreaView>
  );
}
