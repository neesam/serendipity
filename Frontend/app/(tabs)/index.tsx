import { View, StyleSheet, Text, Pressable } from "react-native";
import { useState, useEffect } from "react";
import { get } from "http";

// import Button from "@/components/Button";
// import EntCard from "@/components/Card";

export default function Index() {

    const [whichTable, setWhichTable] = useState<string>('')
    const [album, setAlbum] = useState<string>('')
    const [albumID, setAlbumID] = useState<string>('')
    const [inCirculation, setInCirculation] = useState<string>('')
    const [originalTable, setOriginalTable] = useState<string>('')
    const [tablesUsed, setTablesUsed] = useState<string[]>([])
    const [backgroundColor, setBackgroundColor] = useState<string>('')

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
            const response = await fetch(`https://salty-oranges-serve.loca.lt/api/${whichTable}`)
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

            localStorage.setItem('in_circulation', 'false')
            
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

            while (!tableUsed) {


                const response = await fetch('https://salty-oranges-serve.loca.lt/api/whichMusicTable');

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
        const response = await fetch(`http://localhost:5001/api/${specificTable}`)
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
                const response = await fetch(`http://localhost:5001/api/albums/${albumID}/${whichTable}`, {
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
                const response = await fetch(`http://localhost:5001/api/albums/${albumID}/${album}/${originalTable}`, {
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
            const response = await fetch(`http://localhost:5001/api/addToCirculation/${album}/${whichTable}`, {
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
            const response = await fetch(`http://localhost:5001/api/addAlbumToQueue/${album}`, {
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
            <View style={containerStyles.cardContainer}>
                <Text style={cardStyles.albumName}>
                    {album}
                </Text>
                <Text style={cardStyles.tableName}>
                    {whichTable}
                </Text>
            </View>
            <Pressable onPress={getAlbum}>
                <View style={containerStyles.buttonContainer}>
                        <Text>Get album</Text>
                </View>
            </Pressable>
        </View>
    );
}

const cardStyles = StyleSheet.create({
    albumName: {
        fontSize: 20,
        marginBottom: 5
    },
    tableName: {
    }
})

const containerStyles = StyleSheet.create({
    screenContainer: {
        backgroundColor: 'pink',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },
    cardContainer: {
        borderWidth: 5,
        borderColor: 'gold',
        padding: 40,
        position: 'relative',
        left: -50,
        bottom: 200,
        backgroundColor: 'white'
    },
    buttonContainer: {
        backgroundColor: 'gold',
        padding: 20,
        position: 'relative',
        top: 220,
        left: -100,
        borderRadius: 18,
        borderColor: 'white',
        borderWidth: 5
    },
})