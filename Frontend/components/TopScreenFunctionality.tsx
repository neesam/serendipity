import { View, Pressable, ViewStyle, StyleProp } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import TablesModalAndButton from "./TablesModalAndButton";

interface TopScreenFunctionalityTypes {
    containerStyles: StyleProp<ViewStyle>;
    tables: string[];
    getFromSpecificTable: (input: string) => Promise<void>;
    addToQueue: (input: string) => Promise<void>;
    type: string;
}

const TopScreenFunctionality = ({
    containerStyles,
    tables,
    getFromSpecificTable,
    addToQueue,
    type,
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
                <Pressable onPress={() => addToQueue}>
                    <Ionicons name={"add-sharp"} size={20} />
                </Pressable>
            </View>
        </>
    );
};

export default TopScreenFunctionality;
