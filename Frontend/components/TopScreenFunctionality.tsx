import {
    View,
    Pressable,
    ViewStyle,
    StyleProp,
    GestureResponderEvent,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import TablesModalAndButton from "./TablesModalAndButton";
import { openRYM } from "@/utils/openLink";

interface TopScreenFunctionalityTypes {
    containerStyles: StyleProp<ViewStyle>;
    tables: string[];
    getFromSpecificTable: (input: string) => Promise<void>;
    addToQueue: (event: GestureResponderEvent) => void;
    createStremioOutput: (event: GestureResponderEvent) => void;
    type: string;
    contentName: string;
}

const TopScreenFunctionality = ({
    containerStyles,
    tables,
    getFromSpecificTable,
    addToQueue,
    createStremioOutput,
    type,
    contentName,
}: TopScreenFunctionalityTypes) => {
    return (
        <>
            <View style={containerStyles!.topLeftCornerContainer}>
                <TablesModalAndButton
                    tables={tables}
                    setEntry={getFromSpecificTable}
                    name={"table"}
                />
            </View>
            <View style={containerStyles!.topRightCornerContainer}>
                {type === "film" ? (
                    <Pressable
                        style={{
                            borderColor: "black",
                            borderWidth: 1,
                            borderRadius: 5,
                            padding: 10,
                        }}
                        onPress={createStremioOutput}
                    >
                        <Ionicons name={"document"} size={20} />
                    </Pressable>
                ) : (
                    <></>
                )}
                {type === "album" && contentName !== "" ? (
                    <Pressable
                        style={{
                            borderColor: "black",
                            borderWidth: 1,
                            borderRadius: 5,
                            padding: 10,
                        }}
                        onPress={() => openRYM(contentName)}
                    >
                        <Ionicons name={"star"} size={20} />
                    </Pressable>
                ) : (
                    <></>
                )}
                <Pressable
                    style={{
                        borderColor: "black",
                        borderWidth: 1,
                        borderRadius: 5,
                        padding: 10,
                    }}
                    onPress={addToQueue}
                >
                    <Ionicons name={"add-sharp"} size={20} />
                </Pressable>
            </View>
        </>
    );
};

export default TopScreenFunctionality;
