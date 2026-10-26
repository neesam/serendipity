import { Drawer, DrawerContentScrollView, DrawerItem } from "expo-router/drawer";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";

// Each entry drives one drawer item. `match` lists the pathnames that should
// highlight the item (usePathname strips group names like "(drawer)").
const ITEMS = [
    {
        label: "Content fetcher",
        icon: "star-sharp",
        href: "/(drawer)/(content_fetcher_tabs)/album",
        match: ["/album", "/book", "/film", "/game", "/show"],
    },
    {
        label: "Add to table",
        icon: "add-sharp",
        href: "/(drawer)/addToTable",
        match: ["/addToTable"],
    },
    {
        label: "Fetch counts",
        icon: "grid-outline",
        href: "/(drawer)/fetchCounts",
        match: ["/fetchCounts"],
    },
    {
        label: "Finished content",
        icon: "checkmark-sharp",
        href: "/(drawer)/(finished_content_tabs)/finishedContentAlbum",
        match: [
            "/finishedContentAlbum",
            "/finishedContentBook",
            "/finishedContentFilm",
            "/finishedContentShow",
        ],
    },
];

const CustomDrawerContent = (props) => {
    const router = useRouter();
    const pathName = usePathname();

    return (
        <DrawerContentScrollView {...props}>
            {ITEMS.map((item) => {
                const active = item.match.includes(pathName);
                return (
                    <DrawerItem
                        key={item.label}
                        icon={() => (
                            <Ionicons
                                name={item.icon}
                                color={active ? "white" : "black"}
                                size={20}
                            />
                        )}
                        label={item.label}
                        labelStyle={{ color: active ? "white" : "black" }}
                        style={{ backgroundColor: active ? "#333" : "white" }}
                        onPress={() => {
                            router.navigate(item.href);
                            props.navigation.closeDrawer();
                        }}
                    />
                );
            })}
        </DrawerContentScrollView>
    );
};

export default function DrawerLayout() {
    return (
        <Drawer
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{ headerShown: false }}
        >
            {/* SDK 58: every drawer child must be declared, using the
                group folder names for the two tab groups. */}
            <Drawer.Screen
                name="(content_fetcher_tabs)"
                options={{ title: "Content fetcher" }}
            />
            <Drawer.Screen
                name="addToTable"
                options={{ headerShown: true, headerTitle: "Add to table" }}
            />
            <Drawer.Screen
                name="fetchCounts"
                options={{ headerShown: true, headerTitle: "Fetch counts" }}
            />
            <Drawer.Screen
                name="(finished_content_tabs)"
                options={{ title: "Finished content" }}
            />
        </Drawer>
    );
}