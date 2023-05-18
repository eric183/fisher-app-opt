import * as ImagePicker from "expo-image-picker";
import { SanityUploader } from "sanity-uploader";
import { ISanityDocument } from "sanity-uploader/typing";

const uploadPhoto = async (): Promise<ISanityDocument | undefined> => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
    // base64: true,
  });

  if (result.canceled) {
    return;
  }

  if (result.assets && result.assets[0]) {
    const fileName = result.assets[0].uri.match(
      /\/([\w-]+\.[\w-]+)$/
    )![0] as string;

    const response = await fetch(result.assets[0].uri);
    const blob = await response.blob();

    const responseData = await fetch(process.env.SANITY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "image",
        Authorization: `Bearer ${process.env.SANITY_TOKEN}`,
      },
      body: blob,
    });

    const { document } = await responseData.json();

    return document;
  }
};

export default uploadPhoto;
