import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { DrawerToggleButton } from '@react-navigation/drawer'

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#ffd33d',
                headerShown: true,
                tabBarStyle: {
                    backgroundColor: '#25292e'
                },
                headerLeft: () => <DrawerToggleButton/>
            }}
        >
            <Tabs.Screen
                name="finishedContentAlbum"
                options={{
                    title: 'Finished albums',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'musical-notes-sharp' : 'musical-notes-outline'} color={color} size={24}/>
                    )
                }}
            />
            <Tabs.Screen
                name="finishedContentFilm"
                options={{
                    title: 'Finished films',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'tv-sharp' : 'tv-outline'} color={color} size={24}/>
                    )
                }}
            />
        </Tabs>
    )
}