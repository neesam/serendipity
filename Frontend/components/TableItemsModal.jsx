import { useState, useEffect } from 'react';
import { View, Pressable, Modal, StyleSheet, Text } from 'react-native';

import { Picker } from '@react-native-picker/picker'

export default function TableItemsModal({ attributes }) {

    const [currentTableItemsModalVisible, setActiveTableItemsModalVisible] = useState(false)
    const [activeTableEntries, setActiveTableEntries] = useState([])
    const [selectedElement, setSelectedElement] = useState('');

    const handleCurrentTableItemsModalOpen = () => {
        setActiveTableItemsModalVisible(true)
    }

    const handleCurrentTableItemsModalClose = () => {
        setActiveTableItemsModalVisible(false)
    }

    const handlePopulateTableItemsModal = async (table) => {

        if (table.includes('album') || table.includes('artist')) {
            try {
                const response = await fetch(`https://first-choice-porpoise.ngrok-free.app/api/all_from_selected_music_table/${table}`)
                const data = await response.json()
                setActiveTableEntries(data)
            } catch (error) {
                console.log(error)
            }
        } else if (table.includes('film')) {
            try {
                const response = await fetch(`https://first-choice-porpoise.ngrok-free.app/api/all_from_selected_film_table/${table}`)
                const data = await response.json()
                setActiveTableEntries(data)
            } catch (error) {
                console.log(error)
            }
        } else if (table.includes('anime') || table === 'shows') {
            try {
                const response = await fetch(`https://first-choice-porpoise.ngrok-free.app/api/all_from_selected_shows_table/${table}`)
                const data = await response.json()
                setActiveTableEntries(data)
            } catch (error) {
                console.log(error)
            }
        } else {
            try {
                const response = await fetch(`https://first-choice-porpoise.ngrok-free.app/api/all_from_selected_book_table/${table}`)
                const data = await response.json()
                setActiveTableEntries(data)
            } catch (error) {
                console.log(error)
            }
        }
        setActiveTableItemsModalVisible(true)
    }

    const handleOptionChange = (value) => {
        setSelectedElement(value)
    }

    return (
        <View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={currentTableItemsModalVisible}
                onRequestClose={() => {
                    alert('Modal has been closed.');
                    setActiveTableItemsModalVisible(!currentTableItemsModalVisible);
                }}>
                <View style={modalStyles.centeredView}>
                    <View style={modalStyles.modalView}>
                        <Picker
                            itemStyle={{ color: 'black' }}
                            style={{ height: 'auto', width: '100%' }}
                            selectedValue={selectedElement ? selectedElement : ''}
                            onValueChange={handleOptionChange}
                        >
                            {activeTableEntries.length > 0 ? (
                                activeTableEntries.map((item) => (
                                    <Picker.Item key={item.id} label={item.title} value={item.title} />
                                ))
                            ) : (
                                <Picker.Item label="Loading..." value="" />
                            )}
                        </Picker>
                        <Pressable onPress={handleCurrentTableItemsModalClose}>
                            <Text>
                                Close
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    )
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
});