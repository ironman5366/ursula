import { Link } from "expo-router";

export function StyledLink({
  style,
  href,
  ...props
}: React.ComponentProps<typeof Link> & { style?: any }) {
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
