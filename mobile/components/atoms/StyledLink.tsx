import { Link, LinkProps } from "expo-router";

export function StyledLink<T>({
  style,
  href,
  ...props
}: LinkProps<T> & { style?: any }) {
  return (
    <Link
      href={href}
      {...props}
      style={[
        style,
        {
          fontWeight: "bold",
          color: "#035487",
        },
      ]}
    />
  );
}
