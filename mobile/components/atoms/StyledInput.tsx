import React, {
  ComponentProps,
  ReactElement,
  cloneElement,
  forwardRef,
} from "react";
import { Button, Input, XStack } from "tamagui";
import { useThemeColor } from "../../theme.ts";
import ThemeColor from "../../types/ThemeColor";
import { XCircle } from "@tamagui/lucide-icons";

interface Props extends ComponentProps<typeof Input> {
  borderColorName?: ThemeColor;
  icon?: ReactElement;
}

function StyledInput({ borderColorName, style, ...props }: Props, ref) {
  const tint = "gray";
  const textColor = useThemeColor("text");
  const placeholderColor = useThemeColor("disabled");

  const value = props.value || "";
  const onChangeText = props.onChangeText || (() => {});

  return (
    <XStack
      borderWidth={2}
      backgroundColor="#00000011"
      borderRadius={8}
      flexGrow={10}
      p={8}
      borderColor="#00000022"
    >
      {cloneElement(props.icon, {
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
        autoFocus={true}
        caretHidden={false}
        ref={ref}
        placeholder={"Search"}
        onChangeText={onChangeText}
        unstyled
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
