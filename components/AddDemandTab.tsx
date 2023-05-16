import { StyleSheet, TextInput } from "react-native";

import { Modal, Pressable, Text, TouchableHighlight, View } from "react-native";
import Colors from "../constants/Colors";
import { useRef, useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import useDemandState, { TDemand } from "../store/demand";
import { gptAPI } from "../utils/gpt";

const AddDemandTab = ({ children, onPress }: any) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const inputRef = useRef<TextInput>(null!);
  const [fetching, setFetching] = useState<boolean>(false);
  // const [demandStatus, setDemandStatus] = useState<TDemandStatus>("IDLE")
  const {
    demandStatus,
    setDemandStatus,
    setPendingDemand,
    pendingDemand,
    pushDemand,
  } = useDemandState();

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

  const postGPTAPI = async ({ nativeEvent }: any) => {
    // console.log(inputRef.current?.props);
    const { text } = nativeEvent;

    // setDemand(text);
    // setFetching(true);
    // setModalVisible(false);

    // return;
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

        setDemandStatus("Registed");

        const _demand = {
          ...requestData,
          userId: user?.id,
        };

        await createDemand(_demand);
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

  return (
    <Pressable
      className="flex w-[64px] h-[64px] rounded-full bg-[#ff904b]"
      top={-40}
      onPress={() => {
        setModalVisible(true);
      }}
    >
      {children}

      <Modal visible={modalVisible} animationType={"fade"} transparent={true}>
        <View style={styles.modal}>
          <TouchableHighlight
            style={styles.modalOverlay}
            onPress={() => setModalVisible(false)}
          >
            <View></View>
          </TouchableHighlight>

          <View style={styles.modalContent}>
            <View>
              <TextInput
                ref={inputRef}
                onSubmitEditing={postGPTAPI}
                placeholder="Input your demand"
                className="relative z-50 bg-white h-8 pl-3 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
              ></TextInput>
            </View>
          </View>
        </View>
      </Modal>
    </Pressable>
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
