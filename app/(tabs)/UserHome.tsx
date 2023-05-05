import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { Box, Button, CheckIcon, HamburgerIcon, Menu, Select } from "native-base";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { View, StyleSheet, ImageBackground, ScrollView, Text, TouchableHighlight, Modal, TextInput, Pressable, TextInputBase } from "react-native";
import { gptAPI } from "../../utils/gpt";
import isJSON from "../../utils/isJSON";
import useIndexState from "../../store";
import useDemandState, { TDemand } from "../../store/demand";
import { useAxios } from "../../store/axios";
import useUser from "../../store/user";

const ProfileHeader = ({profile}: any) => {
  const { user } = useUser();
  const [status, setStatus] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(false);
  // const [demandStatus, setDemandStatus] = useState<TDemandStatus>("IDLE")
  const { demandStatus, setDemandStatus, setPendingDemand, pendingDemand, pushDemand } = useDemandState();
  const { instance } = useAxios();
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
    console.log(inputRef);
    setTimeout(() => {
      inputRef?.current?.focus();
    }, 5);
    // const {
    //   data,
    //   status
    // } = await axios.get("http://localhost:3001/auth");  

    // if(status === 200) {
    //   setStatus(data);
    // }

  }

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

      console.log(prompt.slice(0,10),'.... pendding to gpt,', );
      const context = getJSONFormatFromGPT(choices[0].message.content);
      console.log(prompt.slice(0,10),'.... response from gpt,', );
      
      return context;
      

    } catch (err) {
      console.log("errrrrrr", err);
    }
  }

  const postGPTAPI = async({nativeEvent}: any) => {
    // console.log(inputRef.current?.props);
    const { text } = nativeEvent;

    // setDemand(text);
    // setFetching(true);
    // setModalVisible(false);

    // return;    
    setDemandStatus("Pending");
    setModalVisible(false);
    console.log('pedding....')
    if(text.trim().length > 0) {
      try {
      
        setFetching(true);
        
        const requestData = await callOpenAI(text);
        
        console.log(requestData, '.!...!');
        setFetching(false);
        if(!requestData) return;
        
        setDemandStatus("Registed");
        const _demand = {
          ...requestData,
          userId: user?.id
        };

        await createDemand(_demand);

        pushDemand(_demand);
      } catch(error) {
        setFetching(false);
        
        setDemandStatus("Error");
      }
    }
  }

  const createDemand = async(demandInfo: string) => {
    console.log(demandInfo, 'demandInfo');
    const response = await instance?.post("/demand/create", demandInfo);
    console.log(response, '!@@@@');
  }

  const embeddingPrompt = (prompt: string) => `[${prompt}],帮我将上面[]里的文本梳理成下面的JSON对象：{ responseItem: { "Chinese": string,"English": string, "demandRole": string, categoryType: CategoryType }}; Additionnal notes_1: 该JSON对象的categoryType字段的取值只能为下列枚举类型之一: [ Social, Work, Home, Health, Shopping, Travel, Learning, Entertainment, Transportation, Finance]。请确保您返回的对象中，categoryType 字段的取值严格符合上述规定; Additional notes_2: demandRole: NEED(means you want something or to hire someone) | SERVER(means you can give or server something or find job) | FREE(other demand like find someone to play together or standup with someone)`
  
  
  console.log(user?.demands);
  return (
    <View style={styles.profileHeader}>   
      <TouchableHighlight>
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
        <Text style={styles.username}>{user?.id}</Text>
        {/* <Center> */}

        {/* </Center> */}

        <Box maxW="300">
          <Button size="xs" className="my-3 w-20" onPress={updateDemand}>添加需求</Button>

          <View className={`${user?.demands?.length! > 0 ? "visible": "hidden"}`}>
            <Select 
            minWidth="200"
            onValueChange={(value)=> { 
              setPendingDemand(user?.demands?.find(d => d.Chinese === value)!)
            }}
            selectedValue={"pendingDemand?.Chinese"} 
            accessibilityLabel="Choose Demand" 
            placeholder="Choose Demand" 
            _selectedItem={{
            bg: "teal.600",
            endIcon: <CheckIcon size="5" />
            }}>
            {
              user?.demands?.map((d, index)=> (
                <Select.Item className="text-gray-600" label={d.Chinese} value={d.Chinese} key={index}></Select.Item>
              ))
              }
            </Select>
          </View>
        </Box>
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
            <TextInput 
              ref={inputRef}
              onSubmitEditing={postGPTAPI}
              placeholder="Input your demand" 
              className="relative z-50 bg-white h-8 pl-3"></TextInput>
            {/* <Input 
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
              /> */}
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



`Social: including but not limited to finding partners, making friends, dating, social activities, etc.
Work: including but not limited to finding jobs, part-time jobs, internships, entrepreneurship, job-seeking, etc.
Home: including but not limited to home cleaning services, home repairs, home decoration, moving, etc.
Health: including but not limited to medical services, health care product purchases, fitness, physical examinations, etc.
Shopping: including but not limited to supermarket shopping, online shopping, second-hand transactions, rental, etc.
Travel: including but not limited to travel consultation, scenic spot recommendations, hotel reservations, transportation, etc.
Learning: including but not limited to subject tutoring, language training, skills training, exam preparation, etc.
Entertainment: including but not limited to movies, music, games, performances, etc.
Transportation: including but not limited to public transportation, taxis, designated drivers, self-driving rentals, etc.
Finance: including but not limited to banking services, investment management, insurance purchases, tax services, etc.`