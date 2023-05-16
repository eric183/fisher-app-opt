import { StyleSheet } from "react-native";
import { Box, View, Text, ScrollView, Stack } from "native-base";
import { AvartarCard } from "../components/Card";
import { useNavigation, useRouter } from "expo-router";
import { useEffect } from "react";
import { SplitCardViewBottom } from "../components/SplitCardView";

const Chat = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  return (
    <Box safeAreaTop className="h-full">
      <View className="flex bg-[#49809F] justify-center h-[20%]">
        <AvartarCard classname="ml-16" />
      </View>
      <SplitCardViewBottom classname="px-6 h-[calc(72%)] bg-red-700">
        <ScrollView>
          {/* {alldemands
            .filter((_demand) => _demand.userId !== user?.id)
            .map((demand, index) => (
              <Pressable onPress={() => router.push("chat")}>
                <DemandCard
                  key={index}
                  desc={demand.Chinese}
                  image={"https://picsum.photos/200/300"}
                />¨
              </Pressable>
            ))} */}
        </ScrollView>
      </SplitCardViewBottom>
      <Box className="w-full h-[12%] bg-blue-800 rounded-t-3xl absolute bottom-0"></Box>
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
