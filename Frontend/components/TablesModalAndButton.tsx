import { useState } from "react";
import { View, StyleSheet, Pressable, Modal, Text } from "react-native";

import { Picker } from "@react-native-picker/picker";
import * as Haptics from "expo-haptics";

import AntDesign from "@expo/vector-icons/AntDesign";

import { modalStyles } from "../styles/styles";

interface TablesModalAndButtonTypes {
    name: string;
    setEntry: (input: string) => Promise<void>;
    tables: string[];
}

const TablesModalAndButton = ({
    name,
    setEntry,
    tables,
}: TablesModalAndButtonTypes) => {
    // State to store selected dropdown value
    const [tablesModalVisible, setTablesModalVisible] = useState(false);
    const [selectedElement, setSelectedElement] = useState(tables[0]);

    const handleTablesModalOpen = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setTablesModalVisible(true);
    };

    const handleTablesModalClose = () => setTablesModalVisible(false);

    const handleOptionChange = (value: string) => {
        setSelectedElement(value);
    };

    const handleGetAndSetEntry = () => {
        console.log(selectedElement);
        setEntry(selectedElement);
        handleTablesModalClose();
    };

    return (
        <View>
            <Pressable onPress={handleTablesModalOpen}>
                <AntDesign name={name} size={20} />
            </Pressable>

            <Modal
                animationType="slide"
                transparent={true}
                visible={tablesModalVisible}
                onRequestClose={() => {
                    setTablesModalVisible(!tablesModalVisible);
                }}
            >
                <View style={modalStyles.centeredView}>
                    <View style={modalStyles.modalView}>
                        <Picker
                            itemStyle={{ color: "black" }}
                            style={{ height: "auto", width: "100%" }}
                            selectedValue={selectedElement}
                            onValueChange={handleOptionChange}
                        >
                            {tables.map((item) => (
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
                                onPress={handleGetAndSetEntry}
                            >
                                <Text
                                    style={
                                        modalStyles.setCurrentAlbumModalButton
                                    }
                                >
                                    Get
                                </Text>
                            </Pressable>
                            <Pressable
                                style={
                                    modalStyles.setCurrentAlbumModalButtonContainer
                                }
                                onPress={handleTablesModalClose}
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
        </View>
    );
};

export default TablesModalAndButton;
