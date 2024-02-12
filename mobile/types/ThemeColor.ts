import { Colors } from "../constants";

type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export default ThemeColor;
