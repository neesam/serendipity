import { View, StyleSheet, Text, Pressable } from "react-native";
import { useState, useEffect } from "react";
import DropdownForm from "./Form";

// import Button from "@/components/Button";
// import EntCard from "@/components/Card";

export default function Album() {

    const [whichTable, setWhichTable] = useState<string>('')
    const [album, setAlbum] = useState<string>('')
    const [albumID, setAlbumID] = useState<string>('')
    const [inCirculation, setInCirculation] = useState<string>('')
    const [originalTable, setOriginalTable] = useState<string>('')
    const [tablesUsed, setTablesUsed] = useState<string[]>([])
    const [backgroundColor, setBackgroundColor] = useState<string>('')
    const [albumAndTableAvailable, setAlbumAndTableAvailable] = useState<boolean>(false)

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

    }, [album]);

    const getAlbum = async () => {

        // Function to fetch actual album

        const fetchAlbumFromWhichTable = async (whichTable: string) => {
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

            let localTablesUsed: string[] = [...tablesUsed];

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
                const fetchedTable: string = data[0]['title']
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

    const getFromSpecificTable = async (specificTable: string) => {
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
                        <>
                            <Text style={cardStyles.albumName}>
                                {album}
                            </Text>
                            <Text style={cardStyles.tableName}>
                                {whichTable}
                            </Text>
                        </>
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
        justifyContent: 'flex-start',
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