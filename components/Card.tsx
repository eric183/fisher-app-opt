import { Box, VStack, Image, Center, View, Pressable } from "native-base";
import { ImageBackground } from "react-native";
import { Text } from "./Themed";
import { FC } from "react";
import useUser from "../store/user";
import { TUser } from "../store/user";
import Sign from "../app/sign";
import { useRouter } from "expo-router";

export interface IDemandCard {
  image: string;
  title?: string;
  desc: string;
}

export const AvartarCard: FC<{
  avatar?: string;
  username?: string;
  mode?: string;
  classname?: string;
}> = (props) => {
  const router = useRouter();
  const { classname } = props;

  const { user } = useUser();

  const _user = {
    ...user,
    ...props,
  };

  return (
    <Box className={`flex flex-row ${classname}`}>
      <Image
        className="mr-4 rounded-md"
        source={{
          uri: _user?.avatar ? _user.avatar : "https://picsum.photos/200/300",
        }}
        w={16}
        h={16}
        alt="avatar"
      />
      <VStack>
        <Pressable onPress={() => router.push("/sign")}>
          <Text className="text-white text-base font-extrabold mb-1">
            {_user?.username ? _user.username : _user.id}
          </Text>
          <Text className="text-white">
            {props.mode ? props.mode : "工作模式"}
          </Text>
        </Pressable>
      </VStack>
    </Box>
  );
};

export const DemandCard: FC<IDemandCard> = ({ title, image, desc }) => {
  return (
    <Box className="w-full flex flex-row pt-10 pb-6 border-b-2 border-gray-300 bg-[#F2F5FA]">
      <Image
        className="mr-2 rounded-md"
        source={{ uri: image }}
        w={62}
        h={62}
        alt="task image"
      />
      <VStack>
        <Center>{title}</Center>
        <Center>{desc}</Center>
      </VStack>
    </Box>
  );
};
