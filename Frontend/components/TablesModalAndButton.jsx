import { useState } from 'react';
import { View, StyleSheet, Pressable, Modal, Text } from 'react-native';

import { Picker } from '@react-native-picker/picker'
import * as Haptics from 'expo-haptics';

import { Ionicons } from '@expo/vector-icons'
import AntDesign from '@expo/vector-icons/AntDesign';

const TablesModalAndButton = ({ name, setEntry, addToQueue, tables, type }) => {

  // State to store selected dropdown value
  const [tablesModalVisible, setTablesModalVisible] = useState(false);
  const [selectedElement, setSelectedElement] = useState('');

  const handleTablesModalOpen = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setTablesModalVisible(true);
  }

  const handleTablesModalClose = () => setTablesModalVisible(false);

  const handleOptionChange = (value) => {
    setSelectedElement(value)
  }

  const handleGetAndSetEntry = () => {
    setEntry(selectedElement)
    handleTablesModalClose()
  }

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
          Alert.alert('Modal has been closed.');
          setTablesModalVisible(!tablesModalVisible);
        }}>
        <View style={modalStyles.centeredView}>
          <View style={modalStyles.modalView}>
            <Picker
              itemStyle={{ color: 'black' }}
              style={{ height: 'auto', width: '100%' }}
              selectedValue={selectedElement}
              onValueChange={handleOptionChange}
            >
              {tables.map((item) => (
                <Picker.Item key={item} label={item} value={item} />
              ))}
            </Picker>
            <View style={modalStyles.setCurrentAlbumModalButtonsContainerContainer}>
              <Pressable style={modalStyles.setCurrentAlbumModalButtonContainer} onPress={handleGetAndSetEntry}>
                <Text style={modalStyles.setCurrentAlbumModalButton}>
                  Get
                </Text>
              </Pressable>
              <Pressable style={modalStyles.setCurrentAlbumModalButtonContainer} onPress={handleTablesModalClose}>
                <Text style={modalStyles.setCurrentAlbumModalButton}>
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


export default TablesModalAndButton;
