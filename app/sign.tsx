import {
  Box,
  Button,
  FormControl,
  Input,
  Stack,
  WarningOutlineIcon,
  Text,
  PresenceTransition,
} from "native-base";
import * as Google from "expo-auth-session/providers/google";

import { View } from "../components/Themed";
import useAuth, { IRegister } from "../hooks/auth";
import { useLayoutEffect, useState } from "react";
import { useNavigation, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Alert } from "react-native";
import { set } from "lodash";
import { AvartarCard } from "../components/Card";
import { ISanityDocument } from "sanity-uploader/typing";
import uploadPhoto from "../utils/upload";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri } from "expo-auth-session";
WebBrowser.maybeCompleteAuthSession();

const Sign = () => {
  const [siupLoading, setSignLoading] = useState<boolean>(false);
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [pageIndex, setPageIndex] = useState<number>(0);

  const navigation = useNavigation();
  const {
    register,
    checkEmail,
    signIn,
    resetPassword,
    checkToken,
    sendEmailVerification,
  } = useAuth();

  const [formData, setFormData] = useState<IRegister>({
    email: "",
    password: "",
    username: "",
    avatar: "",
  });

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId:
      // "823168178672-f0h9frh08lb3k8knspigmthq0fcccfjs.apps.googleusercontent.com",
      "550771065328-4n6ifetk14ipohju31nph1f6uq5qft6u.apps.googleusercontent.com",
    // expoClientkey: "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",
    scopes: ["openid", "profile", "email"],
    iosClientId:
      "550771065328-4n6ifetk14ipohju31nph1f6uq5qft6u.apps.googleusercontent.com",
    // redirectUri: "com.erickuang.fisherappopt:/oauth2redirect/google",

    // redirectUri: makeRedirectUri({e
    //   scheme:
    //     // "expo-development-client/?url=https://u.expo.dev/86fa0b0f-8462-458c-a245-9198c618f45a?channel-name=preview",
    //     "leapqr",
    //   path: "redirect",
    // }),
  });

  const router = useRouter();

  const goInputUsername = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //邮箱
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)\S{8,}$/; //数字加字母

    // /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[,.:;?!'"-])\S{8,}$/; //数字加字母加标点符号
    // /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])\S{8,}$/; // 数字加字母加特殊字符
    // const _emailRegex = /^[a-zA-Z0-9._%_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; //

    if (!emailRegex.test(formData.email)) {
      Alert.alert("Invalid email format");
      return;
    }

    if (!passwordRegex.test(formData.password)) {
      Alert.alert(
        "Invalid password format",
        "Password must contain at least 8 characters, one uppercase, one lowercase and one number."
      );
      return;
    }

    try {
      const data = await checkEmail(formData.email);

      const pass = data?.data;

      setPageIndex(1);
    } catch (err: any) {
      Alert.alert("User already exists");
    }
  };

  const signUpForm = async () => {
    if (siupLoading) {
      return;
    }

    setSignLoading(true);

    const data = await register(formData);
    // await checkToken();
    setSignLoading(false);

    if (data?.data.access_token) {
      setPageIndex(2);
    }
  };

  const LoginForm = async () => {
    const data = await promptAsync();

    console.log(JSON.stringify(data));
    return;

    if (loginLoading) {
      return;
    }

    setLoginLoading(true);
    try {
      const response = await signIn(formData);
      if (response) {
        await checkToken();
        router.back();
      }
      // if(response)
    } catch (error: any) {
      Alert.alert(error.message);
      setLoginLoading(false);
    }
  };

  const resetPWD = async () => {
    const data = await resetPassword(formData.email, formData.password);

    if (data?.data.access_token) {
      router.replace("/");
    }
  };

  const onUploadPhoto = async () => {
    const document: ISanityDocument = await uploadPhoto();

    setFormData((state) => ({
      ...state,
      avatar: document.url,
    }));
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <Box
      alignItems="center"
      justifyItems="center"
      className="bg-[#F1F4F9] h-full w-full"
    >
      <Text className="text-7xl mt-56 mb-12">Leapqr</Text>
      {/* <FormControl isRequired className="w-full"> */}
      {pageIndex === 0 && (
        <>
          <Box
            flexDir="row"
            alignItems="center"
            className="flex w-full mb-4 px-2"
          >
            <View className="mr-3 bg-transparent">
              <MaterialIcons name="mail" size={22} color="#447592" />
            </View>

            <Input
              h="10"
              w="90%"
              rounded="md"
              bg="white"
              // className="bg-white ml-4 h-8"
              // type="text"
              autoCapitalize={"none"}
              placeholder="email"
              value={formData.email}
              onChange={(evt) => {
                setFormData((state) => ({
                  ...state,
                  email: evt.nativeEvent.text,
                }));
              }}
            />

            {/* sendEmailVerification */}
            {/* <Input h="10" w="50" /> */}
          </Box>

          <Box flexDir="row" alignItems="center" className="flex w-full px-2">
            <View className="mr-3 bg-transparent">
              <MaterialIcons
                className="mr-2"
                name="lock"
                size={22}
                color="#447592"
              />
            </View>
            <Input
              h="10"
              w="90%"
              rounded="md"
              bg="white"
              type="password"
              defaultValue="12345"
              placeholder="password"
              value={formData.password}
              onChange={(evt) => {
                setFormData((state) => ({
                  ...state,
                  password: evt.nativeEvent.text,
                }));
              }}
            />
            {/* <FormControl.HelperText>
              Must be atleast 6 characters.
            </FormControl.HelperText>
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              Atleast 6 characters are required.
            </FormControl.ErrorMessage> */}
          </Box>

          <View className="flex flex-row w-full justify-around bg-transparent mt-10">
            <Button
              className="w-[43%] rounded-xl bg-[#467493]  text-white font-extrabold text-lg"
              isLoading={siupLoading}
              onPress={goInputUsername}
            >
              Create Account
            </Button>

            <Button
              className="w-[43%] rounded-xl bg-[#FF924D] text-white font-extrabold text-lg"
              isLoading={loginLoading}
              onPress={LoginForm}
            >
              Login
            </Button>
          </View>
        </>
      )}
      {pageIndex === 1 && (
        <>
          <Box
            flexDir="row"
            alignItems="center"
            className="flex w-full mb-4 px-2"
          >
            <View className="mr-3 bg-transparent">
              <MaterialIcons name="person" size={22} color="#447592" />
            </View>

            <Input
              h="10"
              w="90%"
              rounded="md"
              bg="white"
              // className="bg-white ml-4 h-8"
              // type="text"
              placeholder="Input your name"
              value={formData.username}
              onChange={(evt) => {
                console.log(evt?.nativeEvent?.text, ",....username");
                setFormData((state) => ({
                  ...state,
                  username: evt?.nativeEvent?.text,
                }));
              }}
            />

            {/* sendEmailVerification */}
            {/* <Input h="10" w="50" /> */}
          </Box>

          <Box flexDir="row" alignItems="center" className="flex w-full px-2">
            <View className="mr-3 bg-transparent">
              <MaterialIcons name="image" size={22} color="#447592" />
            </View>
            <AvartarCard onUploadPhoto={onUploadPhoto} />
          </Box>

          <View className="flex flex-row w-full justify-around bg-transparent mt-10">
            <Button
              className="w-[43%] rounded-xl bg-[#467493]  text-white font-extrabold text-lg"
              isLoading={siupLoading}
              onPress={signUpForm}
            >
              Confirm
            </Button>
          </View>
        </>
      )}

      {pageIndex === 2 && (
        <View className="flex flex-col w-2/3 justify-around bg-transparent mt-10 h-1/2">
          <Text className="text-2xl font-extrabold text-gray text-center">
            Check your inbox
          </Text>

          <Text className="text-gray-700 text-center">
            Please check your link we sent to
            <Text className="font-semibold"> {formData.email} </Text>
            to finish your account setup
          </Text>
          <Button
            onPress={() => {
              router.replace("/");
              signIn(formData);
            }}
          >
            GO back to home
          </Button>
        </View>
      )}
    </Box>
  );
};

export default Sign;
