import * as ImagePicker from "expo-image-picker";
import { supabase } from "../utils/supabase.ts";
import { decode } from "base64-arraybuffer";
import { useUpdateProfile } from "./profile.ts";
import { useSession } from "../contexts/SessionContext.ts";

export default function usePickProfileImage() {
  const { mutate: updateProfile } = useUpdateProfile();
  const { session } = useSession();
  return async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      base64: true,
    });

    if (!result.canceled) {
      const { base64: encoded, uri } = result.assets[0];

      // Upload the result to supabase
      const ext = uri.substring(uri.lastIndexOf(".") + 1);
      const uploadPath = `${session.user.id}/profile.${ext}`;

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
}
