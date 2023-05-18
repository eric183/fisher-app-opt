import { MaterialIcons } from "@expo/vector-icons";
import { Box, CheckIcon, Select } from "native-base";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Text,
  TouchableHighlight,
  TextInput,
} from "react-native";
import { useAxios } from "../store/axios";
import useDemands, { TDemand } from "../store/demand";
import useUser from "../store/user";
import useRequest from "../hooks/request";

const ProfileHeader = ({ profile }: any) => {
  const { user, setUser } = useUser();
  const [status, setStatus] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const {
    demandStatus,
    setDemandStatus,
    setPendingDemand,
    pendingDemand,
    pushDemand,
  } = useDemands();

  const [showTextInput, setShowTextInput] = useState<boolean>(false);

  const { instance } = useAxios();
  const inputRef = useRef<TextInput>(null!);
  const nameInput = useRef<TextInput>(null!);

  const handleInputChange = useCallback((evt: any) => {
    inputRef.current?.setNativeProps({
      text: evt.nativeEvent.text,
    });
  }, []);

  const updateDemand = async () => {
    setModalVisible(true);
    console.log(inputRef);
    setTimeout(() => {
      inputRef?.current?.focus();
    }, 5);
  };

  const usernameBinder = async ({ nativeEvent }: any) => {
    setShowTextInput(false);
    console.log(nativeEvent.text);

    instance?.patch(`/users/${user?.id}/usename`, {
      username: nativeEvent.text,
    });
  };

  return (
    <Box style={styles.profileHeader} safeAreaTop>
      <TouchableHighlight>
        <ImageBackground
          source={{ uri: "https://picsum.photos/200/300" }}
          style={styles.profileImage}
        >
          <View style={styles.editProfileButton}>
            <MaterialIcons name="edit" size={20} color="#fff" />
          </View>
        </ImageBackground>
      </TouchableHighlight>
      <View className="ml-4">
        <Text style={styles.username} className="mb-2">
          {status}
        </Text>
        <TextInput
          ref={nameInput}
          className={`${showTextInput ? "visible" : "hidden"}`}
          defaultValue={user?.username ? user.username : user?.id.toString()}
          onSubmitEditing={usernameBinder}
        ></TextInput>

        <TouchableHighlight
          onPress={() => {
            setTimeout(() => {
              nameInput?.current?.focus();
            }, 0);
            setShowTextInput(true);
          }}
        >
          <Text
            className={`${showTextInput ? "hidden" : "visible"}`}
            style={styles.username}
          >
            {user && (user.username ? user.username : user.id)}
          </Text>
        </TouchableHighlight>

        <Box maxW="300">
          <View
            className={`${
              user?.demands && user.demands.length > 0 ? "visible" : "hidden"
            }`}
          >
            <Select
              minWidth="200"
              onValueChange={(value) => {
                setPendingDemand(
                  user?.demands?.find(
                    (d) => d.Chinese === value
                  ) as unknown as TDemand
                );
              }}
              selectedValue={"pendingDemand?.Chinese"}
              accessibilityLabel="Choose Demand"
              placeholder="Choose Demand"
              _selectedItem={{
                bg: "teal.600",
                endIcon: <CheckIcon size="5" />,
              }}
            >
              {user?.demands?.map((d, index) => (
                <Select.Item
                  className="text-gray-600"
                  label={d.Chinese}
                  value={d.Chinese}
                  key={index}
                ></Select.Item>
              ))}
            </Select>
          </View>
        </Box>
      </View>
    </Box>
  );
};

const UserPosts = ({ profile }: any) => {
  return (
    <View style={styles.postSection}>
      <ScrollView horizontal>
        {profile.posts.map((post: any) => (
          <View key={post.id} style={styles.postContainer}>
            <ImageBackground
              source={{ uri: post.uri }}
              style={styles.postImage}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const UserHome = () => {
  const [profile, setProfile] = useState({
    username: "sample_user",
    followers: 10000,
    following: 5000,
    bio: "Just a sample user",
    posts: [
      { id: 1, uri: "https://picsum.photos/200/300" },
      { id: 2, uri: "https://picsum.photos/200/300" },
      { id: 3, uri: "https://picsum.photos/200/300" },
    ],
  });

  return (
    <View style={styles.container}>
      <ProfileHeader profile={profile} />
      <UserPosts profile={profile} />
    </View>
  );
};

export default UserHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  editProfileButton: {
    backgroundColor: "#000",
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 5,
    right: 5,
  },
  profileInfo: {
    marginLeft: 15,
  },
  username: {
    fontWeight: "bold",
    fontSize: 20,
  },
  followers: {
    color: "#555",
    fontSize: 14,
    marginBottom: 5,
  },
  bio: {
    color: "#555",
    fontSize: 14,
  },
  postSection: {
    flex: 1,
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  postContainer: {
    marginRight: 10,
    width: 120,
    height: 120,
    borderRadius: 10,
    overflow: "hidden",
  },
  postImage: {
    width: "100%",
    height: "100%",
  },

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

function getDemansJSON() {
  return [];
}

`Social: including but not limited to finding partners, making friends, dating, social activities, etc.
Work: including but not limited to finding jobs, part-time jobs, internships, entrepreneurship, job-seeking, etc.
Home: including but not limited to home cleaning services, home repairs, home decoration, moving, etc.
Health: including but not limited to medical services, health care product purchases, fitness, physical examinations, etc.
Shopping: including but not limited to supermarket shopping, online shopping, second-hand transactions, rental, etc.
Travel: including but not limited to travel consultation, scenic spot recommendations, hotel reservations, transportation, etc.
Learning: including but not limited to subject tutoring, language training, skills training, exam preparation, etc.
Entertainment: including but not limited to movies, music, games, performances, etc.
Transportation: including but not limited to public transportation, taxis, designated drivers, self-driving rentals, etc.
Finance: including but not limited to banking services, investment management, insurance purchases, tax services, etc.`;
