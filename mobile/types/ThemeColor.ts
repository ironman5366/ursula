import { Colors } from "../theme";

type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export default ThemeColor;
