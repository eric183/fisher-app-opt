import { Box, Button, FormControl, Input, Stack, WarningOutlineIcon } from "native-base";
import { View } from "../components/Themed"
import useAuth, { IRegister } from "../hooks/auth";
import { useState } from "react";
import { useRouter } from "expo-router";

const Sign = () => {
  const [siupLoading, setSignLoading] = useState<boolean>(false);
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  
  const { register, signIn, resetPassword } = useAuth();
  
  const [formData, setFormData] = useState<IRegister>({
    email: '',
    password: ''
  });

  const router = useRouter();
  
  const signUpForm = async() => {

    if(siupLoading) {
      return;
    }
    
    setSignLoading(true);

    const data = await register(formData);
    
    setSignLoading(false);

    if(data?.data.access_token) {
      router.replace("/")
    }
  }
 
  const LoginForm = async() => {

    if(loginLoading) {
      return;
    }
    
    setLoginLoading(true);
    try {
      const response = await signIn(formData);
      if (response) {
        router.back();
      }
      // if(response)
    } catch(error) {
      
      setLoginLoading(false);
    }


  }

  const resetPWD = async() => {
    const data = await resetPassword(formData.email, formData.password)

    if(data?.data.access_token) {
      router.replace('/');
    }


  }

  return (
    <Box alignItems="center" justifyItems="center" className="bg-white">
      <Box w="100%" maxWidth="300px" h="100%" className="mt-32">
        <FormControl isRequired>
          <Stack mx="4">
            <FormControl.Label>Email</FormControl.Label>
            <Input type="text" placeholder="email" value={formData.email} 
              onChange={(evt)=> {
                setFormData(state=> ({
                  ...state,
                  email: evt.nativeEvent.text
                }))
              }}
            />
            <FormControl.HelperText>
              Must be atleast 6 characters.
            </FormControl.HelperText>
            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
              Atleast 6 characters are required.
            </FormControl.ErrorMessage>
          </Stack>
          <Stack mx="4">
            <FormControl.Label>Password</FormControl.Label>
            <Input type="password" defaultValue="12345" placeholder="password" value={formData.password} 
              onChange={(evt)=> {
                setFormData(state=> ({
                  ...state,
                  password: evt.nativeEvent.text
                }))
              }}
            />
            <FormControl.HelperText>
              Must be atleast 6 characters.
            </FormControl.HelperText>
            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
              Atleast 6 characters are required.
            </FormControl.ErrorMessage>
          </Stack>

          <View className="flex flex-row justify-around bg-transparent mt-4">
            <Button 
              isLoading={siupLoading}
              onPress={signUpForm}>Register</Button>

            <Button 
              isLoading={loginLoading}
              onPress={LoginForm}>Login</Button>
          </View>
          <Button 
            className="mt-20"
            isLoading={loginLoading}
            onPress={resetPWD}>reset password</Button>
        </FormControl>
      </Box>
    </Box>
 
  )
}

export default Sign;


// <View>
// {/* <Input type="text" placeholder="Input email" className="text-white"></Input>
// <Input type="password" placeholder="Input password" className="text-white"></Input>

// <Button onPress={registerHandler}>Register</Button> */}

// <Box alignItems="center">
//   <Box w="100%" maxWidth="300px">
//     <FormControl isRequired>
//       <Stack mx="4">
//         <FormControl.Label>Password</FormControl.Label>
//         <Input type="password" defaultValue="12345" placeholder="password" />
//         <FormControl.HelperText>
//           Must be atleast 6 characters.
//         </FormControl.HelperText>
//         <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
//           Atleast 6 characters are required.
//         </FormControl.ErrorMessage>
//       </Stack>
//     </FormControl>
//   </Box>
// </Box>

// </View>