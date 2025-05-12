import { View, StyleSheet, Text, Pressable } from "react-native";
import { useState, useEffect } from "react";

import * as Haptics from "expo-haptics";

import {
    cardStyles,
    containerStyles,
    buttonStyles,
    modalStyles,
} from "../styles/styles";
import TopScreenFunctionality from "../components/TopScreenFunctionality";
import { filmTables } from "@/helper/lists";
import MainButtons from "../components/MainButtons";
import ContentCard from "../components/ContentCard";
import randomColor from "../utils/randomColor";

const EXPO_PUBLIC_FILM_TABLES_DATASET =
    process.env.EXPO_PUBLIC_FILM_TABLES_DATASET;

const Film = () => {
    const [whichTable, setWhichTable] = useState("");
    const [film, setFilm] = useState("");
    const [filmID, setFilmID] = useState("");
    const [backgroundColor, setBackgroundColor] = useState("");
    const [filmAndTableAvailable, setFilmAndTableAvailable] = useState(true);

    useEffect(() => {}, [film, whichTable]);

    const getFilm = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        setFilmAndTableAvailable(false);
        const response = await fetch(
            `https://first-choice-porpoise.ngrok-free.app/api/whichFilmTable`
        );
        if (!response.ok) {
            throw new Error(`Failed to fetch details for ${whichTable}`);
        }
        const data = await response.json();

        setFilm(data["rows"][0]["title"]);
        setFilmID(data["rows"][0]["id"]);
        setWhichTable(data["randomTable"]);

        setFilmAndTableAvailable(true);

        const bgColor = randomColor();
        setBackgroundColor(bgColor);
    };

    const deleteFilm = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        try {
            const response = await fetch(
                `https://first-choice-porpoise.ngrok-free.app/api/film/${filmID}/from/${whichTable}/${EXPO_PUBLIC_FILM_TABLES_DATASET}`,
                {
                    method: "DELETE",
                    headers: { "Content-type": "application/json" },
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    `Delete failed: ${errorData.message || "Unknown error"}`
                );
            }

            console.log(await response.json());
            console.log("Film deleted successfully.");
        } catch (error) {
            // console.error('Error during deletion:', error.message);
        }

        getFromSpecificTable(whichTable);
    };

    const getFromSpecificTable = async (specificTable: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        const response = await fetch(
            `https://first-choice-porpoise.ngrok-free.app/api/film/${specificTable}/${EXPO_PUBLIC_FILM_TABLES_DATASET}`
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch details for ${specificTable}`);
        }

        const data = await response.json();

        console.log(data);

        setFilm(data[0]["title"]);
        setFilmID(data[0]["id"]);
        setWhichTable(specificTable);

        // Logic to change background on each button press

        const bgColor = randomColor();
        setBackgroundColor(bgColor);
    };

    const getDataForSpecificEntry = async (title: string) => {
        try {
            const response = await fetch(
                `https://first-choice-porpoise.ngrok-free.app/api/specificFilmEntry/${title}/${whichTable}/${EXPO_PUBLIC_FILM_TABLES_DATASET}`
            );

            if (!response.ok) {
                const errorData = await response.json();
                console.log(errorData.message);
            }

            const data = await response.json();

            setFilm(data[0]["title"]);
            setFilmID(data[0]["id"]);
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
            }
        }
    };

    const addToQueue = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        try {
            const response = await fetch(
                `https://first-choice-porpoise.ngrok-free.app/api/addFilmToQueue/${film}`,
                {
                    method: "POST",
                    headers: { "Content-type": "application/json" },
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    `Post failed: ${errorData.message || "Unknown error"}`
                );
            }

            console.log(await response.json());
            console.log("Film added successfully.");
        } catch (error) {
            console.error("Error in API call", error);
        }

        // toast('Added to queue!', {
        //     autoClose: 2000,
        //     theme: "light",
        //     });
    };

    const screenStyle = {
        backgroundColor: backgroundColor,
    };

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
                type={"film"}
                contentName={film}
                getDataForSpecificEntry={getDataForSpecificEntry}
            />
            <MainButtons
                getContent={getFilm}
                deleteContent={deleteFilm}
                type={"film"}
                availability={filmAndTableAvailable}
                contentName={film}
            />
        </View>
    );
};

export default Film;
