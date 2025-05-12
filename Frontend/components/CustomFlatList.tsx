import {
    View,
    Text,
    StyleSheet,
    Image,
    FlatList,
    TouchableOpacity,
} from "react-native";

interface ItemType {
    image_url: string;
    album_name: string;
    artist_name: string;
    poster_path?: string;
    poster_url?: string;
    title: string;
    id: string;
}

interface CustomFlatListTypes {
    openLink: (title: string, type: string) => void;
    data: ItemType[];
    type: string;
}

export default function CustomFlatList({
    openLink,
    data,
    type,
}: CustomFlatListTypes) {
    return (
        <FlatList
            data={data}
            renderItem={({ item }) => {
                return (
                    <View style={flatlistStyles.itemContainer}>
                        {type === "album" ? (
                            <>
                                <Image
                                    style={flatlistStyles.image}
                                    source={{ uri: item.image_url }}
                                    resizeMode="contain"
                                />
                                <TouchableOpacity
                                    onPress={() =>
                                        openLink(item.album_name, type)
                                    }
                                >
                                    <Text style={flatlistStyles.contentName}>
                                        {item.album_name}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() =>
                                        openLink(item.artist_name, type)
                                    }
                                >
                                    <Text style={flatlistStyles.creator}>
                                        {item.artist_name}
                                    </Text>
                                </TouchableOpacity>
                            </>
                        ) : type === "film" ? (
                            <>
                                <Image
                                    key={item.poster_path}
                                    style={flatlistStyles.image}
                                    source={{ uri: item.poster_path }}
                                    resizeMode="contain"
                                />
                                <TouchableOpacity
                                    onPress={() => openLink(item.title, type)}
                                >
                                    <Text style={flatlistStyles.contentName}>
                                        {item.title}
                                    </Text>
                                </TouchableOpacity>
                            </>
                        ) : type === "show" ? (
                            <>
                                <Image
                                    key={item.poster_url}
                                    style={flatlistStyles.image}
                                    source={{ uri: item.poster_url }}
                                    resizeMode="contain"
                                />
                                <TouchableOpacity
                                    onPress={() => openLink(item.title, type)}
                                >
                                    <Text style={flatlistStyles.contentName}>
                                        {item.title}
                                    </Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                <Image
                                    key={item.poster_path}
                                    style={flatlistStyles.image}
                                    source={{ uri: item.poster_path }}
                                    resizeMode="contain"
                                />
                                <TouchableOpacity
                                    onPress={() => openLink(item.title, type)}
                                >
                                    <Text style={flatlistStyles.contentName}>
                                        {item.title}
                                    </Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                );
            }}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
        />
    );
}

const flatlistStyles = StyleSheet.create({
    itemContainer: {
        width: "100%",
        padding: 16,
        marginBottom: 16,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    image: {
        height: 350,
        width: 350,
        borderRadius: 8,
        marginBottom: 10,
        maxWidth: "90%",
    },
    contentName: {
        fontWeight: "bold",
        fontSize: 16,
        alignSelf: "flex-start",
    },
    creator: {
        color: "#666",
        alignSelf: "flex-start",
        marginTop: 5,
    },
});
