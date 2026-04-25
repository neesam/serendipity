import { View } from "react-native";
import { useState, useEffect } from "react";

import * as Haptics from "expo-haptics";

import { containerStyles } from "../styles/styles";
import TopScreenFunctionality from "../components/TopScreenFunctionality";
import { filmTables, filmTablesMap } from "@/helper/lists";
import MainButtons from "../components/MainButtons";
import ContentCard from "../components/ContentCard";
import randomColor from "../utils/randomColor";

const EXPO_PUBLIC_FILM_TABLES_DATASET =
    process.env.EXPO_PUBLIC_FILM_TABLES_DATASET;

const EXPO_PUBLIC_RAILWAY_URL = process.env.EXPO_PUBLIC_RAILWAY_URL;

const API_BASE_URL = __DEV__
    ? "http://10.0.0.164:5002"
    : EXPO_PUBLIC_RAILWAY_URL;

interface GetFilmDataType {
    rows: [{ title: string; id: string; currently_in_stremio?: string }];
    randomTable: string;
}

interface SpecificEntryDataType {
    title: string;
    id: string;
}

const Film = () => {
    const [whichTable, setWhichTable] = useState("");
    const [film, setFilm] = useState("");
    const [filmID, setFilmID] = useState("");
    const [backgroundColor, setBackgroundColor] = useState("");
    const [filmAndTableAvailable, setFilmAndTableAvailable] = useState(true);
    const [inStremio, setInStremio] = useState("");

    useEffect(() => {}, [film, whichTable]);

    const getFilm = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        setFilmAndTableAvailable(false);

        const response = await fetch(`${API_BASE_URL}/api/whichFilmTable`);

        if (!response.ok) {
            throw new Error(`Failed to fetch details for ${whichTable}`);
        } else {
            const data: GetFilmDataType = await response.json();

            setFilm(data["data"][0]["title"]);
            setFilmID(data["data"][0]["id"]);
            setWhichTable(filmTablesMap[data["randomTable"]]);
            setInStremio(data["data"][0]["currently_in_stremio"] || "false");

            setFilmAndTableAvailable(true);

            const bgColor = randomColor();
            setBackgroundColor(bgColor);
        }
    };

    const deleteFilm = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        const whichTableKey = Object.keys(filmTablesMap).find(
            (key) => filmTablesMap[key] == whichTable,
        );

        try {
            const response = await fetch(
                `${API_BASE_URL}/api/film/${filmID}/from/${whichTableKey}/${EXPO_PUBLIC_FILM_TABLES_DATASET}`,
                {
                    method: "DELETE",
                    headers: { "Content-type": "application/json" },
                },
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    `Delete failed: ${errorData.message || "Unknown error"}`,
                );
            } else {
                console.log(await response.json());
                console.log("Film deleted successfully.");
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error during deletion:", error.message);
            }
        }

        getFromSpecificTable(whichTableKey);
    };

    const getFromSpecificTable = async (specificTable: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        console.log(specificTable);

        if (specificTable === "film_international") {
            try {
                const response = await fetch(
                    `${API_BASE_URL}/api/${specificTable}/${EXPO_PUBLIC_FILM_TABLES_DATASET}/film`,
                );

                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch details for ${specificTable}`,
                    );
                } else {
                    const data: [SpecificEntryDataType] = await response.json();

                    console.log(data);

                    setFilm(data["data"][0]["title"]);
                    setFilmID(data["data"][0]["id"]);
                    setWhichTable(filmTablesMap[specificTable]);
                    setInStremio(
                        data["data"][0]["currently_in_stremio"] || "false",
                    );
                }
            } catch (error) {
                if (error instanceof Error) {
                    console.log("Error in getFromSpecificTable", error.message);
                }
            } finally {
                // Logic to change background on each button press

                const bgColor = randomColor();
                setBackgroundColor(bgColor);
            }
        } else {
            try {
                const response = await fetch(
                    `${API_BASE_URL}/api/${specificTable}/${EXPO_PUBLIC_FILM_TABLES_DATASET}/film`,
                );

                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch details for ${specificTable}`,
                    );
                } else {
                    const data: [SpecificEntryDataType] = await response.json();

                    setFilm(data["data"][0]["title"]);
                    setFilmID(data["data"][0]["id"]);
                    setWhichTable(filmTablesMap[specificTable]);
                    setInStremio(
                        data["data"][0]["currently_in_stremio"] || "false",
                    );
                }
            } catch (error) {
                if (error instanceof Error) {
                    console.log("Error in getFromSpecificTable", error.message);
                }
            } finally {
                // Logic to change background on each button press

                const bgColor = randomColor();
                setBackgroundColor(bgColor);
            }
        }
    };

    const getDataForSpecificEntry = async (title: string) => {
        const whichTableKey = Object.keys(filmTablesMap).find(
            (key) => filmTablesMap[key] == whichTable,
        );
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/specificFilmEntry/${title}/${whichTableKey}/${EXPO_PUBLIC_FILM_TABLES_DATASET}`,
            );

            if (!response.ok) {
                const errorData = await response.json();
                console.log(errorData.message);
            } else {
                const data: [SpecificEntryDataType] = await response.json();

                setFilm(data["data"][0]["title"]);
                setFilmID(data["data"][0]["id"]);
            }
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
            }
        }
    };

    const addToStremio = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/add_to_film_table/film_stremiolibrary/${film}/${EXPO_PUBLIC_FILM_TABLES_DATASET}/2`,
                {
                    method: "POST",
                    headers: { "Content-type": "application/json" },
                },
            );

            if (!response.ok) {
                console.log(response);
                const errorData = await response.json();
                console.log(errorData.message);
            } else {
                const data = await response.json();
                setInStremio("true");
            }
        } catch (error) {
            if (error instanceof Error) {
                console.log(error, "fuck");
            }
        }
    };

    const addToQueue = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        try {
            const response = await fetch(
                `${API_BASE_URL}/api/addFilmToQueue/${film}`,
                {
                    method: "POST",
                    headers: { "Content-type": "application/json" },
                },
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    `Post failed: ${errorData.message || "Unknown error"}`,
                );
            } else {
                console.log("Film added successfully.");
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message);
            }
        }
    };

    const createStremioOutput = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        try {
            const response = await fetch(
                `${API_BASE_URL}/api/create_stremio_output`,
            );

            const data = await response.json();

            console.log(data);
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
            }
        }
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
                createStremioOutput={createStremioOutput}
                type={"film"}
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
                addToCurrentlyListening={addToStremio}
                currentlyListening={inStremio}
            />
        </View>
    );
};

export default Film;
