import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { Button, Input } from "native-base";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { View, StyleSheet, ImageBackground, ScrollView, Text, TouchableHighlight, Modal, TextInput } from "react-native";
import { gptAPI } from "../../utils/gpt";
import isJSON from "../../utils/isJSON";
import useIndexState from "../../store";
import useDemandState from "../../store/demand";

const ProfileHeader = ({profile}: any) => {
 
  const [status, setStatus] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(false);
  // const [demandStatus, setDemandStatus] = useState<TDemandStatus>("IDLE")
  const { demandStatus, setDemandStatus } = useDemandState();
  const inputRef = useRef<TextInput>();


  const handleInputChange = useCallback((evt: any)=> {
    inputRef.current?.setNativeProps({
      text: evt.nativeEvent.text
    })
  }, [])

  useEffect(()=>{
    console.log(process.env.CHATGPT_PLUS_API_TOKEN, '...')
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

  const callOpenAI = async (value: string) => {
    
    const prompt = value.trim();

    try {
    
      const {
        choices,
        created,
        id,
        model,
        object,
        usage
      } = await gptAPI(embeddingPrompt(prompt))
      
      const context = getJSONFormatFromGPT(choices[0].message.content);
      
      return JSON.stringify(context);
      

    } catch (err) {
      console.log("errrrrrr", err);
    }
  };

  const getJSONFormatFromGPT = (str: string) => {
    
    if(isJSON(str)) {
      return JSON.parse(str).responseItem;
    }
    const regex = /\{.*\}/; // 匹配 {} 中的内容
    const match = str.match(regex) // 匹配结果为数组，取第一个元素
    if(!match) {
      console.log("error", match);
      return;
    }
    
    const obj = JSON.parse(match[0]); // 将匹配到的字符串转换为对象

    console.log(obj.responseItem); // 输出对象的 responseItem 属性
  }

  const postGPTAPI = async({nativeEvent}: any) => {
    // console.log(inputRef.current?.props);
    const { text } = nativeEvent;

    // setDemand(text);
    // setFetching(true);
    // setModalVisible(false);

    // return;    
    setDemandStatus("Pending");

  
    if(text.trim().length > 0) {
      try {
      
        setFetching(true);
        
        const requestData = await callOpenAI(text);
        
        console.log(requestData);
        setFetching(false);
        setModalVisible(false);
        setDemandStatus("Registed");
      } catch(error) {
        setFetching(false);
        setModalVisible(false);
        setDemandStatus("Error");
      }
    }
  }

  const embeddingPrompt = (prompt: string) => `[${prompt}],帮我将上面[]里的文本梳理成下面的JSON数据：{ responseItem: { "REQUEST IN CHINESE": "","REQUEST IN English": "","demanType": 0,}}; Additional notes: demanType: wanted(means you want something or to hire someone) | server(means you can give or server something or find job) | common(other demand like find someone to play together or standup with someone)`
  
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
      <View className="ml-4">
        <Text style={styles.username}>{status}</Text>
        <Text style={styles.username}>{profile.username}</Text>
        
        <Text style={styles.bio}>{demandStatus}</Text>
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

            <Input 
              blurOnSubmit
              keyboardType="phone-pad"
              ref={inputRef}
              onSubmitEditing={postGPTAPI}
              // onChange={handleInputChange}
              // onEndEditing={postGPTAPI}
              className="p-3"
              shadow={2}  
              placeholder="Input your demand"
              _light={{
                bg: "coolGray.100",
                _hover: {
                  bg: "coolGray.200"
                },
                _focus: {
                  bg: "coolGray.200:alpha.70"
                }
              }} 
              _dark={{
                bg: "coolGray.800",
                _hover: {
                  bg: "coolGray.900"
                },
                _focus: {
                  bg: "coolGray.900:alpha.70"
                }
              }} 
              />
            {/* <Button
              className="mt-10"
              isLoading={fetching}
              onPress={postGPTAPI}
            >Change</Button> */}
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
    zIndex: 20,
    minWidth: "30%"
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