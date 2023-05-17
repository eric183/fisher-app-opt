import { ScrollView, StyleSheet } from "react-native";

import EditScreenInfo from "../../components/EditScreenInfo";
import { Text } from "../../components/Themed";
import useIndexState from "../../store";
import useDemands, { TDemand } from "../../store/demand";
import useUser from "../../store/user";
import { Box, Pressable, View } from "native-base";
import { SplitCardViewBottom } from "../../components/SplitCardView";
import { AvartarCard, DemandCard } from "../../components/Card";
import { useRouter } from "expo-router";
import useCommonStore from "../../store/common";

export default function Index() {
  const demand = useIndexState((state) => state.demand);
  const alldemands = useDemands((state) => state.alldemands);
  const { chatDemand, setChatDemand } = useCommonStore();
  const { user } = useUser();
  const router = useRouter();

  const goChat = (_demand: TDemand) => {
    setChatDemand(_demand);
    router.push("chat");
  };
  return (
    <Box className="h-full">
      <View className="flex flex-1 bg-[#49809F] justify-center pt-3">
        <AvartarCard classname="ml-12" />
      </View>
      <SplitCardViewBottom classname="px-6" height={"75%"}>
        <Text className="title" style={styles.taskTitle}>
          任务列表
        </Text>
        <ScrollView>
          {alldemands
            .filter((_demand) => _demand.userId !== user?.id)
            .map((demand, index) => (
              <Pressable key={index} onPress={() => goChat(demand)}>
                <DemandCard
                  desc={demand.Chinese}
                  image={"https://picsum.photos/200/300"}
                />
              </Pressable>
            ))}
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
