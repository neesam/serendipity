import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { DrawerToggleButton } from "@react-navigation/drawer";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#ffd33d",
        headerShown: true,
        tabBarStyle: {
          backgroundColor: "#25292e",
        },
        headerLeft: () => <DrawerToggleButton />,
      }}
    >
      <Tabs.Screen
        name="album"
        options={{
          title: "Album",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "musical-notes-sharp" : "musical-notes-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="film"
        options={{
          title: "Film",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "film-sharp" : "film-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="show"
        options={{
          title: "Show",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "tv-sharp" : "tv-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="book"
        options={{
          title: "Book",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "book-sharp" : "book-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}
