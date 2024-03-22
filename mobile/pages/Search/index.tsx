import React, { ComponentProps, useEffect, useState } from "react";
import { Stack, router } from "expo-router";
import { ActivityIndicator, SafeAreaView } from "react-native";
import { XStack, Text, Button } from "tamagui";
import { XCircle } from "@tamagui/lucide-icons";
import useDebounce from "../../hooks/useDebounce.ts";
import useSearch from "../../hooks/useSearch.ts";
import SearchResultList from "./List.tsx";
import SearchContainer from "../../components/containers/SearchContainer.tsx";
import { SearchResultType } from "@ursula/shared-types/SearchResult.ts";
import SearchResultItem from "./Item.tsx";

export function SearchHeader() {
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

interface Props
  extends Omit<ComponentProps<typeof SearchResultList>, "results"> {}

export default function SearchPage(props: Props) {
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
          header: () => <SearchHeader />,
          animation: "fade",
        }}
      />
      {showLoading ? (
        <ActivityIndicator />
      ) : (
        <SearchResultList results={data || []} {...props} />
      )}
    </SearchContainer>
  );
}
