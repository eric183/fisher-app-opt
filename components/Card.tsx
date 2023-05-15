import { Box, VStack, Image, Center, View } from "native-base";
import { ImageBackground } from "react-native";
import { Text } from "./Themed";
import { FC } from "react";

export interface IDemandCard {
  image: string;
  title?: string;
  desc: string;
}

export const DemandCard: FC<IDemandCard> = ({ title, image, desc }) => {
  return (
    <Box className="w-full flex flex-row pt-10 pb-6 border-b-2 border-gray-300">
      <Image
        className="mr-2 rounded-md"
        source={{ uri: image }}
        w={62}
        h={62}
        alt="task image"
        // imageStyle={{
        //   width: 62,
        //   height: 62,
        //   flex: 1,
        // }}
      />
      <VStack>
        {/* {title && <Text>{title}</Text>} */}
        <Center>{title}</Center>
        <Center>{desc}</Center>
        {/* <Text className="text-black">{desc}</Text> */}
      </VStack>
    </Box>
  );
};
