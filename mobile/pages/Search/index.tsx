import { XCircle } from "@tamagui/lucide-icons";
import { Stack, router } from "expo-router";
import React, { ComponentProps, useEffect, useState } from "react";
import { ActivityIndicator, SafeAreaView } from "react-native";
import { Button, Text, XStack } from "tamagui";
import useDebounce from "../../hooks/useDebounce.ts";
import useSearch from "../../hooks/useSearch.ts";
import SearchResultList from "./List.tsx";
import { StyledView } from "../../components/organisms/StyledView.tsx";
import SearchContainer from "../../components/containers/SearchContainer";

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
  extends Omit<ComponentProps<typeof SearchResultList>, "results"> {
  initialQuery?: string;
}

export default function SearchPage({ initialQuery, ...props }: Props) {
  const [query, setQuery] = useState(initialQuery || "");
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
      autoFocus={true}
    >
      <Stack.Screen
        options={{
          title: "Search",
          header: () => <SearchHeader />,
          animation: "fade",
        }}
      />
      <StyledView style={{ padding: 10 }}>
        {showLoading ? (
          <ActivityIndicator />
        ) : (
          <SearchResultList results={data || []} {...props} />
        )}
      </StyledView>
    </SearchContainer>
  );
}
