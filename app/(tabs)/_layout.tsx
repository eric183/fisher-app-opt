import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable, useColorScheme } from 'react-native';

import Colors from '../../constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs  
      screenOptions={{
        tabBarLabelStyle: {
          color: 'pink',
        },
        tabBarStyle: {
          backgroundColor: '#F4FBFF',
          borderTopColor: "#BABABA"
        },
        tabBarActiveTintColor: "red",
        // tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <MaterialIcons name="badge" size={20} color="#000"></MaterialIcons>,
          headerRight: () => (
            <Link href="/sign" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    // color={Colors[colorScheme ?? 'light'].text}
                    color="#000"
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="UserHome"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <MaterialIcons name="group" size={20} color="#BABABA"></MaterialIcons>,
        }}
      />
    </Tabs>
  );
}
