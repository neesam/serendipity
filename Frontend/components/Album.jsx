import { View } from "react-native";
import { useState, useEffect } from "react";

import * as Haptics from 'expo-haptics';

import randomColor from '../helper/randomColor'
import { musicTables } from '../helper/lists'
import { containerStyles } from '../Styles/Styles'

import TopScreenFunctionality from './TopScreenFunctionality'
import MainButtons from './MainButtons'
import ContentCard from './ContentCard'

export default function Album() {

    const [whichTable, setWhichTable] = useState('')
    const [album, setAlbum] = useState('')
    const [albumID, setAlbumID] = useState('')
    const [currentlyListening, setCurrentlyListening] = useState('')
    const [originalTable, setOriginalTable] = useState('')
    const [tablesUsed, setTablesUsed] = useState([])
    const [backgroundColor, setBackgroundColor] = useState('')
    const [albumAndTableAvailable, setAlbumAndTableAvailable] = useState(true)

    useEffect(() => {

        console.log(albumID)

    }, [album, whichTable]);

    const getAlbum = async () => {

        // Function to fetch actual album

        const fetchAlbumFromWhichTable = async (whichTable) => {
            const response = await fetch(`https://first-choice-porpoise.ngrok-free.app/api/${whichTable}`)
            if (!response.ok) {
                throw new Error(`Failed to fetch details for ${whichTable}`);
            }
            const data = await response.json()

            if (data[0]['link']) {
                setAlbum(data[0]['link'])
            } else {
                setAlbum(data[0]['title'])
                setAlbumID(data[0]['id'])
            }

            console.log(data)

            setCurrentlyListening(data[0]['currently_listening'] || 'false')

            setAlbumAndTableAvailable(true)

            // Logic to change background on each button press

            const bgColor = randomColor()
            setBackgroundColor(bgColor)
        }

        // Function to retrieve specific table

        const fetchWhichTable = async () => {

            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

            setAlbumAndTableAvailable(false)

            let localTablesUsed = [...tablesUsed];

            if (localTablesUsed.length === 20) {
                localTablesUsed = []
                setTablesUsed([])
            }

            let tableUsed = false

            while (!tableUsed) {

                const response = await fetch('https://first-choice-porpoise.ngrok-free.app/api/whichMusicTable');

                if (!response.ok) {
                    alert('why')
                    throw new Error('Failed to fetch whichTable');
                }

                const data = await response.json()
                const fetchedTable = data[0]['title']

                if (!localTablesUsed.includes(fetchedTable)) {

                    tableUsed = true

                    setWhichTable(fetchedTable)

                    localTablesUsed.push(fetchedTable);
                    setTablesUsed(localTablesUsed);

                    if (data.length > 0) {
                        fetchAlbumFromWhichTable(fetchedTable); // Assuming data is an array and we're using the first item
                    }
                }
            }
        }

        fetchWhichTable();
    }

    const getFromSpecificTable = async (specificTable) => {

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        const response = await fetch(`https://first-choice-porpoise.ngrok-free.app/api/${specificTable}`)

        if (!response.ok) {
            throw new Error(`Failed to fetch details for ${specificTable}`);
        }

        const data = await response.json()

        console.log(data)

        const albumVal = data[0]['link'] || data[0]['title']
        const albumIDVal = data[0]['id']
        const currently_listening = data[0]['currently_listening'] || 'false'
        const originalTableVal = data[0]['original_table'] || null
        const bgColor = randomColor()

        setAlbum(albumVal)
        setAlbumID(albumIDVal)
        setCurrentlyListening(currently_listening)
        setOriginalTable(originalTableVal)
        setWhichTable(specificTable)
        setBackgroundColor(bgColor)
    }

    const deleteAlbum = async () => {

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        if (currentlyListening === 'false') {
            try {
                const response = await fetch(`https://first-choice-porpoise.ngrok-free.app/api/albums/${albumID}/${whichTable}`, {
                    method: 'DELETE',
                    headers: { 'Content-type': 'application/json' },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.log(errorData)
                    throw new Error(`Delete failed: ${errorData.message || 'Unknown error'}`);
                }

                console.log(await response.json());
                console.log('Album deleted successfully.');

                getFromSpecificTable(whichTable)

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

                getFromSpecificTable(whichTable)
            } catch (error) {
                // console.error('Error during deletion:', error.message);
            }
        }

        // toast('Deleted album!', {
        //     autoClose: 2000,
        //     theme: "light",
        //     });
    };

    const addToCurrentlyListening = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        try {
            const response = await fetch(`https://first-choice-porpoise.ngrok-free.app/api/addToCurrentlyListening/${album}/${whichTable}`, {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
            })

            if (!response.ok) {
                const errorData = await response.json();
                console.log(errorData.message)
            }

            const data = await response.json()
            setCurrentlyListening('true')
        } catch (error) {
            console.error(error.message);
        }

        // toast('Added to inCirculation!', {
        //     autoClose: 2000,
        //     theme: "light",
        //     });
    }

    const addToQueue = async () => {

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

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


        // toast('Added to queue!', {
        //     autoClose: 2000,
        //     theme: "light",
        //     });
    }

    const getDataForSpecificEntry = async (title) => {
        try {
            const response = await fetch(`https://first-choice-porpoise.ngrok-free.app/api/specificMusicEntry/${title}/${whichTable}`)

            if (!response.ok) {
                const errorData = await response.json();
                console.log(errorData.message)
            }

            const data = await response.json()

            setAlbum(data[0]['title'])
            setAlbumID(data[0]['id'])
        } catch (error) {
            console.log(error.message)
        }
    }

    const screenStyle = {
        backgroundColor: backgroundColor
    }

    return (
        <View style={[containerStyles.screenContainer, screenStyle]}>
            <TopScreenFunctionality
                containerStyles={containerStyles}
                tables={musicTables}
                getFromSpecificTable={getFromSpecificTable}
                addToQueue={addToQueue}
            />
            <ContentCard
                whichTable={whichTable}
                availability={albumAndTableAvailable}
                type={'album'}
                contentName={album}
                getFromSpecificTable={getFromSpecificTable}
                getDataForSpecificEntry={getDataForSpecificEntry}
                contentID={albumID}
            />
            <MainButtons
                getContent={getAlbum}
                deleteContent={deleteAlbum}
                type={'album'}
                currentlyListening={currentlyListening}
                addToCurrentlyListening={addToCurrentlyListening}
                availability={albumAndTableAvailable}
                contentName={album}
            />
        </View>
    );
}