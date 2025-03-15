import { Text, View, TextInput, Button, Modal, Pressable, StyleSheet } from "react-native";

import * as Haptics from 'expo-haptics';

import { Picker } from "@react-native-picker/picker";

import { containerStyles, formStyles } from '../Styles/Styles'

import { useEffect, useState } from "react";

import { allTables } from "@/helper/lists";

export default function AddToTable() {

    useEffect(() => {

    }, [table, title])

    const [table, setTable] = useState('');
    const [title, setTitle] = useState('');
    const [currentlyListening, setCurrentlyListening] = useState(false)

    const [tablePickerShowing, setTablePickerShowing] = useState(false)
    const [selectedElement, setSelectedElement] = useState('');


    const handleTablePickerShow = () => {
        setTablePickerShowing(true)
    }

    const handleTablePickerClose = () => {
        setTablePickerShowing(false)
    }

    const handleOptionChange = (value) => {
        setSelectedElement(value)
    }

    const handleSetTable = () => {
        setTable(selectedElement)
        handleTablePickerClose()
    }

    const addToTable = async () => {
        if (table) {
            if (table.includes('album') || table.includes('artist')) {
                try {
                    const response = await fetch(`https://first-choice-porpoise.ngrok-free.app/api/add_to_music_table/${table}/${title}`, {
                        method: 'POST',
                        headers: { 'Content-type': 'application/json' },
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(`Delete failed: ${errorData.message || 'Unknown error'}`);
                    }

                    console.log(await response.json());
                    console.log('Added successfully.');

                } catch (error) {
                    console.error('Error during addition:', error.message);
                }
            } else if (table.includes('film')) {
                try {
                    const response = await fetch(`https://first-choice-porpoise.ngrok-free.app/api/add_to_film_table/${table}/${title}`, {
                        method: 'POST',
                        headers: { 'Content-type': 'application/json' },
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(`Delete failed: ${errorData.message || 'Unknown error'}`);
                    }

                    console.log(await response.json());
                    console.log('Added successfully.');

                } catch (error) {
                    console.error('Error during addition:', error.message);
                }
            } else if (table.includes('anime') || table === 'shows') {
                try {
                    const response = await fetch(`https://first-choice-porpoise.ngrok-free.app/api/add_to_show_table/${table}/${title}`, {
                        method: 'POST',
                        headers: { 'Content-type': 'application/json' },
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(`Delete failed: ${errorData.message || 'Unknown error'}`);
                    }

                    console.log(await response.json());
                    console.log('Added successfully.');

                } catch (error) {
                    console.error('Error during addition:', error.message);
                }
            } else {
                try {
                    const response = await fetch(`https://first-choice-porpoise.ngrok-free.app/api/add_to_book_table/${title}`, {
                        method: 'POST',
                        headers: { 'Content-type': 'application/json' },
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(`Delete failed: ${errorData.message || 'Unknown error'}`);
                    }

                    console.log(await response.json());
                    console.log('Added successfully.');

                } catch (error) {
                    console.error('Error during addition:', error.message);
                }
            }
        }
        setTitle('')
        setTable('')
    }

    const screenStyle = {
        backgroundColor: 'pink'
    }

    return (
        <View style={[containerStyles.screenContainer, screenStyle]}>
            <View style={formStyles.formContainer}>
                <Text style={formStyles.label}>Title:</Text>
                <TextInput
                    style={[formStyles.button, { alignItems: 'center', textAlign: 'center' }]}
                    value={title}
                    onChangeText={setTitle}

                />

                {table ? (
                    <>
                        <Text style={formStyles.label}>Table to add to:</Text>
                        <Pressable style={formStyles.button} onPress={handleTablePickerShow}>
                            <Text>{table}</Text>
                        </Pressable>
                    </>
                ) : (
                    <Pressable style={formStyles.button} onPress={handleTablePickerShow}>
                        <Text style={{ fontSize: 18 }}>Add to which table?</Text>
                    </Pressable>
                )}

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={tablePickerShowing}
                    onRequestClose={() => {
                        alert('Modal has been closed.');
                        // setActiveTableItemsModalVisible(!currentTableItemsModalVisible);
                    }}>
                    <View style={modalStyles.centeredView}>
                        <View style={modalStyles.modalView}>
                            <Picker
                                itemStyle={{ color: 'black' }}
                                style={{ height: 'auto', width: '100%' }}
                                selectedValue={selectedElement ? selectedElement : ''}
                                onValueChange={handleOptionChange}
                            >
                                {allTables.map((item) => (
                                    <Picker.Item key={item} label={item} value={item} />
                                ))}
                            </Picker>
                            <View style={modalStyles.setCurrentAlbumModalButtonsContainerContainer}>
                                <Pressable style={modalStyles.setCurrentAlbumModalButtonContainer} onPress={handleSetTable}>
                                    <Text style={modalStyles.setCurrentAlbumModalButton}>
                                        Set
                                    </Text>
                                </Pressable>
                                <Pressable style={modalStyles.setCurrentAlbumModalButtonContainer} onPress={handleTablePickerClose}>
                                    <Text style={modalStyles.setCurrentAlbumModalButton}>
                                        Close
                                    </Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>

                <Pressable onPress={addToTable} style={[formStyles.button, { width: 'auto' }]}>
                    <Text style={{ fontSize: 20 }}>
                        Submit
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}

const modalStyles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '100%',
        position: 'absolute',
        bottom: 10
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    setCurrentAlbumModalButtonsContainerContainer: {
        flexDirection: 'row',
        width: '100%',
        height: 'auto',
        justifyContent: 'space-around'
    },
    setCurrentAlbumModalButtonContainer: {
        borderWidth: .2,
        borderColor: 'black',
        borderRadius: 10,
        elevation: 5,
        padding: 10,
        width: 100,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    setCurrentAlbumModalButton: {
        fontSize: 20
    }
});