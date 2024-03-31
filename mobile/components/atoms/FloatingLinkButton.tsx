import React, { ComponentProps } from "react";
import { Button } from "tamagui";
import { MoveRight } from "@tamagui/lucide-icons";
import { FloatingActionBar } from "../containers/TabBar.tsx";
import { Link, LinkProps } from "expo-router";

type Props<T> = Pick<
  ComponentProps<typeof Button>,
  "iconAfter" | "onPress" | "children"
> & {
  href?: LinkProps<T>["href"];
};

export default function FloatingLinkButton<T>({
  iconAfter,
  onPress,
  children,
  href,
}: Props<T>) {
  return (
    <FloatingActionBar>
      <Link href={href} asChild>
        <Button
          width={300}
          unstyled
          alignSelf="center"
          height={50}
          px={10}
          fontWeight="bold"
          color="white"
          flexDirection="row"
          alignItems="center"
          alignContent="space-between"
          justifyContent="space-between"
          iconAfter={iconAfter}
          onPress={onPress}
        >
          {children}
        </Button>
      </Link>
    </FloatingActionBar>
  );
}
