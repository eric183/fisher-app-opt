import { Alert, ScrollView, StyleSheet } from "react-native";

import EditScreenInfo from "../../components/EditScreenInfo";
import { Text } from "../../components/Themed";
import useIndexState from "../../store";
import useDemands, { TDemand } from "../../store/demand";
import useUser from "../../store/user";
import { Box, Button, Pressable, View } from "native-base";
import { SplitCardViewBottom } from "../../components/SplitCardView";
import { AvartarCard, DemandCard } from "../../components/Card";
import { useRouter } from "expo-router";
import useCommonStore from "../../store/common";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SanityUploader } from "sanity-uploader";

import { useAxios } from "../../store/axios";
import uploadPhoto from "../../utils/upload";
import useRequest from "../../hooks/request";

// import { createReadStream } from "fs";

export default function Index() {
  const demand = useIndexState((state) => state.demand);
  const alldemands = useDemands((state) => state.alldemands);

  const { user } = useUser();
  const router = useRouter();
  const { init, instance, loginStatus } = useAxios();
  const { updateUserAvatar, startChat } = useRequest();

  const goChat = async (_demand: TDemand) => {
    await startChat(_demand, "请求聊天");
    router.push("chat");
  };

  const onUploadPhoto = async () => {
    const document = await uploadPhoto();
    // console.log(document?.url, "!!!");

    if (document?.url) {
      await updateUserAvatar(document.url);
    }
  };

  // console.log(alldemands);
  return (
    <Box className="h-full">
      <View className="flex flex-1 bg-[#49809F] justify-center pt-3">
        <AvartarCard classname="ml-12" onUploadPhoto={onUploadPhoto} />
        <Button
          className="absolute w-30 height-10 right-44 top-32"
          onPress={() => {
            router.push("/sign");
            // alert("clear!!");
          }}
        >
          切换用户 - 调试
        </Button>
        <Button
          className="absolute w-30 height-10 right-10 top-32"
          onPress={() => {
            AsyncStorage.clear();
            Alert.alert("clear!!");
            // alert("clear!!");
          }}
        >
          清除缓存 - 调试
        </Button>
      </View>
      <SplitCardViewBottom classname="px-6" height={"75%"}>
        <Text className="title" style={styles.taskTitle}>
          Task List
        </Text>
        <ScrollView>
          {alldemands
            .filter((_demand) => _demand.userId === user?.id)
            .map((demand, index) => (
              <Pressable key={index} onPress={() => goChat(demand)}>
                <DemandCard
                  {...demand}
                  title={demand.title}
                  desc={demand.English.trim() ? demand.English : demand.Chinese}
                  image={demand.image}
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
