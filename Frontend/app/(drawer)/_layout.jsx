import { Drawer } from 'expo-router/drawer'
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { usePathname } from 'expo-router'
import { useEffect } from 'react'

const CustomDrawerContent = (props) => {

  const pathName = usePathname()

  useEffect(() => {
    console.log(pathName)
  }, [pathName])

  return (
    <DrawerContentScrollView {...props} >
      <DrawerItem
        icon={({ color, size }) => (
          <Ionicons
            name={'musical-notes-sharp'}
            color={pathName === '/album' ? 'white' : 'black'}
            size={20}/>
        )}
        label={'Album'}
        labelStyle={{color: pathName === '/album' ? 'white' : 'black'}}
        style={{ backgroundColor: pathName === '/album' ? '#333' : 'white'}}
        onPress={() => {
          router.push('/(drawer)/(tabs)/album')
        }}
      />
      <DrawerItem
        icon={({ color, size }) => (
          <Ionicons
            name={'film-sharp'}
            color={pathName === '/film' ? 'white' : 'black'}
            size={20}
          />
        )}
        label={'Film'}
        labelStyle={{color: pathName === '/film' ? 'white' : 'black'}}
        style={{ backgroundColor: pathName === '/film' ? '#333' : 'white'}}
        onPress={() => {
          router.push('/(drawer)/(tabs)/film')
        }}
      />
      <DrawerItem
        icon={({ color, size }) => (
          <Ionicons
            name={'tv-sharp'}
            color={pathName === '/show' ? 'white' : 'black'}
            size={20}
          />
        )}
        label={'Show'}
        labelStyle={{color: pathName === '/show' ? 'white' : 'black'}}
        style={{ backgroundColor: pathName === '/show' ? '#333' : 'white'}}
        onPress={() => {
          router.push('/(drawer)/(tabs)/show')
        }}
      />
      <DrawerItem
        icon={({ color, size }) => (
          <Ionicons
            name={'book-sharp'}
            color={pathName === '/book' ? 'white' : 'black'}
            size={20}
          />
        )}
        label={'Book'}
        labelStyle={{color: pathName === '/book' ? 'white' : 'black'}}
        style={{ backgroundColor: pathName === '/book' ? '#333' : 'white'}}
        onPress={() => {
          router.push('/(drawer)/(tabs)/book')
        }}
      />
    </DrawerContentScrollView>
  )
}

export default function _layout() {
  return (
    <Drawer drawerContent={(props) => <CustomDrawerContent {...props}/>} screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="album" options={{headerShown: true}}/>
      <Drawer.Screen name="index" options={{headerShown: true}}/>
    </Drawer>
  )
}