import { ScrollView, StyleSheet, TextInput } from "react-native";

import EditScreenInfo from "../../components/EditScreenInfo";
import { Text } from "../../components/Themed";
import useIndexState from "../../store";
import useDemands from "../../store/demand";
import useUser, { TUser } from "../../store/user";
import { Box, Input, View } from "native-base";
import { SplitCardViewBottom } from "../../components/SplitCardView";
import { AvartarCard, ContactCard, DemandCard } from "../../components/Card";
import useCommonStore from "../../store/common";
import { chatStore } from "../../store/chat";
import ProfileController from "../../components/ProfileController";

export default function ChatHistory() {
  // const demand = useIndexState((state) => state.demand);
  // const alldemands = useDemands((state) => state.alldemands);
  // const { user } = useUser();
  const { contacts, requestUsersWithChats } = useCommonStore();

  const { chatStack } = chatStore();
  console.log(chatStack, "chatStack .....");
  return (
    <Box className="h-full">
      <View className="flex flex-1 bg-[#49809F] justify-center pt-3">
        <AvartarCard classname="ml-12" />
        <ProfileController />
      </View>
      <SplitCardViewBottom classname="px-6 bg-red pt-4" height={"75%"}>
        <TextInput
          className="drop-shadow-xl rounded-3xl bg-[#e3eef0] py-3 px-3 text-[#447592]"
          placeholder="Search for chat"
        />

        <ScrollView className="pt-4">
          {Object.entries(chatStack).map((_requestChat: any, index) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const historyUser = requestUsersWithChats.find((_c) =>
              _requestChat[0].includes(_c.user.id as string)
            )!;

            console.log(requestUsersWithChats, "requestUsersWithChats , ;....");
            console.log(historyUser, "historyUser, .....");

            const toUserChats = _requestChat[1].filter(
              (u: any) => u?.user?.id === historyUser?.user?.id
            );
            console.log(_requestChat[1], " _requestChat[1] ..");

            const lastestContent = toUserChats[toUserChats.length - 1];

            console.log(lastestContent, "lastestContent ..");
            const _user = {
              ...historyUser,
              content: lastestContent.content,
            };

            return <ContactCard key={index} {..._user} isChat />;
          })}
        </ScrollView>
      </SplitCardViewBottom>
    </Box>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
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
