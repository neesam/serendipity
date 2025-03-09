import { View, StyleSheet, Text, Pressable, Modal } from "react-native";
import { useState, useEffect } from "react";
import { Picker } from "@react-native-picker/picker";

import DropdownForm from "./Form";

// import Button from "@/components/Button";
// import EntCard from "@/components/Card";

export default function Album() {

    const [whichTable, setWhichTable] = useState('')
    const [album, setAlbum] = useState('')
    const [albumID, setAlbumID] = useState('')
    const [inCirculation, setInCirculation] = useState('')
    const [originalTable, setOriginalTable] = useState('')
    const [tablesUsed, setTablesUsed] = useState([])
    const [backgroundColor, setBackgroundColor] = useState('')
    const [albumAndTableAvailable, setAlbumAndTableAvailable] = useState(false)
    const [currentTableItemsModalVisible, setActiveTableItemsModalVisible] = useState(false)
    const [activeTableEntries, setActiveTableEntries] = useState([])
    const [selectedElement, setSelectedElement] = useState('');

    const tables = [
        'album_2011vwave',
        'album_allgenres',
        'album_ambientvaporwave',
        'album_barberbeats',
        'album_bedroomAOR',
        'album_bodylinesources',
        'album_brokentransmission',
        'artist_classicalComposer',
        'album_chicagoschool',
        'album_corpsources',
        'album_createdbyrejection',
        'album_deathdream',
        'album_dreamytranscendent',
        'album_emo',
        'album_futurefunk',
        'album_emoautumn',
        'album_greatscene',
        'album_guysfavemoalbums',
        'album_hopelessrecords',
        'album_inCirculation',
        'album_indiepop',
        'album_latenightlofi',
        'album_luxelitesources',
        'album_magicsheet',
        'album_mallsoft',
        'album_moenieandkitchie',
        'album_popalbums',
        'album_risecore',
        'album_rymrecs',
        'album_rymsuggestions',
        'album_slushwave',
        'album_soundsofspotify',
        'album_tolisten',
        'album_telepath',
        'artist_topartists',
        'album_vaporwave',
        'album_vhspop',
        'album_vinyls',
        'album_waterfrontdiningsources',
        'album_waterloggedEars'
    ]

    useEffect(() => {

    // if (isStaticMode === false) {
    //     const randColor = randomColor()
    //     setBackgroundColor(randColor)
    //     localStorage.setItem('albumBackgroundColor', randColor);
    // }

    }, [album, activeTableEntries]);

    const handleCurrentTableItemsModalOpen = () => {
        setActiveTableItemsModalVisible(true)
    }

    const handleCurrentTableItemsModalClose = () => {
        setActiveTableItemsModalVisible(false)
    }

    const handleOptionChange = (value) => {
        setSelectedElement(value)
    }

    const getAlbum = async () => {

        // Function to fetch actual album

        const fetchAlbumFromWhichTable = async (whichTable) => {
            const response = await fetch(`https://first-choice-porpoise.ngrok-free.app/api/${whichTable}`)
            if (!response.ok) {
                throw new Error(`Failed to fetch details for ${whichTable}`);
            }
            const data = await response.json()

            console.log(data[0]['id'])

            if(data[0]['link']) {
                setAlbum(data[0]['link'])
            } else {
                setAlbum(data[0]['title'])
                setAlbumID(data[0]['id'])
            }

            setAlbumAndTableAvailable(true)

            // Logic to change background on each button press

            // const bgColor = randomColor()
            // setBackgroundColor(bgColor)
            // localStorage.setItem('albumBackgroundColor', bgColor)
        }

        // Function to retrieve specific table

        const fetchWhichTable = async () => {

            let localTablesUsed = [...tablesUsed];

            if (localTablesUsed.length === 20) {
                localTablesUsed = []
                setTablesUsed([])
            }

            let tableUsed = false

            setAlbumAndTableAvailable(false)

            while (!tableUsed) {


                const response = await fetch('https://first-choice-porpoise.ngrok-free.app/api/whichMusicTable');

                if (!response.ok) {
                    alert('why')
                    throw new Error('Failed to fetch whichTable');
                }

                const data = await response.json()
                const fetchedTable = data[0]['title']
                console.log(fetchedTable)

                if (!localTablesUsed.includes(fetchedTable)) {

                    tableUsed = true

                    setWhichTable(fetchedTable)

                    localTablesUsed.push(fetchedTable);
                    setTablesUsed(localTablesUsed);
                    console.log('After update:', [...tablesUsed, fetchedTable]);

                    if (data.length > 0) {
                        fetchAlbumFromWhichTable(fetchedTable); // Assuming data is an array and we're using the first item
                    }
                }
            }
        }

        fetchWhichTable();
    }

    const getFromSpecificTable = async (specificTable) => {
        const response = await fetch(`https://first-choice-porpoise.ngrok-free.app/api/${specificTable}`)
            if (!response.ok) {
                throw new Error(`Failed to fetch details for ${specificTable}`);
            }
            const data = await response.json()

            console.log(data)

            const albumVal = data[0]['link'] || data[0]['title']
            const albumIDVal = data[0]['id']
            const in_circulation = data[0]['in_circulation'] || 'false'
            const originalTableVal = data[0]['original_table'] || null
            // const bgColor = randomColor()

            localStorage.setItem('album', albumVal)
            localStorage.setItem('albumID', albumIDVal)
            localStorage.setItem('in_circulation', in_circulation)
            localStorage.setItem('original_album_table', originalTableVal)
            localStorage.setItem('whichMusicTable', specificTable)

            setAlbum(albumVal)
            setAlbumID(albumIDVal)
            setInCirculation(in_circulation)
            setOriginalTable(originalTableVal)
            setWhichTable(specificTable)
            // setBackgroundColor(bgColor)
    }

    const deleteAlbum = async () => {
        if(inCirculation === null) {
            try {
                const response = await fetch(`https://first-choice-porpoise.ngrok-free.app/api/albums/${albumID}/${whichTable}`, {
                    method: 'DELETE',
                    headers: { 'Content-type': 'application/json' },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Delete failed: ${errorData.message || 'Unknown error'}`);
                }

                console.log(await response.json());
                console.log('Album deleted successfully.');

                getAlbum()

            } catch (error) {
                // console.error('Error during deletion:', error.message);
            }
        } else {
            try {
                const response = await fetch(`https://first-choice-porpoise.ngrok-free.app/api/albums/${albumID}/${album}/${originalTable}`, {
                    method: 'DELETE',
                    headers: { 'Content-type': 'application/json' },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Delete failed: ${errorData.message || 'Unknown error'}`);
                }

                console.log(await response.json());
                console.log('Album deleted successfully.');

                // setInCirculation('false')

                getAlbum()
            } catch (error) {
                // console.error('Error during deletion:', error.message);
            }
        }

        // toast('Deleted album!', {
        //     autoClose: 2000,
        //     theme: "light",
        //     });
    };

    const addToCirculation = async () => {
        try {
            const response = await fetch(`https://first-choice-porpoise.ngrok-free.app/api/addToCirculation/${album}/${whichTable}`, {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
            })

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Post failed: ${errorData.message || 'Unknown error'}`);
            }

            console.log(await response.json());
            console.log('Album added successfully.');
        } catch (error) {
            // console.error('Error during deletion:', error.message);
        }

        setInCirculation('true')
        localStorage.setItem('in_circulation', 'true')

        // toast('Added to inCirculation!', {
        //     autoClose: 2000,
        //     theme: "light",
        //     });
    }

    const addToQueue = async () => {
        try {
            const response = await fetch(`https://first-choice-porpoise.ngrok-free.app/api/addAlbumToQueue/${album}`, {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
            })

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Post failed: ${errorData.message || 'Unknown error'}`);
            }

            console.log(await response.json());
            console.log('Album added successfully.');
        } catch(error) {
            console.error('Error in API call', error);
        }

        // toast('Added to queue!', {
        //     autoClose: 2000,
        //     theme: "light",
        //     });
    }

    const handlePopulateTableItemsModal = async (table) => {

        if(table.includes('album') || table.includes('artist')) {
            try {
                const response = await fetch(`https://first-choice-porpoise.ngrok-free.app/api/all_from_selected_music_table/${table}`)
                const data = await response.json()
                setActiveTableEntries(data)
                console.log(activeTableEntries)
            } catch (error) {
                console.log(error)
            }
        } else if(table.includes('film')) {
            try {
                const response = await fetch(`https://first-choice-porpoise.ngrok-free.app/api/all_from_selected_film_table/${table}`)
                const data = await response.json()
                setActiveTableEntries(data)
            } catch (error) {
                console.log(error)
            }
        } else if(table.includes('anime') || table === 'shows') {
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

    return (
        <View style={containerStyles.screenContainer}>
            <View style={containerStyles.topLeftCornerContainer}>
                <DropdownForm attributes={{
                    tables: tables
                    }}
                    submitFunction={addToQueue}
                    name={'list-sharp'}/>
            </View>
            <View style={containerStyles.topRightCornerContainer}>
                <DropdownForm attributes={{}} submitFunction={addToQueue} name={'add-sharp'}/>
            </View>
                <View style={containerStyles.cardContainer}>
                    {albumAndTableAvailable ? (
                        <Pressable style={cardStyles.card}>
                            <Text style={cardStyles.albumName}>
                                {album}
                            </Text>
                            <Pressable onPress={() => handlePopulateTableItemsModal(whichTable)}>
                                <Text style={cardStyles.tableName}>
                                    {whichTable}
                                </Text>
                            </Pressable>
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
                        </Pressable>
                    ) :
                        <>
                            <Text style={cardStyles.loadingText}>
                                Getting info...
                            </Text>
                        </>}
                </View>
            <View style={containerStyles.buttonsContainer}>
                <Pressable onPress={getAlbum}>
                    <View style={containerStyles.getAlbumButtonContainer}>
                            <Text style={buttonStyles.buttonText}>Get album</Text>
                    </View>
                </Pressable>
                <Pressable onPress={deleteAlbum}>
                    <View style={containerStyles.deleteAlbumButtonContainer}>
                            <Text style={buttonStyles.buttonText}>Delete album</Text>
                    </View>
                </Pressable>
            </View>
        </View>
    );
}

