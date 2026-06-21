import { View, Text, TouchableOpacity, Modal, Pressable} from "react-native";
import { useState } from "react";
import { Picker } from "@react-native-picker/picker";

import { containerStyles, buttonStyles, modalStyles } from "../styles/styles";

const spotifyPlaylists = ["favorites", "4.5", "None"]

interface MainButtonsTypes {
    getContent: () => Promise<void>;
    deleteContent: () => Promise<void>;
    type: string;
    availability: boolean;
    contentName: string;
    currentlyListening?: string;
    addToCurrentlyListening?: () => Promise<void>;
    addToSpotifyPlaylist: (playlist, title) => Promise<void>;
}

const MainButtons = ({
    getContent,
    deleteContent,
    type,
    currentlyListening,
    addToCurrentlyListening,
    availability,
    contentName,
    addToSpotifyPlaylist
}: MainButtonsTypes) => {

    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedElement, setSelectedElement] = useState(spotifyPlaylists[0]);

    const handleOptionChange = (value: string) => {
        setSelectedElement(value);
    };

    const handleTablesModalClose = () => setDeleteModalVisible(false);

    const handleGetAndSetEntry = () => {
        addToSpotifyPlaylist(selectedElement, contentName);
        handleTablesModalClose();
    };

    return (
        <>
            {availability ? (
                <View style={containerStyles.mainButtonsContainer}>
                    {contentName === "" ? (
                        <TouchableOpacity onPress={getContent}>
                            <View
                                style={
                                    containerStyles.getContentButtonContainer
                                }
                            >
                                <Text style={buttonStyles.buttonText}>
                                    Get {type}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ) : (
                        <>
                            <TouchableOpacity onPress={getContent}>
                                <View
                                    style={
                                        containerStyles.getContentButtonContainer
                                    }
                                >
                                    <Text style={buttonStyles.buttonText}>
                                        Get {type}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={deleteContent}>
                                <View
                                    style={
                                        containerStyles.deleteContentButtonContainer
                                    }
                                >
                                    <Text style={buttonStyles.buttonText}>
                                        Delete {type}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            ) : (
                <></>
            )}
            {currentlyListening === "false" &&
            availability === true &&
            type === "album" ? (
                <View
                    style={
                        containerStyles.addToCurrentlyListeningButtonContainer
                    }
                >
                    <TouchableOpacity onPress={addToCurrentlyListening}>
                        <View>
                            <Text style={buttonStyles.buttonText}>
                                Add to currents
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            ) : (
                <></>
            )}
            {type === "film" && currentlyListening === "false" ? (
                <View
                    style={
                        containerStyles.addToCurrentlyListeningButtonContainer
                    }
                >
                    <TouchableOpacity onPress={addToCurrentlyListening}>
                        <View>
                            <Text style={buttonStyles.buttonText}>
                                Add to Stremio
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            ) : (
                <></>
            )}

            <Modal
                animationType="slide"
                transparent={true}
                visible={deleteModalVisible}
                onRequestClose={() => {
                    setDeleteModalVisible(!deleteModalVisible);
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
                            {spotifyPlaylists.map((item) => (
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
                                    Add
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
        </>
    );
};

export default MainButtons;
