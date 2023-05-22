import * as ImagePicker from "expo-image-picker";
import { SanityUploader } from "sanity-uploader";
import { ISanityDocument } from "sanity-uploader/typing";

const uploadPhoto = async <
  T extends ISanityDocument | ISanityDocument[] | undefined
>(options?: {
  multiple?: boolean;
}): Promise<T> => {
  const extendOptions = {
    allowsEditing: options?.multiple ? false : true,
    allowsMultipleSelection: options?.multiple ? true : false,
  };

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    aspect: [4, 3],
    quality: 1,

    ...extendOptions,
  });

  if (result.canceled) {
    return undefined as T;
  }

  const callMap = await Promise.all<ISanityDocument>(
    result.assets.map(async (asset) => {
      return new Promise(async (resolve) => {
        // const currentFileName = asset.uri.match(
        //   /\/([\w-]+\.[\w-]+)$/
        // )?.[0] as string;

        const response = await fetch(asset.uri);
        const blob = await response.blob();

        const responseData = await fetch(process.env.SANITY_URL, {
          method: "POST",
          headers: {
            // "Content-Type": "image",
            "Content-Type": "application/octet-stream",
            Authorization: `Bearer ${process.env.SANITY_TOKEN}`,
          },
          body: blob,
        });

        // const { document } = await responseData.json();
        const { document = null } = await responseData.json();
        resolve(document);
      });
    })
  );

  if (options?.multiple) {
    return callMap as T; // expected return type is ISanityDocument[] | undefined
  } else {
    return callMap[0] as T; // expected return type is ISanityDocument | undefined
  }
};

export default uploadPhoto;