const cardStyles = StyleSheet.create({
    albumName: {
        fontSize: 22,
        fontWeight: '600',
        marginBottom: 5,
        color: '#333',
    },
    tableName: {
        fontSize: 18,
        color: '#555',
    },
    loadingText: {
        fontSize: 18,
        fontStyle: 'italic',
        color: '#888',
    },
    card: {
        alignItems: 'center'
    }
});

const containerStyles = StyleSheet.create({
    screenContainer: {
        backgroundColor: '#f8f8f8',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    topLeftCornerContainer: {
        position: 'absolute',
        top: 10,
        left: 10,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10
    },
    topRightCornerContainer: {
        position: 'absolute',
        top: 10,
        right: 10,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10
    },
    cardContainer: {
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: 'gold',
        borderRadius: 10,
        padding: 30,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,  // This will give it a slight shadow on Android
        marginBottom: 20,
    },
    getAlbumButtonContainer: {
        backgroundColor: 'blue',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'white',
        borderWidth: 3,
    },
    deleteAlbumButtonContainer: {
        backgroundColor: 'red',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'white',
        borderWidth: 3,
    },
    buttonsContainer: {
        flexDirection: 'row',
        gap: 10
    },
});

const buttonStyles = StyleSheet.create({
    buttonText: {
        fontSize: 18,
        fontWeight: '600',
        color: 'white',
    },
});

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