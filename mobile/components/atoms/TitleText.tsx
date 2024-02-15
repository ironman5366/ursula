import { TextProps } from "../organisms/Themed";
import { StyledText } from "./StyledText.tsx";

interface Props extends TextProps {
  fontSize?: number;
}

export function TitleText({ fontSize, ...props }: Props) {
  return (
    <StyledText
      {...props}
      style={[
        props.style,
        {
          fontSize: fontSize || 24,
        },
      ]}
    ></StyledText>
  );
}
