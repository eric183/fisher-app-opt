import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Stack, Tabs } from "expo-router";
import { Pressable, useColorScheme } from "react-native";
import { Text, View } from "react-native";
import Colors from "../../constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import { Component } from "react";
import AddDemandTab from "../../components/AddDemandTab";

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const common_tab_style = {
    tabBarShowLabel: false,
  };

  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          ...common_tab_style,
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <MaterialIcons
                name="badge"
                size={28}
                color="#447592"
              ></MaterialIcons>
            ) : (
              <MaterialIcons
                name="badge"
                size={28}
                color="#999"
              ></MaterialIcons>
            ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="MatchHistory"
        options={{
          ...common_tab_style,
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <MaterialIcons
                name="source"
                size={28}
                color="#447592"
              ></MaterialIcons>
            ) : (
              <MaterialIcons
                name="source"
                size={28}
                color="#999"
              ></MaterialIcons>
            ),
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="AddDemand"
        options={{
          ...common_tab_style,
          tabBarButton: (props) => <AddDemandTab {...props} />,
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="add" size={35} color="#fff"></MaterialIcons>
          ),
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="ChatHistory"
        options={{
          ...common_tab_style,
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <MaterialIcons
                name="chat"
                size={28}
                color="#447592"
              ></MaterialIcons>
            ) : (
              <MaterialIcons name="chat" size={28} color="#999"></MaterialIcons>
            ),
          headerShown: false,
          headerRight: () => (
            <Link href="/sign" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color="#447592"
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />

      <Tabs.Screen
        name="Contact"
        options={{
          ...common_tab_style,
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <MaterialIcons
                name="group"
                size={28}
                color="#447592"
              ></MaterialIcons>
            ) : (
              <MaterialIcons
                name="group"
                size={28}
                color="#999"
              ></MaterialIcons>
            ),
          headerShown: false,
          headerRight: () => (
            <Link href="/sign" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color="#447592"
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
    </Tabs>
  );
}

const TextComponent = () => {
  return (
    <View>
      <Text>jih</Text>
    </View>
  );
};

// <Tabs
//       screenOptions={{
//         tabBarLabelStyle: {
//           color: 'pink',
//         },
//         tabBarStyle: {
//           backgroundColor: '#fff',
//           borderTopColor: "#BABABA"
//         },
//         tabBarActiveTintColor: "red",
//         // tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
//       }}>
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: '',
//           tabBarIcon: ({ color }) => <MaterialIcons name="badge" size={20} color="#447592"></MaterialIcons>,
//           headerRight: () => (
//             <Link href="/sign" asChild>
//               <Pressable>
//                 {({ pressed }) => (
//                   <FontAwesome
//                     name="info-circle"
//                     size={25}
//                     // color={Colors[colorScheme ?? 'light'].text}
//                     color="#447592"
//                     style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
//                   />
//                 )}
//               </Pressable>
//             </Link>
//           ),
//         }}
//       />

//       <Tabs.Screen
//         name=""
//         options={{
//           title:"",
//           tabBarIcon: ({ color }) => <MaterialIcons name="badge" size={20} color="#447592"></MaterialIcons>
//         }}
//       />

//       <Tabs.Screen
//         name="UserHome"
//         options={{
//           title: '',
//           tabBarIcon: ({ color }) => <MaterialIcons name="group" size={20} color="#BABABA"></MaterialIcons>,
//         }}
//       />
//     </Tabs>
