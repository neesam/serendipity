import {
    Text,
    View,
    TextInput,
    Modal,
    Pressable,
    StyleSheet,
} from "react-native";

import { Picker } from "@react-native-picker/picker";

import { containerStyles, formStyles } from "../styles/styles";

import { useEffect, useState } from "react";

import { allTables } from "@/helper/lists";
import { error } from "console";

const EXPO_PUBLIC_MUSIC_TABLES_DATASET =
    process.env.EXPO_PUBLIC_MUSIC_TABLES_DATASET;

const EXPO_PUBLIC_FILM_TABLES_DATASET =
    process.env.EXPO_PUBLIC_FILM_TABLES_DATASET;

const EXPO_PUBLIC_SHOW_TABLES_DATASET =
    process.env.EXPO_PUBLIC_SHOW_TABLES_DATASET;

const EXPO_PUBLIC_BOOK_TABLES_DATASET =
    process.env.EXPO_PUBLIC_BOOK_TABLES_DATASET;

export default function AddToTable() {
    const [destinationTable, setDestinationTable] = useState("");
    const [originTable, setOriginTable] = useState("");
    const [title, setTitle] = useState("");
    const [destinationOrOrigin, setDestinationOrOrigin] = useState("");

    const [tablePickerShowing, setTablePickerShowing] = useState(false);
    const [selectedElement, setSelectedElement] = useState(allTables[0]);

    useEffect(() => {}, [destinationTable, originTable, title]);

    const handleTablePickerShow = (type: string) => {
        setDestinationOrOrigin(type);
        setTablePickerShowing(true);
    };

    const handleTablePickerClose = () => {
        setTablePickerShowing(false);
    };

    const handleOptionChange = (value: string) => {
        setSelectedElement(value);
    };

    const handleSetTable = () => {
        if (destinationOrOrigin === "destination") {
            setDestinationTable(selectedElement);
        } else {
            setOriginTable(selectedElement);
        }
        handleTablePickerClose();
    };

    const addToTables = async () => {
        if (destinationTable && !originTable) {
            if (
                destinationTable.includes("album") ||
                destinationTable.includes("artist")
            ) {
                try {
                    const response = await fetch(
                        `https://first-choice-porpoise.ngrok-free.app/api/add_to_music_table/${destinationTable}/${title}/${EXPO_PUBLIC_MUSIC_TABLES_DATASET}`,
                        {
                            method: "POST",
                            headers: { "Content-type": "application/json" },
                        }
                    );

                    if (!response.ok) {
                        const errorData = await response.json();
                        console.log(errorData);
                    }

                    console.log("Added successfully.");
                } catch (error) {
                    if (error instanceof Error) {
                        console.log("Error during addition:", error.message);
                    }
                }
            } else if (destinationTable.includes("film")) {
                try {
                    const response = await fetch(
                        `https://first-choice-porpoise.ngrok-free.app/api/add_to_film_table/${destinationTable}/${title}/${EXPO_PUBLIC_FILM_TABLES_DATASET}`,
                        {
                            method: "POST",
                            headers: { "Content-type": "application/json" },
                        }
                    );

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(
                            `Add failed: ${
                                errorData.message || "Unknown error"
                            }`
                        );
                    }

                    console.log(await response.json());
                    console.log("Added successfully.");
                } catch (error) {
                    if (error instanceof Error) {
                        console.error("Error during addition:", error.message);
                    }
                }
            } else if (
                destinationTable.includes("anime") ||
                destinationTable.includes("shows")
            ) {
                try {
                    const response = await fetch(
                        `https://first-choice-porpoise.ngrok-free.app/api/add_to_show_table/${destinationTable}/${title}/${EXPO_PUBLIC_SHOW_TABLES_DATASET}`,
                        {
                            method: "POST",
                            headers: { "Content-type": "application/json" },
                        }
                    );

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(
                            `Add failed: ${
                                errorData.message || "Unknown error"
                            }`
                        );
                    }

                    console.log(await response.json());
                    console.log("Added successfully.");
                } catch (error) {
                    if (error instanceof Error) {
                        console.error("Error during addition:", error.message);
                    }
                }
            } else {
                try {
                    const response = await fetch(
                        `https://first-choice-porpoise.ngrok-free.app/api/add_to_book_table/${destinationTable}/${title}/${EXPO_PUBLIC_BOOK_TABLES_DATASET}`,
                        {
                            method: "POST",
                            headers: { "Content-type": "application/json" },
                        }
                    );

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(
                            `Add failed: ${
                                errorData.message || "Unknown error"
                            }`
                        );
                    }

                    console.log(await response.json());
                    console.log("Added successfully.");
                } catch (error) {
                    if (error instanceof Error) {
                        console.error("Error during addition:", error.message);
                    }
                }
            }
            setTitle("");
            setDestinationTable("");
        }
        if (!destinationTable && originTable) {
            if (
                originTable.includes("album") ||
                originTable.includes("artist")
            ) {
                try {
                    const response = await fetch(
                        `https://first-choice-porpoise.ngrok-free.app/api/add_to_music_table/${originTable}/${title}/${EXPO_PUBLIC_MUSIC_TABLES_DATASET}`,
                        {
                            method: "POST",
                            headers: { "Content-type": "application/json" },
                        }
                    );

                    if (!response.ok) {
                        const errorData = await response.json();
                        console.log(errorData);
                    }

                    console.log("Added successfully.");
                } catch (error) {
                    if (error instanceof Error) {
                        console.log("Error during addition:", error.message);
                    }
                }
            } else if (originTable.includes("film")) {
                try {
                    const response = await fetch(
                        `https://first-choice-porpoise.ngrok-free.app/api/add_to_film_table/${originTable}/${title}/${EXPO_PUBLIC_FILM_TABLES_DATASET}`,
                        {
                            method: "POST",
                            headers: { "Content-type": "application/json" },
                        }
                    );

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(
                            `Add failed: ${
                                errorData.message || "Unknown error"
                            }`
                        );
                    }

                    console.log(await response.json());
                    console.log("Added successfully.");
                } catch (error) {
                    if (error instanceof Error) {
                        console.error("Error during addition:", error.message);
                    }
                }
            } else if (
                originTable.includes("anime") ||
                originTable.includes("shows")
            ) {
                try {
                    const response = await fetch(
                        `https://first-choice-porpoise.ngrok-free.app/api/add_to_show_table/${originTable}/${title}/${EXPO_PUBLIC_SHOW_TABLES_DATASET}`,
                        {
                            method: "POST",
                            headers: { "Content-type": "application/json" },
                        }
                    );

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(
                            `Add failed: ${
                                errorData.message || "Unknown error"
                            }`
                        );
                    }

                    console.log(await response.json());
                    console.log("Added successfully.");
                } catch (error) {
                    if (error instanceof Error) {
                        console.error("Error during addition:", error.message);
                    }
                }
            } else {
                try {
                    const response = await fetch(
                        `https://first-choice-porpoise.ngrok-free.app/api/add_to_book_table/${originTable}/${title}/${EXPO_PUBLIC_BOOK_TABLES_DATASET}`,
                        {
                            method: "POST",
                            headers: { "Content-type": "application/json" },
                        }
                    );

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(
                            `Add failed: ${
                                errorData.message || "Unknown error"
                            }`
                        );
                    }

                    console.log(await response.json());
                    console.log("Added successfully.");
                } catch (error) {
                    if (error instanceof Error) {
                        console.error("Error during addition:", error.message);
                    }
                }
            }
            setTitle("");
            setOriginTable("");
        }
        if (destinationTable && originTable) {
            if (
                originTable.includes("album") ||
                originTable.includes("artist")
            ) {
                try {
                    const response = await fetch(
                        `https://first-choice-porpoise.ngrok-free.app/api/add_to_music_table/${destinationTable}/${originTable}/${title}/${EXPO_PUBLIC_MUSIC_TABLES_DATASET}`,
                        {
                            method: "POST",
                            headers: { "Content-type": "application/json" },
                        }
                    );

                    if (!response.ok) {
                        const errorData = await response.json();
                        console.log(errorData);
                    }

                    console.log("Added successfully.");
                } catch (error) {
                    if (error instanceof Error) {
                        console.log("Error during addition:", error.message);
                    }
                }
            } else if (originTable.includes("film")) {
                try {
                    const response = await fetch(
                        `https://first-choice-porpoise.ngrok-free.app/api/add_to_film_table/${destinationTable}/${originTable}/${title}/${EXPO_PUBLIC_FILM_TABLES_DATASET}`,
                        {
                            method: "POST",
                            headers: { "Content-type": "application/json" },
                        }
                    );

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(
                            `Add failed: ${
                                errorData.message || "Unknown error"
                            }`
                        );
                    }

                    console.log(await response.json());
                    console.log("Added successfully.");
                } catch (error) {
                    if (error instanceof Error) {
                        console.error("Error during addition:", error.message);
                    }
                }
            } else if (
                originTable.includes("anime") ||
                originTable.includes("shows")
            ) {
                try {
                    const response = await fetch(
                        `https://first-choice-porpoise.ngrok-free.app/api/add_to_show_table/${destinationTable}/${originTable}/${title}/${EXPO_PUBLIC_SHOW_TABLES_DATASET}`,
                        {
                            method: "POST",
                            headers: { "Content-type": "application/json" },
                        }
                    );

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(
                            `Add failed: ${
                                errorData.message || "Unknown error"
                            }`
                        );
                    }

                    console.log(await response.json());
                    console.log("Added successfully.");
                } catch (error) {
                    if (error instanceof Error) {
                        console.error("Error during addition:", error.message);
                    }
                }
            } else {
                try {
                    const response = await fetch(
                        `https://first-choice-porpoise.ngrok-free.app/api/add_to_book_table/${destinationTable}/${originTable}/${title}/${EXPO_PUBLIC_BOOK_TABLES_DATASET}`,
                        {
                            method: "POST",
                            headers: { "Content-type": "application/json" },
                        }
                    );

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(
                            `Add failed: ${
                                errorData.message || "Unknown error"
                            }`
                        );
                    }

                    console.log(await response.json());
                    console.log("Added successfully.");
                } catch (error) {
                    if (error instanceof Error) {
                        console.error("Error during addition:", error.message);
                    }
                }
            }
            setTitle("");
            setOriginTable("");
            setDestinationTable("");
        }
    };

    const screenStyle = {
        backgroundColor: "pink",
    };

    return (
        <View style={[containerStyles.screenContainer, screenStyle]}>
            <View style={formStyles.formContainer}>
                <Text style={formStyles.label}>Title:</Text>
                <TextInput
                    style={[
                        formStyles.button,
                        { alignItems: "center", textAlign: "center" },
                    ]}
                    value={title}
                    onChangeText={setTitle}
                />

                {destinationTable ? (
                    <>
                        <Text style={formStyles.label}>Table to add to:</Text>
                        <Pressable
                            style={formStyles.button}
                            onPress={() => handleTablePickerShow("destination")}
                        >
                            <Text>{destinationTable}</Text>
                        </Pressable>
                    </>
                ) : (
                    <Pressable
                        style={formStyles.button}
                        onPress={() => handleTablePickerShow("destination")}
                    >
                        <Text style={{ fontSize: 18 }}>
                            Add to which table?
                        </Text>
                    </Pressable>
                )}

                {originTable ? (
                    <>
                        <Text style={formStyles.label}>Table of origin:</Text>
                        <Pressable
                            style={formStyles.button}
                            onPress={() => handleTablePickerShow("origin")}
                        >
                            <Text>{originTable}</Text>
                        </Pressable>
                    </>
                ) : (
                    <Pressable
                        style={formStyles.button}
                        onPress={() => handleTablePickerShow("origin")}
                    >
                        <Text style={{ fontSize: 18 }}>Table of origin?</Text>
                    </Pressable>
                )}

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={tablePickerShowing}
                >
                    <View style={modalStyles.centeredView}>
                        <View style={modalStyles.modalView}>
                            <Picker
                                itemStyle={{ color: "black" }}
                                style={{ height: "auto", width: "100%" }}
                                selectedValue={
                                    selectedElement ? selectedElement : ""
                                }
                                onValueChange={handleOptionChange}
                            >
                                {allTables.map((item) => (
                                    <Picker.Item
                                        key={item}
                                        label={item}
                                        value={item}
                                    />
                                ))}
                            </Picker>
                            <View
                                style={
                                    modalStyles.setCurrentAlbumModalButtonsContainerContainer
                                }
                            >
                                <Pressable
                                    style={
                                        modalStyles.setCurrentAlbumModalButtonContainer
                                    }
                                    onPress={handleSetTable}
                                >
                                    <Text
                                        style={
                                            modalStyles.setCurrentAlbumModalButton
                                        }
                                    >
                                        Set
                                    </Text>
                                </Pressable>
                                <Pressable
                                    style={
                                        modalStyles.setCurrentAlbumModalButtonContainer
                                    }
                                    onPress={handleTablePickerClose}
                                >
                                    <Text
                                        style={
                                            modalStyles.setCurrentAlbumModalButton
                                        }
                                    >
                                        Close
                                    </Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>

                <Pressable
                    onPress={addToTables}
                    style={[formStyles.button, { width: "auto" }]}
                >
                    <Text style={{ fontSize: 20 }}>Submit</Text>
                </Pressable>
            </View>
        </View>
    );
}

const modalStyles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: "100%",
        position: "absolute",
        bottom: 10,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
    },
    setCurrentAlbumModalButtonsContainerContainer: {
        flexDirection: "row",
        width: "100%",
        height: "auto",
        justifyContent: "space-around",
    },
    setCurrentAlbumModalButtonContainer: {
        borderWidth: 0.2,
        borderColor: "black",
        borderRadius: 10,
        elevation: 5,
        padding: 10,
        width: 100,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    setCurrentAlbumModalButton: {
        fontSize: 20,
    },
});
