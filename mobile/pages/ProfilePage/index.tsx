import React, { useEffect, useState } from "react";
import { useUpdateProfile } from "../../hooks/profile.ts";
import { StyledView } from "../../components/organisms/StyledView.tsx";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import { useSession } from "../../contexts/SessionContext.ts";
import LoadingScreen from "../../components/atoms/LoadingScreen.tsx";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../../utils/supabase.ts";
import { StyledText } from "../../components/atoms/StyledText.tsx";
import StyledInput from "../../components/atoms/StyledInput.tsx";
import StyledButton from "../../components/organisms/StyledButton.tsx";
import { Profile } from "@ursula/shared-types/derived.ts";
import FollowersSection from "./FollowersSection.tsx";
import { decode } from "base64-arraybuffer";

interface Props {
  profile: Profile;
}

export default function ProfilePage({ profile }: Props) {
  const { session } = useSession();
  const { mutate: updateProfile, isLoading } = useUpdateProfile();
  const [username, setUsername] = useState(profile.username);
  const [name, setName] = useState(profile.full_name);
  const [avatarURL, setAvatarURL] = useState<string>();

  useEffect(() => {
    if (profile.avatar_key) {
      supabase.storage
        .from("avatars")
        .createSignedUrl(profile.avatar_key, 3600)
        .then(({ data, error }) => {
          if (error) {
            throw error;
          }

          console.log("signed URL is", data.signedUrl);
          setAvatarURL(data.signedUrl);
        });
    }
  }, [profile]);

  if (!profile || isLoading) {
    return <LoadingScreen />;
  }

  const isOwnProfile = session?.user.id === profile.id;

  const pickProfileImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      base64: true,
    });

    if (!result.canceled) {
      const { base64: encoded, uri } = result.assets[0];

      // Upload the result to supabase
      const ext = uri.substring(uri.lastIndexOf(".") + 1);
      const uploadPath = `${profile.id}/profile.${ext}`;

      console.log("Uploading", uri, "to", uploadPath);

      // Read the file and upload it

      // Upload with override
      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(uploadPath, decode(encoded), {
          upsert: true,
          contentType: `image/${ext}`,
        });

      if (error) {
        console.error("Error uploading avatar", error);
        return;
      }

      updateProfile({
        avatar_key: data.path,
      });
    }
  };

  return (
    <StyledView style={styles.container}>
      <TouchableOpacity
        disabled={!isOwnProfile}
        onPress={() => {
          if (isOwnProfile) {
            pickProfileImage();
          }
        }}
      >
        <Image
          style={{
            width: 150,
            height: 150,
            borderRadius: 50,
          }}
          source={
            avatarURL
              ? { uri: avatarURL }
              : require("../../assets/images/profile-placeholder.png")
          }
        />
      </TouchableOpacity>
      <FollowersSection profile={profile} />
      <StyledView style={styles.formContainer}>
        <StyledText
          style={{
            fontWeight: "bold",
          }}
        >
          Username:
        </StyledText>
        {isOwnProfile ? (
          <StyledInput
            autoCorrect={false}
            autoComplete={"off"}
            autoCapitalize={"none"}
            value={username}
            onChangeText={setUsername}
            editable={isOwnProfile}
          />
        ) : (
          <StyledText>@{username}</StyledText>
        )}

        <StyledText
          style={{
            fontWeight: "bold",
          }}
        >
          Name:
        </StyledText>
        <StyledInput
          value={name}
          onChangeText={setName}
          editable={isOwnProfile}
        />

        <StyledButton
          onPress={() => {
            updateProfile({
              username,
              full_name: name,
            });
          }}
          title={"Save"}
        />
      </StyledView>
    </StyledView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    alignItems: "center",
  },
  formContainer: {
    width: "100%",
    padding: 10,
    flex: 0.5,
    justifyContent: "space-evenly",
  },
});
