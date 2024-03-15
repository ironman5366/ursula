import React, { useMemo, useState } from "react";
import { useProfile, useUpdateProfile } from "../hooks/profile.ts";
import { StyledView } from "../components/organisms/StyledView.tsx";
import { Image, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { useSession } from "../contexts/SessionContext.ts";
import LoadingScreen from "../components/atoms/LoadingScreen.tsx";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../utils/supabase.ts";
import { StyledText } from "../components/atoms/StyledText.tsx";
import StyledInput from "../components/atoms/StyledInput.tsx";
import StyledButton from "../components/organisms/StyledButton.tsx";
import { Profile } from "@ursula/shared-types/derived.ts";

interface Props {
  profile: Profile;
}

export default function ProfilePage({ profile }: Props) {
  const { session } = useSession();
  const { mutate: updateProfile, isLoading } = useUpdateProfile();

  const [username, setUsername] = useState(profile.username);
  const [name, setName] = useState(profile.full_name);

  const avatarUrl: string | undefined = useMemo(() => {
    if (profile.avatar_key) {
      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(profile.avatar_key);
      return data?.publicUrl;
    }
  }, [profile.avatar_key]);

  if (!profile || isLoading) {
    return <LoadingScreen />;
  }

  const isOwnProfile = session?.user.id === profile.id;

  const pickProfileImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;

      // Upload the result to supabase
      const ext = uri.substring(uri.lastIndexOf(".") + 1);
      const uploadPath = `${profile.id}/profile.${ext}`;

      console.log("Uploading", uri, "to", uploadPath);

      // Read the file and upload it
      const file = await fetch(uri);
      const blob = await file.blob();
      const formData = new FormData();
      formData.append("file", blob);

      console.log("Blob size is ", blob.size, "bytes");
      console.log(formData);

      // Upload with override
      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(uploadPath, formData, { upsert: true });

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
            avatarUrl
              ? { uri: avatarUrl }
              : require("../assets/images/profile-placeholder.png")
          }
        />
      </TouchableOpacity>

      {
        // TODO: nice form here
      }

      <StyledButton>Save</StyledButton>
    </StyledView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    alignItems: "center",
  },
});
