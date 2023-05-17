import {
  Box,
  Button,
  FormControl,
  Input,
  Stack,
  WarningOutlineIcon,
  Text,
} from "native-base";
import { View } from "../components/Themed";
import useAuth, { IRegister } from "../hooks/auth";
import { useLayoutEffect, useState } from "react";
import { useNavigation, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

const Sign = () => {
  const [siupLoading, setSignLoading] = useState<boolean>(false);
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const navigation = useNavigation();
  const { register, signIn, resetPassword, checkToken } = useAuth();

  const [formData, setFormData] = useState<IRegister>({
    email: "",
    password: "",
  });

  const router = useRouter();

  const signUpForm = async () => {
    if (siupLoading) {
      return;
    }

    setSignLoading(true);

    const data = await register(formData);
    await checkToken();
    setSignLoading(false);

    if (data?.data.access_token) {
      router.replace("/");
    }
  };

  const LoginForm = async () => {
    if (loginLoading) {
      return;
    }

    setLoginLoading(true);
    try {
      const response = await signIn(formData);
      await checkToken();
      if (response) {
        router.back();
      }
      // if(response)
    } catch (error) {
      setLoginLoading(false);
    }
  };

  const resetPWD = async () => {
    const data = await resetPassword(formData.email, formData.password);

    if (data?.data.access_token) {
      router.replace("/");
    }
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
      <Box mx="12" flexDir="row" alignItems="center" className="flex mb-4">
        <View className="mr-3 bg-transparent">
          <MaterialIcons name="mail" size={22} color="#447592" />
        </View>

        <Input
          h="10"
          w="full"
          rounded="md"
          bg="white"
          // className="bg-white ml-4 h-8"
          // type="text"
          placeholder="email"
          value={formData.email}
          onChange={(evt) => {
            setFormData((state) => ({
              ...state,
              email: evt.nativeEvent.text,
            }));
          }}
        />
      </Box>
      <Box mx="12" flexDir="row" alignItems="center" className="flex">
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
          w="full"
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
          onPress={signUpForm}
        >
          Sign Up
        </Button>

        <Button
          className="w-[43%] rounded-xl bg-[#FF924D] text-white font-extrabold text-lg"
          isLoading={loginLoading}
          onPress={LoginForm}
        >
          Login
        </Button>
      </View>
      {/* <Button className="mt-20" isLoading={loginLoading} onPress={resetPWD}>
          reset password
        </Button> */}
      {/* </FormControl> */}
    </Box>
  );
};

export default Sign;
