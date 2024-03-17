import React, { useEffect } from "react";
import { TextInput, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useThemeColor } from "../../theme.ts";
import StyledButton from "../organisms/StyledButton.tsx";
import { StyledView } from "../organisms/StyledView.tsx";
import { StyledText } from "./StyledText.tsx";

interface SearchBarProps
  extends Omit<
    React.ComponentProps<typeof TextInput>,
    "style" | "placeholder" | "onChange" | "onChangeText" | "value"
  > {
  value?: string;
  // Must provide onChangeText, can't use onChange
  onChangeText?: (text: string) => void;
  editable: boolean;
}

export default function SearchBar({ editable, ...props }: SearchBarProps) {
  const tint = useThemeColor("tint");
  const textColor = useThemeColor("text");
  const placeholderColor = useThemeColor("disabled");

  const value = props.value || "";
  const onChangeText = props.onChangeText || (() => {});

  return (
    <View
      style={{
        width: "100%",
        flexDirection: "row",
      }}
    >
      <View
        style={{
          flexDirection: "column",
          width: "100%",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            borderColor: tint,
            borderWidth: 3,
            borderRadius: 8,
            padding: 8,
          }}
        >
          <Ionicons
            name="search"
            size={20}
            color={tint}
            style={{ flex: 0.1 }}
          />
          {editable ? (
            <TextInput
              style={{
                color: textColor,
                flex: 0.9,
              }}
              autoFocus={true}
              caretHidden={false}
              placeholder={"Search"}
              onChangeText={onChangeText}
              value={value}
              placeholderTextColor={placeholderColor}
              {...props}
            />
          ) : (
            <StyledView
              style={{
                flex: 0.9,
                justifyContent: "center",
              }}
            >
              <StyledText
                style={{
                  color: placeholderColor,
                }}
              >
                Search
              </StyledText>
            </StyledView>
          )}
        </View>
        {value && value.length > 0 && (
          <View
            style={{
              paddingTop: 10,
              alignSelf: "center",
            }}
          >
            <StyledButton title={"Clear"} onPress={() => onChangeText("")} />
          </View>
        )}
      </View>
    </View>
  );
}
