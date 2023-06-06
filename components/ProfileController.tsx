import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable } from "react-native";

const ProfileController = ({ size = 24, color = "#fff" }) => {
  const router = useRouter();
  return (
    <Pressable
      style={{
        position: "absolute",
        right: 40,
      }}
      onPress={() => {
        router.push("/Settings");
      }}
    >
      <MaterialIcons name="settings" color={color} size={size} />
    </Pressable>
  );
};

export default ProfileController;
