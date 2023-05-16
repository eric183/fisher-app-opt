import { StyleSheet, TextInput } from "react-native";
import {
  Box,
  View,
  Text,
  ScrollView,
  Stack,
  Input,
  Pressable,
} from "native-base";
import { AvartarCard, ChatCard } from "../components/Card";
import { useNavigation, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { SplitCardViewBottom } from "../components/SplitCardView";
import { MaterialIcons } from "@expo/vector-icons";
import { create } from "zustand";
import useUser, { TUser } from "../store/user";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export interface IChat {
  content: string;
  user: Partial<TUser>;
}

const chatStore = create<{
  chatList: IChat[];
  setChatList: (chat: IChat) => void;
}>()((set) => ({
  chatList: [
    {
      content: "你好",
      user: {
        id: "clhq3ojc40002mc0uya8vg8ry",
      },
    },
  ],
  setChatList: (_chat) =>
    set(({ chatList }) => ({
      chatList: [...chatList, _chat],
    })),
}));

const Chat = () => {
  const navigation = useNavigation();
  const inputRef = useRef<TextInput>(null!);
  const { chatList, setChatList } = chatStore();
  const { user } = useUser();
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  console.log(chatList);
  const sendMessage = () => {
    const context = inputRef.current.context as string;

    if (context.trim()) {
      setChatList({
        content: context,
        user: user as TUser,
      });
    }
  };

  return (
    <Box safeAreaTop className="flex-1">
      <View className="flex bg-[#49809F] justify-center h-[20%]">
        <AvartarCard classname="ml-16" />
      </View>
      <SplitCardViewBottom classname="px-6 pt-12 pb-32 bg-[#F2F5FA] overflow-hidden">
        <ScrollView className="h-full flex-1 flex flex-col">
          {chatList.map((chat, index) => (
            <ChatCard {...chat} mineUser={user} key={index} />
          ))}
        </ScrollView>
      </SplitCardViewBottom>

      <Box className="w-full h-[12%] bg-white rounded-t-3xl absolute bottom-0 flex flex-row items-center justify-between px-[28px]">
        <View className="bg-[#447592] rounded-full w-[48px] h-[48px] flex justify-center items-center">
          <MaterialIcons name="add" size={35} color="#fff"></MaterialIcons>
        </View>

        <TextInput
          ref={inputRef}
          placeholder="Type a message"
          placeholderTextColor="#e3eef0"
          onChangeText={(text) => (inputRef.current.context = text)}
          className="w-[78%] relative z-50 bg-[#e3eef0] h-14 pl-3 px-4 py-2 rounded-3xl border-none focus:outline-none focus:border-blue-500"
        />
        <Pressable className="-rotate-45 mr-2" onPress={sendMessage}>
          <MaterialIcons name="send" size={35} color="#447592"></MaterialIcons>
        </Pressable>
      </Box>
    </Box>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  // scrollView: {
  //   marginHorizontal: 20,
  // },
  taskTitle: {
    marginTop: 32,
    marginLeft: 5,
    marginBottom: 20,
    color: "#000",
    fontSize: 20,
    fontWeight: "900",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
