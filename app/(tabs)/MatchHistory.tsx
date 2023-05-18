import { ScrollView, StyleSheet, TextInput } from "react-native";

import EditScreenInfo from "../../components/EditScreenInfo";
import { Text } from "../../components/Themed";
import useIndexState from "../../store";
import useDemands from "../../store/demand";
import useUser from "../../store/user";
import { Box, Input, View } from "native-base";
import { SplitCardViewBottom } from "../../components/SplitCardView";
import { AvartarCard, ContactCard, DemandCard } from "../../components/Card";
import useCommonStore from "../../store/common";

export default function MatchHistory() {
  const demand = useIndexState((state) => state.demand);
  const alldemands = useDemands((state) => state.alldemands);
  const { user } = useUser();
  const { contacts, requestUsersWithChats } = useCommonStore();
  return (
    <Box className="h-full">
      <View className="flex flex-1 bg-[#49809F] justify-center pt-3">
        <AvartarCard classname="ml-12" />
      </View>
      <SplitCardViewBottom classname="px-6 bg-red pt-4" height={"75%"}>
        <TextInput
          className="drop-shadow-xl rounded-3xl bg-[#e3eef0] py-3 px-3 text-[#447592]"
          placeholder="Search for task"
        />

        <ScrollView className="pt-4">
          {requestUsersWithChats.map((_requestChat, index) => (
            <ContactCard key={index} {..._requestChat} />
          ))}

          {/* {contacts.map((demand, index) => (
            <ContactCard key={index} />
          ))} */}
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
