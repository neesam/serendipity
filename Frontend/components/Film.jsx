import { View, StyleSheet, Text, Pressable } from "react-native";
import { useState, useEffect } from "react";

import * as Haptics from 'expo-haptics';

import { cardStyles, containerStyles, buttonStyles, modalStyles } from '../Styles/Styles'
import TopScreenFunctionality from "./TopScreenFunctionality";
import { filmTables } from "@/helper/lists";
import MainButtons from "./MainButtons.jsx";
import ContentCard from "./ContentCard.jsx";
import randomColor from '../helper/randomColor'

// import { ToastContainer, toast } from 'react-toastify';

const Film = () => {

    const [whichTable, setWhichTable] = useState('')
    const [film, setFilm] = useState('')
    const [filmID, setFilmID] = useState('')
    const [tablesUsed, setTablesUsed] = useState([])
    const [backgroundColor, setBackgroundColor] = useState('')
    const [filmAndTableAvailable, setFilmAndTableAvailable] = useState(true)

    useEffect(() => {

    }, [film, whichTable]);

    const getFilm = async () => {

        const fetchFilmFromWhichTable = async (whichTable) => {
            const response = await fetch(`https://first-choice-porpoise.ngrok-free.app/api/${whichTable}`)
            if (!response.ok) {
                throw new Error(`Failed to fetch details for ${whichTable}`);
            }
            const data = await response.json()

            setFilm(data[0]['title'])
            setFilmID(data[0]['id'])

            setFilmAndTableAvailable(true)

            const bgColor = randomColor()
            setBackgroundColor(bgColor)
        }

        const fetchWhichTable = async () => {

            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

            setFilmAndTableAvailable(false)

            let localTablesUsed = [...tablesUsed];

            if (localTablesUsed.length === 8) {
                localTablesUsed = []
                setTablesUsed([])
            }

            let tableUsed = false

            while (!tableUsed) {

                const response = await fetch('https://first-choice-porpoise.ngrok-free.app/api/whichFilmTable');

                if (!response.ok) {
                    throw new Error('Failed to fetch whichTable');
                }

                const data = await response.json()
                const fetchedTable = data[0]['title']

                console.log(data)

                if (!localTablesUsed.includes(fetchedTable)) {

                    tableUsed = true

                    setWhichTable(fetchedTable)

                    localTablesUsed.push(fetchedTable);
                    setTablesUsed(localTablesUsed);
                    console.log('After update:', [...tablesUsed, fetchedTable]);

                    if (data.length > 0) {
                        fetchFilmFromWhichTable(fetchedTable); // Assuming data is an array and we're using the first item
                    }
                }
            }
        }

        fetchWhichTable();
    }

    const deleteFilm = async () => {

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        try {

            const response = await fetch(`https://first-choice-porpoise.ngrok-free.app/api/film/${filmID}/${whichTable}`, {
                method: 'DELETE',
                headers: { 'Content-type': 'application/json' },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Delete failed: ${errorData.message || 'Unknown error'}`);
            }

            console.log(await response.json());
            console.log('Film deleted successfully.');
        } catch (error) {
            console.error('Error during deletion:', error.message);
        }

        // toast('Deleted film!', {
        //         autoClose: 2000,
        //         theme: "light",
        // });

        getFilm()
    };

    const getFromSpecificTable = async (specificTable) => {

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        const response = await fetch(`https://first-choice-porpoise.ngrok-free.app/api/${specificTable}`)

        if (!response.ok) {
            throw new Error(`Failed to fetch details for ${specificTable}`);
        }

        const data = await response.json()

        console.log(data)

        setFilm(data[0]['title'])
        setFilmID(data[0]['id'])
        setWhichTable(specificTable)

        // Logic to change background on each button press

        const bgColor = randomColor()
        setBackgroundColor(bgColor)
    }

    const addToQueue = async () => {

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        try {
            const response = await fetch(`https://first-choice-porpoise.ngrok-free.app/api/addFilmToQueue/${film}`, {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
            })

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Post failed: ${errorData.message || 'Unknown error'}`);
            }

            console.log(await response.json());
            console.log('Film added successfully.');
        } catch (error) {
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
                tables={filmTables}
                getFromSpecificTable={getFromSpecificTable}
                addToQueue={addToQueue}
            />
            <ContentCard
                whichTable={whichTable}
                availability={filmAndTableAvailable}
                type={'film'}
                contentName={film}
                setEntry={setFilm}
            />
            <MainButtons
                getContent={getFilm}
                deleteContent={deleteFilm}
                type={'film'}
                availability={filmAndTableAvailable}
                contentName={film}
            />
        </View>
    );
}

export default Film