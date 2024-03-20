import { color, radius, size, space, zIndex, themes } from "@tamagui/themes";
import { DARK_TINT, LIGHT_TINT } from "./theme.ts";
import { createTokens } from "tamagui";

const tokens = createTokens({
  color: {
    darkRed: LIGHT_TINT,
    darkOrange: DARK_TINT,
    ...color,
  },
  space,
  size,
  radius,
  zIndex,
});

const tamaguiConfig = {
  tokens,
  themes,
};

export type Conf = typeof tamaguiConfig;
declare module "tamagui" {
  interface TamaguiCustomConfig extends Conf {}
}

export default tamaguiConfig;
