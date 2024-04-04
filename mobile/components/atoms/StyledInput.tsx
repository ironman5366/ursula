import { XCircle } from "@tamagui/lucide-icons";
import React, {
  ComponentProps,
  ReactElement,
  cloneElement,
  forwardRef,
  useState,
} from "react";
import { Button, Input, XStack } from "tamagui";
import { useThemeColor } from "../../theme.ts";
import ThemeColor from "../../types/ThemeColor";

interface Props extends ComponentProps<typeof Input> {
  borderColorName?: ThemeColor;
  icon?: ReactElement;
}

function StyledInput(
  { borderColorName, onBlur, onFocus, style, ...props }: Props,
  ref
) {
  const [isFocused, setIsFocused] = useState(false);
  const tint = "gray";
  const textColor = useThemeColor("text");
  const placeholderColor = useThemeColor("disabled");

  const value = props.value || "";
  const onChangeText = props.onChangeText || (() => {});

  return (
    <XStack
      borderWidth={2}
      backgroundColor="#E5E5E7"
      borderRadius={8}
      flexGrow={10}
      p={8}
      borderColor={isFocused ? "#00000044" : "#00000011"}
    >
      {props.icon &&
        cloneElement(props.icon, {
          size: 20,
          color: tint,
          mr: "$2",
          style: {
            flex: 0.1,
          },
        })}

      <Input
        style={{
          color: textColor,
          flex: 0.9,
        }}
        caretHidden={false}
        ref={ref}
        placeholder={"Search"}
        onChangeText={onChangeText}
        onFocus={(e) => {
          setIsFocused(true);
          onFocus && onFocus(e);
        }}
        unstyled
        onBlur={(e) => {
          setIsFocused(false);
          onBlur && onBlur(e);
        }}
        backgroundColor="$colorTransparent"
        flexGrow={1}
        value={value}
        placeholderTextColor={placeholderColor}
        {...props}
      />
      {value && value.length > 0 && (
        <Button
          unstyled
          iconAfter={<XCircle size={20} color={tint} />}
          onPress={() => onChangeText("")}
        />
      )}
    </XStack>
  );
}

export default forwardRef(StyledInput);
