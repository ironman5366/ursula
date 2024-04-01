import React, { useEffect, useState } from "react";
import { useCurrentProfile, useUpdateProfile } from "../../hooks/profile.ts";
import { Button, H2, Sheet, Text } from "tamagui";
import { Link } from "expo-router";
import { useActionBarContext } from "../../contexts/ActionBarContext.ts";

function SetupBanner() {
  const [open, setOpen] = useState(true);
  const [position, setPosition] = useState(0);
  const { mutate: updateProfile } = useUpdateProfile();
  const { setActionBarVisible } = useActionBarContext();

  useEffect(() => {
    setActionBarVisible(!open);
  }, [open]);

  return (
    <Sheet
      forceRemoveScrollEnabled={open}
      open={open}
      onOpenChange={setOpen}
      snapPoints={[70, 35]}
      snapPointsMode={"percent"}
      dismissOnSnapToBottom
      position={position}
      onPositionChange={setPosition}
      zIndex={200_0000}
      animation="medium"
    >
      <Sheet.Overlay
        animation="lazy"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
      <Sheet.Handle backgroundColor={"$cambridgeBlue"} />
      <Sheet.Frame
        padding="$4"
        justifyContent="center"
        alignItems="center"
        space="$5"
        backgroundColor="$electricPurple"
      >
        <H2 color="white">Your Account is Incomplete</H2>
        <Text color={"white"} fontSize={"$4"} textAlign={"center"}>
          You haven't gone through Ursula's new account setup process. This
          either means you were an early tester, or you closed the app before
          finishing. Either way, can we help you finish setting up your account?
        </Text>
        <Link href={"/(onboard)/setup"} asChild>
          <Button
            color={"$color.deepSeaGreen"}
            onPress={() => {
              setOpen(false);
            }}
          >
            Finish setting up (&lt; 1 minute)
          </Button>
        </Link>
        <Button
          color={"$claret"}
          onPress={() => {
            updateProfile({
              has_onboarded: true,
            });
            setOpen(false);
          }}
        >
          Don't ask me again
        </Button>
      </Sheet.Frame>
    </Sheet>
  );
}

export default function SetupGuard() {
  const { data: profile } = useCurrentProfile();

  if (!profile || profile.has_onboarded) {
    return <></>;
  }

  return <SetupBanner />;
}
