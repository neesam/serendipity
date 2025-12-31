import { Drawer } from "expo-router/drawer";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { usePathname } from "expo-router";
import { useEffect } from "react";

const CustomDrawerContent = (props) => {
    const pathName = usePathname();

    useEffect(() => {
        console.log(pathName);
    }, [pathName]);

    return (
        <DrawerContentScrollView {...props}>
            <DrawerItem
                icon={() => (
                    <Ionicons
                        name={"star-sharp"}
                        color={pathName === "/album" ? "white" : "black"}
                        size={20}
                    />
                )}
                label={"Content fetcher"}
                labelStyle={{ color: pathName === "/album" ? "white" : "black" }}
                style={{ backgroundColor: pathName === "/album" ? "#333" : "white" }}
                onPress={() => {
                    router.push("/(drawer)/(content_fetcher_tabs)/album");
                }}
            />
            <DrawerItem
                icon={() => (
                    <Ionicons
                        name={"add-sharp"}
                        color={pathName === "/addToTable" ? "white" : "black"}
                        size={20}
                    />
                )}
                label={"Add to table"}
                labelStyle={{ color: pathName === "/addToTable" ? "white" : "black" }}
                style={{
                    backgroundColor: pathName === "/addToTable" ? "#333" : "white",
                }}
                onPress={() => {
                    router.push("/(drawer)/addToTable");
                }}
            />
            <DrawerItem
                icon={() => (
                    <Ionicons
                        name={"checkmark-sharp"}
                        color={pathName === "/finishedContentAlbum" ? "white" : "black"}
                        size={20}
                    />
                )}
                label={"Finished content"}
                labelStyle={{
                    color: pathName === "/finishedContentAlbum" ? "white" : "black",
                }}
                style={{
                    backgroundColor:
                        pathName === "/finishedContentAlbum" ? "#333" : "white",
                }}
                onPress={() => {
                    router.push("/(drawer)/(finished_content_tabs)/finishedContentAlbum");
                }}
            />
        </DrawerContentScrollView>
    );
};

export default function _layout() {
    return (
        <Drawer
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{ headerShown: false }}
        >
            <Drawer.Screen
                name="addToTable"
                options={{ headerShown: true, headerTitle: "Add to table" }}
            />
            <Drawer.Screen
                name="finishedContentAlbum"
                options={{ headerShown: true, headerTitle: "Finished content" }}
            />
        </Drawer>
    );
}
