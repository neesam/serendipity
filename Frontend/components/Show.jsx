import { View } from "react-native";
import { useState, useEffect } from "react";

import * as Haptics from 'expo-haptics';

import { containerStyles } from '../Styles/AlbumStyles'
import { showTables } from '../Helper/lists'
import TopScreenFunctionality from './TopScreenFunctionality'
import MainButtons from './MainButtons'
import ContentCard from './ContentCard'

// import { ToastContainer, toast } from 'react-toastify';

const Show = () => {

    const [whichTable, setWhichTable] = useState('')
    const [show, setShow] = useState()
    const [tablesUsed, setTablesUsed] = useState([])
    const [showID, setShowID] = useState('')
    const [backgroundColor, setBackgroundColor] = useState('')
    const [showAndTableAvailable, setShowAndTableAvailable] = useState(false)

    useEffect(() => {

    }, [show]);

    const getShow = async () => {

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        // Function to fetch actual show

        const fetchShowFromWhichTable = async (whichTable) => {
            const response = await fetch(`https://first-choice-porpoise.ngrok-free.app/api/${whichTable}`)
            if (!response.ok) {
                throw new Error(`Failed to fetch details for ${whichTable}`);
            }
            const data = await response.json()

            console.log(data)

            setShow(data[0]['title'])

            setShowAndTableAvailable(true)

            // Logic to change background on each button press

            const bgColor = randomColor()
            setBackgroundColor(bgColor)
        }

        // Function to retrieve specific table

        const fetchWhichTable = async () => {

            setShowAndTableAvailable(false)

            let localTablesUsed = [...tablesUsed];

            if (localTablesUsed.length === 3) {
                localTablesUsed = []
                setTablesUsed([])
            }

            let tableUsed = false

            while (!tableUsed) {

                const response = await fetch('https://first-choice-porpoise.ngrok-free.app/api/whichShowTable');

                if (!response.ok) {
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
                        fetchShowFromWhichTable(fetchedTable); // Assuming data is an array and we're using the first item
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

            setShow(data[0]['title'])

            // Logic to change background on each button press

            // const bgColor = randomColor()
            // setBackgroundColor(bgColor)
            // localStorage.setItem('showBackgroundColor', bgColor)
    }

    const deleteShow = async () => {

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        console.log(showID)
        console.log(`Requesting DELETE for show ID: ${showID}`);
        try {
            const response = await fetch(`https://first-choice-porpoise.ngrok-free.app/api/shows/${showID}`, {
                method: 'DELETE'
            })

            const data = await response.json()
            console.log(data.message)
        } catch (err) {
            console.log(err.message);
        }

        // toast('Deleted show!', {
        //     autoClose: 2000,
        //     theme: "light",
        //     });

        getShow()
    }

    const addToQueue = async () => {
        
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        try {
            const response = await fetch(`https://first-choice-porpoise.ngrok-free.app/api/addShowToQueue/${show}`, {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
            })

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Post failed: ${errorData.message || 'Unknown error'}`);
            }

            console.log(await response.json());
            console.log('Show added successfully.');
        } catch(error) {
            console.error('Error in API call', error);
        }

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
                tables={showTables}
                getFromSpecificTable={getFromSpecificTable}
                addToQueue={addToQueue}
            />
            <ContentCard 
                    whichTable={whichTable} 
                    availability={showAndTableAvailable} 
                    type={'show'} 
                    contentName={show}
                    setEntry={setShow}
            />
            <MainButtons getContent={getShow} deleteContent={deleteShow} type={'show'}/>
        </View>
        );
}

export default Show

