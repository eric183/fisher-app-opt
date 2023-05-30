import { StyleSheet, TextInput } from "react-native";
import {
  Box,
  View,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
} from "native-base";
import { AvartarCard, ChatCard } from "../components/Card";
import { useNavigation, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { SplitCardViewBottom } from "../components/SplitCardView";
import { MaterialIcons } from "@expo/vector-icons";
import useUser, { TUser } from "../store/user";
import useWS, { useWStore } from "../hooks/ws";
import { IChat, chatStore } from "../store/chat";
import { shallow } from "zustand/shallow";
import useDebounce from "../hooks/debounce";
import usePendingChat from "../store/pendingChat";

const Chat = () => {
  const navigation = useNavigation();
  const inputRef = useRef<TextInput>(null!);
  const scrollViewRef = useRef<any>(null!);
  const { setChatStack } = chatStore();
  const { chatStack } = chatStore(
    (state) => ({ chatStack: state.chatStack }),
    shallow
  );
  const { chatInfo } = usePendingChat();
  const { user } = useUser();
  const router = useRouter();
  const [ws] = useWS();

  const [chatList, setChatList] = useState<IChat[]>([]);

  const debouncedValue = useDebounce<string>(chatStack, 200);

  const getStackIdWidthList = () => {
    let stackId = "";
    let chatList: any[] = [];
    console.log(chatStack, "chatStack.....");
    if (chatStack[`${user?.id}.${chatInfo?.user.id}`]) {
      stackId = `${user?.id}.${chatInfo?.user.id}`;
      chatList = chatStack[`${user?.id}.${chatInfo?.user.id}`];
    }

    if (chatStack[`${chatInfo?.user.id}.${user?.id}`]) {
      stackId = `${chatInfo?.user.id}.${user?.id}`;
      chatList = chatStack[`${chatInfo?.user.id}.${user?.id}`];
    }

    return [stackId ? stackId : `${user?.id}.${chatInfo?.user.id}`, chatList];
  };

  // const [, chatList] = getStackIdWidthList();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });

    scrollViewRef.current.scrollToEnd();
  }, []);

  useEffect(() => {
    // requestForChat();
    console.log(chatInfo, "info!!");
  }, [chatInfo]);

  useEffect(() => {
    const [stackId, _chatList] = getStackIdWidthList();

    // console.log(_chatList, "_chatList,././...");
    setChatList([..._chatList]);

    setTimeout(() => {
      scrollViewRef.current.scrollToEnd();
    }, 10);
  }, [chatStack]);

  const sendMessage = () => {
    // return;
    const context = inputRef.current.context as string;
    const [stackId] = getStackIdWidthList();

    console.log(stackId, "stackId,sdafdasafa");
    // return;
    if (context.trim()) {
      ws?.emit("sendMessage", {
        fromUserId: user?.id as string,
        toUserId: chatInfo?.user.id as string,
        message: context,
      });

      setChatList([
        ...chatList,
        {
          content: context,
          user: user as TUser,
        },
      ]);

      setChatStack(stackId as string, [
        ...chatList,
        {
          content: context,
          user: user as TUser,
        },
      ]);
      inputRef.current.clear();
      // scrollViewRef.current.scrollToEnd();
    }
  };

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
        <AvartarCard
          classname="ml-16"
          avatar={chatInfo?.user?.avatar}
          username={
            chatInfo?.user?.username
              ? chatInfo?.user?.username
              : chatInfo?.user?.id
          }
        />
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

      <KeyboardAvoidingView
        // h={{
        //   base: "880px",
        //   lg: "880px",
        // }}
        contentContainerStyle={{
          display: "flex",
          width: "100%",
          backgroundColor: "#fff",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingLeft: 28,
          paddingRight: 28,
          // position: "absolute",
          // bottom: 0,
          height: "100%",
        }}
        className="w-full h-[12%] bg-white rounded-t-3xl absolute bottom-0 flex flex-row items-center justify-between"
        behavior={"position"}
      >
        {/* <View className="w-full h-[12%] bg-white rounded-t-3xl absolute bottom-0 flex flex-row items-center justify-between px-[28px]"> */}
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
        {/* </View> */}
      </KeyboardAvoidingView>
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
