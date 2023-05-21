import {
  Modal,
  Pressable,
  Text,
  TouchableHighlight,
  View,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";
import Colors from "../constants/Colors";
import { FC, useRef, useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import useDemandState, { TDemand } from "../store/demand";
import { gptAPI } from "../utils/gpt";
import { useAxios } from "../store/axios";
import useUser, { TUser } from "../store/user";
import { Box, Stack, TextArea, Button, Image, Spinner } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import uploadPhoto from "../utils/upload";
import useRequest from "../hooks/request";

const AddDemandTab = ({ children, onPress }: any) => {
  const { user, setUser } = useUser();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const inputRef = useRef<TextInput>(null!);
  const [fetching, setFetching] = useState<boolean>(false);
  // const [demandStatus, setDemandStatus] = useState<TDemandStatus>("IDLE")
  const { createDemand } = useRequest();
  const [open, setOpen] = useState<boolean>(false);
  const {
    demandStatus,
    setDemandStatus,
    setPendingDemand,
    pendingDemand,
    pushDemand,
  } = useDemandState();

  const Tasks = [
    `上面字段可以放到如下哪个分类里，并赋值给current_category：["Social","Work","Home","Health","Shopping","Travel","Learning","Entertainment","Transportation","Finance"];`,
    `set demandRole: NEED(means you want something or to hire someone) | SERVER(means you can give or server something or find job) | FREE(other demand like find someone to play together or standup with someone);`,
    `将上面的数据填充到一下JSON里: { responseItem: { "Chinese": "","English": "", "demandRole": "", "categoryType": current_category }}; 注意*：顶部[]里的字段分别填充在 Chinese 和 English`,
    // `fill the context into: { responseItem: { "Chinese": "","English": "", "demandRole": "", categoryType: "" // ["Social","Work","Home","Health","Shopping","Travel","Learning","Entertainment","Transportation","Finance"] *Strict Match* }};`,
  ];

  const onClose = () => {
    setOpen(false);
  };

  const getJSONFormatFromGPT = (str: string) => {
    const regex = /{[^{}]*}/g; // 匹配 {} 中的内容
    const match = str.match(regex); // 匹配结果为数组，取第一个元素
    if (!match) {
      console.log("error", match);
      return;
    }

    return JSON.parse(match[0]); // 将匹配到的字符串转换为对象
  };

  const callOpenAI = async (value: string) => {
    const prompt = value.trim();

    try {
      const { choices, created, id, model, object, usage } = await gptAPI(
        embeddingPrompt(prompt)
      );

      console.log(prompt.slice(0, 10), ".... pendding to gpt,");
      const context = getJSONFormatFromGPT(choices[0].message.content);
      console.log(prompt.slice(0, 10), ".... response from gpt,");

      return context;
    } catch (err) {
      console.log("errrrrrr", err);
    }
  };

  const addDemandBinder = async (
    text: string,
    title: string,
    image: string
  ): Promise<TDemand | undefined> => {
    setDemandStatus("Pending");
    setModalVisible(false);
    console.log("pedding....");
    if (text.trim().length > 0) {
      try {
        setFetching(true);

        const requestData = await callOpenAI(text);

        console.log(requestData, ".!...!");

        setFetching(false);

        if (!requestData) return;

        const _demand = {
          title,
          image,
          status: "OPEN",
          ...requestData,
          userId: user?.id,
        } as TDemand;

        await createDemand(_demand);
        setDemandStatus("Registed");
        onClose();
        return _demand;
      } catch (error) {
        setFetching(false);

        setDemandStatus("Error");
      }
    }
  };

  const embeddingPrompt = (prompt: string) =>
    `[${prompt}]; ${Tasks.reduce(
      (pre, next, index) => pre + "Task_" + (index + 1) + ":" + next,
      ""
    )}`;

  const openClass =
    "absolute h-screen w-full top-[-75vh] rounded-t-3xl bg-red-300 z-10";
  const unOpenClass =
    "relative w-[64px] h-[64px] bg-[#ff904b] !rounded-t-none rounded-full top-[-40]";
  return (
    <Pressable
      className={`flex transition ease-in-out delay-150 ${
        open ? openClass : unOpenClass
      }`}
      onPress={() => {
        // setModalVisible(true);
        setOpen(true);
      }}
    >
      {!open ? children : null}

      {open ? (
        <AddDemandForm
          setOpen={setOpen}
          addDemandBinder={addDemandBinder}
          onClose={onClose}
          demandStatus={demandStatus}
        />
      ) : null}
    </Pressable>
  );
};

const AddDemandForm: FC<{
  demandStatus: TDemandStatus;
  addDemandBinder: (
    demandText: string,
    title: string,
    imageUrl: string
  ) => Promise<TDemand | undefined>;
  setOpen: (arg: boolean) => void;
  onClose: () => void;
}> = ({ setOpen, addDemandBinder, onClose, demandStatus }) => {
  const titleRef = useRef<TextInput>(null!);
  const textAreaRef = useRef<TextInput>(null!);
  const [imageUrl, setImageUrl] = useState<string>("");
  const closeAdd = () => {
    setOpen(false);
  };
  const onUploadImage = async () => {
    const document = await uploadPhoto();
    if (document?.url) {
      setImageUrl(document?.url);
    }
  };

  const uploadDemand = async () => {
    if (demandStatus === "Pending") {
      Alert.alert("Please hold on~");
      return;
    }

    const title = titleRef.current.context as string;
    const demandText = textAreaRef.current.context as string;

    if (!title || !title.trim()) {
      Alert.alert("Please input the title");
      return;
    }

    if (!demandText || !demandText.trim()) {
      Alert.alert("Please input the demand");
      return;
    }

    await addDemandBinder(demandText, title, imageUrl);
  };
  return (
    <Box className="w-full h-full bg-[#f2f5fa] rounded-t-3xl pt-5 px-8">
      <Box className="">
        <Text className="text-center text-3xl font-extrabold mb-4">
          New Task
        </Text>

        <Stack className="mb-6">
          <Text className="text-2xl mb-2">Title</Text>
          <TextInput
            ref={titleRef}
            onChangeText={(text) => (titleRef.current.context = text)}
            className="drop-shadow-xl rounded-xl bg-[#fff] py-3 px-3 text-[#447592]"
            placeholder="Input the title"
          ></TextInput>
        </Stack>
        {/* <Stack>
          <Text>Area</Text>
        </Stack> */}
        <Stack className="mb-6">
          <Text className="text-2xl mb-2">Task</Text>
          <TextArea
            ref={textAreaRef}
            bg="#fff"
            autoCompleteType={undefined}
            placeholder="Describe your task detail"
            onChangeText={(text) => (textAreaRef.current.context = text)}
          ></TextArea>
        </Stack>
        <Stack className="mb-6">
          <Text className="text-2xl mb-2">Image</Text>
          <Pressable onPress={onUploadImage}>
            <View className="bg-white border border-gray-400 border-dashed h-20 w-20 flex items-center justify-center">
              {imageUrl ? (
                <Image
                  w="full"
                  h="full"
                  source={{
                    uri: imageUrl,
                  }}
                  alt="Demand Image"
                />
              ) : (
                <MaterialIcons
                  name="add"
                  size={50}
                  color="gray"
                ></MaterialIcons>
              )}
            </View>
          </Pressable>
        </Stack>
      </Box>

      <Stack direction="row" justifyContent="space-between">
        <Button className="w-[45%] py-4 rounded-xl" onPress={onClose}>
          Cancel
        </Button>
        <Button
          className="w-[45%] py-4 rounded-xl bg-[#FF904B] animate-spin"
          onPress={uploadDemand}
        >
          {demandStatus === "Pending" ? (
            <Spinner color={"#fff"}></Spinner>
          ) : (
            "Confirm"
          )}
        </Button>
      </Stack>
    </Box>
  );
};

export default AddDemandTab;

const styles = StyleSheet.create({
  modalOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    width: "100%",
    height: "100%",
    zIndex: 15,
  },

  modalContent: {
    position: "relative",
    zIndex: 20,
    minWidth: "30%",
  },

  modal: {
    width: "100%",
    height: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
});
