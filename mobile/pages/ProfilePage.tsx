import React, { useMemo } from "react";
import { useProfile, useUpdateProfile } from "../hooks/profile.ts";
import { StyledView } from "../components/organisms/StyledView.tsx";
import { StyleSheet, TouchableOpacity } from "react-native";
import ImageOrDefault from "../components/atoms/ImageOrDefault.tsx";
import { useSession } from "../contexts/SessionContext.ts";
import LoadingScreen from "../components/atoms/LoadingScreen.tsx";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../utils/supabase.ts";

interface Props {
  profileId: string;
}

export default function ProfilePage({ profileId }: Props) {
  const { session } = useSession();
  const { data: profile } = useProfile(profileId);
  const { mutate: updateProfile, isLoading } = useUpdateProfile();

  if (!profile || isLoading) {
    return <LoadingScreen />;
  }

  const isOwnProfile = session?.user.id === profile.id;

  const avatarUrl: string | undefined = useMemo(() => {
    if (profile.avatar_key) {
      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(profile.avatar_key);
      return data?.publicUrl;
    }
  }, [profile?.avatar_key]);

  const pickProfileImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
    });

    if (!result.canceled) {
      // Upload the result to supabase
      const uri = result.assets[0].uri;
      const filename = uri.split("/").pop();
      const extension = filename.split(".").pop();

      const uploadPath = `${profile.id}/profile.${extension}`;

      console.log("Uploading", uri, "to", uploadPath);
      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(uploadPath, uri);

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
      <StyledView style={styles.avatarContainer}>
        <TouchableOpacity
          disabled={!isOwnProfile}
          onPress={() => {
            if (isOwnProfile) {
              pickProfileImage();
            }
          }}
        >
          <ImageOrDefault
            style={{ width: 100, height: 100, borderRadius: 50 }}
            source={avatarUrl && { uri: avatarUrl }}
          />
        </TouchableOpacity>
      </StyledView>
    </StyledView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  avatarContainer: {
    alignItems: "center",
  },
});
