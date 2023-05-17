import {
  Box,
  Button,
  FormControl,
  Input,
  Stack,
  WarningOutlineIcon,
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
  const { register, signIn, resetPassword } = useAuth();

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
    <Box alignItems="center" justifyItems="center" className="bg-white">
      <Box w="100%" maxWidth="300px" h="100%" className="mt-32">
        <FormControl isRequired>
          <Box mx="4" flexDir="row" alignItems="center">
            <MaterialIcons name="mail" size={20} color="#447592" />

            <Input
              type="text"
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
          <Box
            mx="4"
            flexDir="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <MaterialIcons name="lock" size={20} color="#447592" />
            <Input
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

          <View className="flex flex-row justify-around bg-transparent mt-4">
            <Button isLoading={siupLoading} onPress={signUpForm}>
              Register
            </Button>

            <Button isLoading={loginLoading} onPress={LoginForm}>
              Login
            </Button>
          </View>
          <Button className="mt-20" isLoading={loginLoading} onPress={resetPWD}>
            reset password
          </Button>
        </FormControl>
      </Box>
    </Box>
  );
};

export default Sign;
