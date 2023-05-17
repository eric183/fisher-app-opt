import {
  Box,
  VStack,
  Image,
  Center,
  View,
  Pressable,
  Stack,
} from "native-base";
import { Text } from "./Themed";
import { FC } from "react";
import useUser, { TUser } from "../store/user";
import { useRouter } from "expo-router";
import { IChat } from "../app/chat";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import isMe from "../utils/isMe";
import { MaterialIcons } from "@expo/vector-icons";
import useCommonStore from "../store/common";

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

export const ContactCard: FC<{
  avatar?: string;
  username?: string;
  mode?: string;
  classname?: string;
}> = (props) => {
  const router = useRouter();
  const { classname } = props;

  const { user } = useUser();
  const { setChatInfo } = useCommonStore();
  const _user = {
    ...user,
    ...props,
  };

  const goChat = () => {
    // setChatInfo()
    router.push("chat");
  };

  return (
    <Box
      className={`flex flex-row items-center mb-4 border-b border-gray-300 pb-3 justify-between ${classname}`}
    >
      <Pressable onPress={goChat}>
        <VStack alignItems="center" direction="row">
          <Image
            className="mr-4 rounded-md"
            source={{
              uri: _user?.avatar
                ? _user.avatar
                : "https://picsum.photos/200/300",
            }}
            w={12}
            h={12}
            alt="avatar"
          />
          <Text className="text-black text-base font-extrabold mb-1">
            {(_user?.username ? _user.username : _user.id)?.slice(0, 5)}
          </Text>
        </VStack>
        <VStack className="flex-shrink-0">
          <MaterialIcons name="sms" color="#447592" size={20}></MaterialIcons>
        </VStack>
      </Pressable>
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

export const ChatCard: FC<
  IChat & {
    mineUser?: TUser;
  }
> = (props) => {
  if (!props.mineUser) return null;
  const isMeMySelf = isMe(props.user as TUser, props.mineUser);
  return (
    <Stack
      className="flex-shrink-0 h-20 mt-3"
      direction={"row"}
      alignItems={"center"}
      reversed={isMeMySelf}
      justifyContent={isMeMySelf ? "flex-end" : "flex-start"}
    >
      <Image
        // className=""
        rounded="2xl"
        className={`flex-shrink-0 w-[72px] h-[72px] ${
          isMeMySelf ? "ml-4" : "mr-4"
        }`}
        source={{
          uri: props.user.avatar
            ? props.user.avatar
            : "https://picsum.photos/200/300",
        }}
        alt="left"
      />
      <View className="border max-w-[66%] min-h-[55%] border-gray-300 px-6 py-2 flex justify-center rounded-3xl">
        <Text className="text-black w-full break-words">{props.content}</Text>
      </View>
    </Stack>
  );
};
