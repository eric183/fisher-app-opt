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
import { useEffect, useRef, useState } from "react";
import { SplitCardViewBottom } from "../components/SplitCardView";
import { MaterialIcons } from "@expo/vector-icons";
import { create } from "zustand";
import useUser, { TUser } from "../store/user";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { InterfaceScrollViewProps } from "native-base/lib/typescript/components/basic/ScrollView/types";
import { useWStore } from "../hooks/ws";
import useCommonStore from "../store/common";
import { IChat, chatStore } from "../store/chat";

const Chat = () => {
  const navigation = useNavigation();
  const inputRef = useRef<TextInput>(null!);
  const scrollViewRef = useRef<any>(null!);
  const { chatStack, setChatStack } = chatStore();
  const { user } = useUser();
  const router = useRouter();
  const { ws } = useWStore();
  const { chatInfo } = useCommonStore();

  // const [chatList, setChatList] = useState<IChat[]>(null!);

  const getStackIdWidthList = () => {
    let stackId = "";
    let chatList: any[] = [];

    if (chatStack[`${user?.id}.${chatInfo?.user.id}`]) {
      stackId = `${user?.id}.${chatInfo?.user.id}`;
      chatList = chatStack[`${user?.id}.${chatInfo?.user.id}`];
    }

    if (chatStack[`${chatInfo?.user.id}.${user?.id}`]) {
      stackId = `${chatInfo?.user.id}.${user?.id}`;
      chatList = chatStack[`${chatInfo?.user.id}.${user?.id}`];
    }

    return [chatList ? stackId : `${user?.id}.${chatInfo?.user.id}`, chatList];
  };

  const requestForChat = () => {
    if (user && chatInfo?.user.id) {
      ws?.emit("startChat", {
        fromUserId: user?.id,
        toUserId: chatInfo?.user.id,
        demandId: chatInfo.demandId,
        message: "请求聊天",
        type: "demand",
      });
      return;
    }

    throw new Error("user not exsit");
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });

    scrollViewRef.current.scrollToEnd();
  }, []);

  useEffect(() => {
    requestForChat();
  }, [chatInfo]);

  useEffect(() => {
    scrollViewRef.current.scrollToEnd();
  }, [chatStack]);

  const sendMessage = () => {
    const context = inputRef.current.context as string;
    const [stackId, chatList] = getStackIdWidthList();

    if (context.trim()) {
      ws?.emit("sendMessage", {
        fromUserId: user?.id as string,
        toUserId: chatInfo?.user.id as string,
        message: context,
      });

      setChatStack(stackId as string, [
        ...chatList,
        {
          content: context,
          user: user as TUser,
        },
      ]);
      scrollViewRef.current.scrollToEnd();
    }
  };

  const [, chatList] = getStackIdWidthList();

  return (
    <Box className="flex-1">
      {/* <Box safeAreaTop className="flex-1"> */}

      <View className="flex bg-[#49809F] justify-center h-[20%] pt-3">
        <Pressable onPress={() => router.back()}>
          <View className="left-5 top-18 absolute w-10 h-10">
            <MaterialIcons
              // className="left12 top-12 absolute"
              name="arrow-back-ios"
              size={33}
              color="#fff"
            />
          </View>
        </Pressable>
        <AvartarCard classname="ml-16" />
      </View>
      <SplitCardViewBottom
        classname="px-6 pt-12 pb-2 bg-[#F2F5FA] overflow-hidden"
        // classname="px-6 pt-12 pb-2 bg-red-800 overflow-hidden"
        height={"70%"}
      >
        <ScrollView className="h-full flex flex-col" ref={scrollViewRef}>
          {chatList?.map((chat, index) => (
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
          className="w-[60%] relative z-50 bg-[#e3eef0] h-10 pl-3 px-4 py-2 rounded-3xl border-none focus:outline-none focus:border-blue-500 mx-5"
        />
        <Pressable className="-rotate-45 mr-2 -mt-3" onPress={sendMessage}>
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
