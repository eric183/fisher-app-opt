import { Pressable, Text, View, TextInput, Alert, LogBox } from "react-native";
import { FC, useRef, useState } from "react";
import useDemandState, { TDemand } from "../store/demand";
import { gptAPI } from "../utils/gpt";
import useUser from "../store/user";
import {
  Box,
  Stack,
  TextArea,
  Button,
  Image,
  Spinner,
  HStack,
  ScrollView,
  KeyboardAvoidingView,
  Input,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import uploadPhoto from "../utils/upload";
import useRequest from "../hooks/request";
import { ISanityDocument } from "sanity-uploader/typing";
import MapView from "react-native-maps";

import {
  GooglePlacesAutocomplete,
  GooglePlaceData,
  GooglePlaceDetail,
} from "react-native-google-places-autocomplete";
LogBox.ignoreLogs([
  "VirtualizedLists should never be nested inside plain ScrollViews with the same orientation - use another VirtualizedList-backed container instead.",
]);

const AddDemandTab = ({ children }: any) => {
  const { user } = useUser();
  const [, setModalVisible] = useState<boolean>(false);
  const [, setFetching] = useState<boolean>(false);
  // const [demandStatus, setDemandStatus] = useState<TDemandStatus>("IDLE")
  const { createDemand } = useRequest();
  const [open, setOpen] = useState<boolean>(false);
  const { demandStatus, setDemandStatus, setAllDemands, alldemands } =
    useDemandState();

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
      console.log(prompt.slice(0, 10), ".... pendding to gpt,");
      const embeddedPrompt = embeddingPrompt(prompt);
      console.log(embeddedPrompt, "test");
      const { choices } = await gptAPI(embeddedPrompt);

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
    images: string[],
    placeInfo?: TDemand["place"]
  ): Promise<TDemand | undefined> => {
    setDemandStatus("Pending");
    setModalVisible(false);
    // console.log("pedding....");
    if (text.trim().length > 0) {
      try {
        setFetching(true);

        const requestData = await callOpenAI(text);
        setFetching(false);

        if (!requestData) return;

        const _demand = {
          title,
          images,
          status: "OPEN",
          place: placeInfo,
          ...requestData,
          userId: user?.id,
        } as TDemand;

        const newDemand = await createDemand(_demand);

        setDemandStatus("Registed");
        setAllDemands([...alldemands, newDemand]);
        onClose();
        return newDemand;
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
    "absolute h-screen w-full top-[-80vh] rounded-t-3xl bg-red-300 z-10";
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
          open={open}
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
  open: boolean;
  addDemandBinder: (
    demandText: string,
    title: string,
    imageUrl: string[],
    placeInfo: TDemand["place"]
  ) => Promise<TDemand | undefined>;
  setOpen: (arg: boolean) => void;
  onClose: () => void;
}> = ({ addDemandBinder, onClose, demandStatus }) => {
  const titleRef = useRef<TextInput>(null!);
  const textAreaRef = useRef<TextInput>(null!);
  const [imageUrl, setImageUrl] = useState<string>("");

  const [imageList, setImageList] = useState<string[]>([]);
  const [imageUplooading, setImageUplooading] = useState<boolean>(false);

  const mapViewRef = useRef<MapView>(null!);
  const mapRef = useRef<any>(null!);
  const completeRef = useRef<any>(null!);
  const [placeInfo, setPlaceInfo] = useState<TDemand["place"]>(null!);
  const [placeStyle, setPlaceStyle] = useState<any>(null!);
  const [mapInput, setMapInput] = useState<boolean>(null!);

  const onUploadImage = async () => {
    const document: ISanityDocument[] = await uploadPhoto({
      multiple: true,
    });

    setImageList((state) => [...state, ...document.map((link) => link.url)]);
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

    await addDemandBinder(demandText, title, imageList, placeInfo);
  };

  const onRegionChange = async () => {
    // const add = await mapViewRef.current.addressForCoordinate({
    //   latitude: region.latitude,
    //   longitude: region.longitude,
    // });
    // console.log(add);
  };

  const onLocationSelected = async (
    data: GooglePlaceData,
    detail: GooglePlaceDetail | null = null
  ) => {
    // 'details' is provided when fetchDetails = true
    const location = await detail?.geometry.location;

    if (location?.lat && location?.lng) {
      const location_params = {
        name: data.description,
        latitude: location?.lat,
        longitude: location?.lng,
      };
      mapViewRef.current.animateToRegion({
        latitude: location?.lat,
        longitude: location?.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      setPlaceInfo(location_params);

      setMapInput(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={"padding"}
      contentContainerStyle={{
        height: "92%",
        paddingBottom: "40px",
      }}
      className="w-full h-[92%] bg-[#f2f5fa] rounded-t-3xl pt-5 px-8 overflow-hidden pb-12 flex-col"
    >
      <Box className="flex flex-col">
        <Text className="text-center text-3xl font-extrabold mb-4">
          New Task
        </Text>
        <Stack className="mb-6">
          <Text className="text-2xl mb-2">Area</Text>

          <MapView
            onLayout={() =>
              setPlaceStyle({
                // container: {
                textInput: {
                  marginTop: 10,
                  marginLeft: 20,
                  marginRight: 20,
                },
              })
            }
            className={`h-56 w-full ${mapInput ? "visible" : "hidden"}`}
            ref={mapViewRef}
            onRegionChange={onRegionChange}
            initialRegion={{
              latitude: 37.78825,
              longitude: -122.4324,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <GooglePlacesAutocomplete
              ref={completeRef}
              fetchDetails
              placeholder="Search"
              onPress={onLocationSelected}
              styles={placeStyle ? placeStyle : {}}
              query={{
                type: "administrative_area_level_1",
                key: process.env.GOOGLE_MAP_SDK,
                language: "en",
                // components: "country:cn",
              }}
            />
          </MapView>

          <Input
            ref={mapRef}
            onChangeText={(text) => (titleRef.current.context = text)}
            onFocus={() => {
              setMapInput(true);
              completeRef.current.focus();
            }}
            value={placeInfo?.name.split(",")[0]}
            className={`drop-shadow-xl rounded-xl bg-[#fff] py-3 px-3 text-[#447592] ${
              mapInput ? "hidden" : "visible"
            }`}
            placeholder="Input the area"
          ></Input>
        </Stack>

        <ScrollView className="flex-2">
          <Stack className="mb-6">
            <Text className="text-2xl mb-2">Title</Text>
            <Input
              ref={titleRef}
              onFocus={() => setMapInput(false)}
              onChangeText={(text) => (titleRef.current.context = text)}
              className="drop-shadow-xl rounded-xl bg-[#fff] py-3 px-3 text-[#447592]"
              placeholder="Input the title"
            ></Input>
          </Stack>
          <Stack className="mb-6">
            <Text className="text-2xl mb-2">Task</Text>
            <TextArea
              bg="#fff"
              color="#447592"
              ref={textAreaRef}
              autoCompleteType={undefined}
              onFocus={() => setMapInput(false)}
              placeholder="Describe your task detail"
              onChangeText={(text) => (textAreaRef.current.context = text)}
            ></TextArea>
          </Stack>
          <Stack className="mb-6">
            <Text className="text-2xl mb-2">Image</Text>
            <HStack>
              {imageList.length > 0 &&
                imageList.map((i, index) => (
                  <Image
                    className="w-20 h-20 mr-0.5"
                    key={index}
                    w="full"
                    h="full"
                    source={{
                      uri: i,
                    }}
                    alt="Demand Image"
                  />
                ))}
              <Pressable onPress={onUploadImage}>
                <View className="bg-white border border-gray-400 border-dashed h-20 w-20 flex items-center justify-center">
                  <MaterialIcons name="add" size={50} color="gray" />
                </View>
              </Pressable>
            </HStack>
          </Stack>
        </ScrollView>
      </Box>

      <Stack className="my-6" direction="row" justifyContent="space-between">
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
    </KeyboardAvoidingView>
  );
};

export default AddDemandTab;
