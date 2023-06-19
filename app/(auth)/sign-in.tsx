import { Text, View } from "react-native";
import useAuth from "../../hooks/auth";

export default function SignIn() {
  const { signIn, signOut } = useAuth();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text
        onPress={() =>
          signIn({
            email: "",
            password: "",
          })
        }
      >
        Sign In
      </Text>
    </View>
  );
}
