import React, { useEffect, useState } from "react";
import { useProfileImage, useUpdateProfile } from "../../hooks/profile.ts";
import { StyledView } from "../../components/organisms/StyledView.tsx";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
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
import ProfileImage from "../../components/atoms/ProfileImage.tsx";

interface Props {
  profile: Profile;
}

export default function ProfilePage({ profile }: Props) {
  const { session } = useSession();
  const { mutate: updateProfile, isLoading } = useUpdateProfile();
  const [username, setUsername] = useState(profile.username);
  const [name, setName] = useState(profile.full_name);

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
        <ProfileImage profile={profile} />
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
