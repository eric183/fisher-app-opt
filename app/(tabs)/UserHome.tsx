import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, ImageBackground, ScrollView, Text, TouchableHighlight, Modal, Button } from "react-native";

const ProfileHeader = ({profile}: any) => {
 
  const [status, setStatus] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  useEffect(()=>{
    // console.log(localStorage)
  },[]); 
  
  const updateDemand = async() => {
    setModalVisible(true);
    
    // const {
    //   data,
    //   status
    // } = await axios.get("http://localhost:3001/auth");  

    // if(status === 200) {
    //   setStatus(data);
    // }

  }

  return (
    <View style={styles.profileHeader}>
      <TouchableHighlight onPress={updateDemand}>
        <ImageBackground
          source={{ uri: 'https://picsum.photos/200/300' }}
          style={styles.profileImage}
        >
          <View style={styles.editProfileButton}>
            <MaterialIcons name="edit" size={20} color="#fff" />
          </View>
        </ImageBackground>
      </TouchableHighlight>
      <View style={styles.profileInfo} className="gogo flex flex-row">
        <Text style={styles.username}>{status}</Text>
        <Text style={styles.username}>{profile.username}</Text>
        <Text style={styles.followers}>
          {profile.followers} followers · {profile.following} following
        </Text>
        <Text style={styles.bio}>{profile.bio}</Text>
      </View>



      <Modal
        visible={modalVisible}
        animationType={"fade"}
        transparent={true}
      >
        
        <View style={styles.modal}>
          <TouchableHighlight style={styles.modalOverlay} onPress={()=> setModalVisible(false)}>
            <View></View>
          </TouchableHighlight>

          <View style={styles.modalContent}>
            <Text style={styles.text}>This is a modal.</Text>
            <Button
              title="Close"
              onPress={() => setModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const UserPosts = ({profile}: any) => {
  return (
    <View style={styles.postSection}>
      <ScrollView horizontal>
        {profile.posts.map((post: any )=> (
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
    username: 'sample_user',
    followers: 10000,
    following: 5000,
    bio: 'Just a sample user',
    posts: [
      { id: 1, uri: 'https://picsum.photos/200/300' },
      { id: 2, uri: 'https://picsum.photos/200/300' },
      { id: 3, uri: 'https://picsum.photos/200/300' },
    ],
  });

  return (
    <View style={styles.container}>
      <ProfileHeader profile={profile}/>
      <UserPosts profile={profile}/>
    </View>
  );
};

export default UserHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  editProfileButton: {
    backgroundColor: '#000',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 5,
    right: 5,
  },
  profileInfo: {
    marginLeft: 15,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  followers: {
    color: '#555',
    fontSize: 14,
    marginBottom: 5,
  },
  bio: {
    color: '#555',
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
    overflow: 'hidden',
  },
  postImage: {
    width: '100%',
    height: '100%',
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
    zIndex: 20
  },
  
  modal: {
    width: "100%",
    height: "100%",
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 10
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
});