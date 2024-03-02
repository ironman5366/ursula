import { StyledText } from "./StyledText.tsx";
import { StyledTextProps } from "../../theme.ts";

interface Props extends StyledTextProps {
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
