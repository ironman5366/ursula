import React, { ComponentProps, PropsWithChildren, useState } from "react";
import constate from "constate";
import { Button } from "tamagui";

const [TabProvider, useTabContext] = constate(
  ({ initial }: { initial: string }) => {
    const [curr, setTab] = useState(initial);

    return {
      curr,
      setTab,
    };
  }
);

function TabContent({ children, name }: PropsWithChildren<{ name: string }>) {
  const { curr } = useTabContext();

  if (curr === name) {
    return children;
  }

  return <></>;
}

interface TabButtonProps extends ComponentProps<typeof Button> {
  name: string;
}

function TabButton({ name, ...props }: TabButtonProps) {
  const { curr, setTab } = useTabContext();
  const active = curr === name;

  return (
    <Button
      borderWidth={0}
      borderRadius={0}
      borderBottomWidth={active ? 1 : 0}
      borderColor={"$claret"}
      onPress={() => setTab(name)}
      {...props}
    />
  );
}

export default function Tabs({
  children,
  initial,
}: PropsWithChildren<{ initial: string }>) {
  return <TabProvider initial={initial}>{children}</TabProvider>;
}

Tabs.Content = TabContent;
Tabs.Button = TabButton;
