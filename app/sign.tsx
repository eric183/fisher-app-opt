import { Box, Button, FormControl, Input, Stack, WarningOutlineIcon } from "native-base";
import { View } from "../components/Themed"
import useAuth, { IRegister } from "../hooks/auth";
import { useState } from "react";
import { useRouter } from "expo-router";

const Sign = () => {
  const [loading, setLoading] = useState<boolean>(false);
  
  const { register, signIn } = useAuth();
  
  const [formData, setFormData] = useState<IRegister>({
    email: '',
    password: ''
  });

  const router = useRouter();
  
  const submitForm = async() => {

    if(loading) {
      return;
    }
    
    setLoading(true);
    const response = await register(formData);

    
    setLoading(false);

  }
 
  const LoginForm = async() => {

    if(loading) {
      return;
    }
    
    setLoading(true);
    try {
      const response = await signIn(formData);
      if (response) {
        router.back();
      }
      // if(response)
    } catch(error) {
      
      setLoading(false);
    }


  }

  return (
    <Box alignItems="center" justifyItems="center" className="bg-white mt-96">
      <Box w="100%" maxWidth="300px">
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
          <Stack mx="4">
            <Button 
            isLoading={loading}
            onPress={submitForm}>Register</Button>
          </Stack>
          <Stack mx="4" my="5">
            <Button 
            // isLoading={loading}
            onPress={LoginForm}>Login</Button>
          </Stack>
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