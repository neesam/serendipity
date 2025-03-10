import { View } from "react-native";
import { useState, useEffect } from "react";

import * as Haptics from 'expo-haptics';

import randomColor from '../Helper/randomColor'
import { musicTables } from '../Helper/lists'
import { containerStyles } from '../Styles/AlbumStyles'

import TopScreenFunctionality from './TopScreenFunctionality'
import MainButtons from './MainButtons'
import ContentCard from './ContentCard'

export default function Album() {

    const [whichTable, setWhichTable] = useState('')
    const [album, setAlbum] = useState('')
    const [albumID, setAlbumID] = useState('')
    const [inCirculation, setInCirculation] = useState('')
    const [originalTable, setOriginalTable] = useState('')
    const [tablesUsed, setTablesUsed] = useState([])
    const [backgroundColor, setBackgroundColor] = useState('')
    const [albumAndTableAvailable, setAlbumAndTableAvailable] = useState(false)

    useEffect(() => {

    }, [album]);

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

            const bgColor = randomColor()
            setBackgroundColor(bgColor)
        }

        // Function to retrieve specific table

        const fetchWhichTable = async () => {

            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

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

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

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
            const bgColor = randomColor()

            console.log(albumIDVal)

            setAlbum(albumVal)
            setAlbumID(albumIDVal)
            setInCirculation(in_circulation)
            setOriginalTable(originalTableVal)
            setWhichTable(specificTable)
            setBackgroundColor(bgColor)
    }

    const deleteAlbum = async () => {

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        if(inCirculation === 'false') {
            try {
                const response = await fetch(`https://first-choice-porpoise.ngrok-free.app/api/albums/${albumID}/${whichTable}`, {
                    method: 'DELETE',
                    headers: { 'Content-type': 'application/json' },
                });

                console.log(response)

                if (!response.ok) {
                    const errorData = await response.json();
                    console.log(errorData)
                    throw new Error(`Delete failed: ${errorData.message || 'Unknown error'}`);
                }

                console.log('fucking bitch')
                console.log(await response.json());
                console.log('shit man')
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

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        console.log(album)
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
                    setEntry={setAlbum}
                />
                <MainButtons getContent={getAlbum} deleteContent={deleteAlbum} type={'album'}/>
        </View>
    );
}