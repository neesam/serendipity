import { View } from "react-native";
import { useState, useEffect } from "react";

import * as Haptics from "expo-haptics";

import randomColor from "../utils/randomColor";
import { musicTables } from "../helper/lists";
import { containerStyles } from "../styles/styles";

import TopScreenFunctionality from "../components/TopScreenFunctionality";
import MainButtons from "../components/MainButtons";
import ContentCard from "../components/ContentCard";

const EXPO_PUBLIC_MUSIC_TABLES_DATASET =
    process.env.EXPO_PUBLIC_MUSIC_TABLES_DATASET;

interface SpecificAlbumOrEntryDataType {
    title: string;
    id: string;
    currently_listening?: string;
    original_table?: string;
}

interface GetAlbumDataType {
    rows: [{ title: string; id: string; currently_listening?: string }];
    randomTable: string;
}

export default function Album() {
    const [whichTable, setWhichTable] = useState("");
    const [album, setAlbum] = useState("");
    const [albumID, setAlbumID] = useState("");
    const [currentlyListening, setCurrentlyListening] = useState("");
    const [originalTable, setOriginalTable] = useState<string | null>(null);
    const [backgroundColor, setBackgroundColor] = useState("");
    const [albumAndTableAvailable, setAlbumAndTableAvailable] = useState(true);

    useEffect(() => {
        console.log(currentlyListening);
    }, [album, whichTable]);

    const getAlbum = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        setAlbumAndTableAvailable(false);

        // Function to fetch actual album

        const response = await fetch(
            `https://first-choice-porpoise.ngrok-free.app/api/whichMusicTable`
        );
        if (!response.ok) {
            throw new Error(`Failed to fetch details for ${whichTable}`);
        }

        const data: GetAlbumDataType = await response.json();

        setAlbum(data["rows"][0]["title"]);
        setAlbumID(data["rows"][0]["id"]);

        setCurrentlyListening(
            data["rows"][0]["currently_listening"] || "false"
        );

        setWhichTable(data["randomTable"]);

        setAlbumAndTableAvailable(true);

        // Logic to change background on each button press

        const bgColor = randomColor();
        setBackgroundColor(bgColor);
    };

    const getFromSpecificTable = async (specificTable: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        console.log(EXPO_PUBLIC_MUSIC_TABLES_DATASET);
        const response = await fetch(
            `https://first-choice-porpoise.ngrok-free.app/api/album/${specificTable}/${EXPO_PUBLIC_MUSIC_TABLES_DATASET}`
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch details for ${specificTable}`);
        }

        const data: [SpecificAlbumOrEntryDataType] = await response.json();

        console.log(data);

        const albumVal = data[0]["title"];
        const albumIDVal = data[0]["id"];
        const currently_listening = data[0]["currently_listening"] || "false";
        const originalTableVal = data[0]["original_table"] || null;
        const bgColor = randomColor();

        setAlbum(albumVal);
        setAlbumID(albumIDVal);
        setCurrentlyListening(currently_listening);
        setOriginalTable(originalTableVal);
        setWhichTable(specificTable);
        setBackgroundColor(bgColor);
    };

    const deleteAlbum = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        console.log(currentlyListening);

        if (currentlyListening === "false") {
            try {
                const response = await fetch(
                    `https://first-choice-porpoise.ngrok-free.app/api/albums/${albumID}/from/${whichTable}/${EXPO_PUBLIC_MUSIC_TABLES_DATASET}`,
                    {
                        method: "DELETE",
                        headers: { "Content-type": "application/json" },
                    }
                );

                if (!response.ok) {
                    const errorData = await response.json();
                    console.log(errorData);
                    throw new Error(
                        `Delete failed: ${errorData.message || "Unknown error"}`
                    );
                }

                console.log(await response.json());
                console.log("Album deleted successfully.");

                getFromSpecificTable(whichTable);
            } catch (error) {
                // console.error('Error during deletion:', error.message);
            }
        } else {
            if (originalTable !== null) {
                try {
                    const response = await fetch(
                        `https://first-choice-porpoise.ngrok-free.app/api/albums/${albumID}/${album}/${originalTable}/${EXPO_PUBLIC_MUSIC_TABLES_DATASET}`,
                        {
                            method: "DELETE",
                            headers: { "Content-type": "application/json" },
                        }
                    );

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(
                            `Delete failed: ${
                                errorData.message || "Unknown error"
                            }`
                        );
                    }

                    const data = await response.json();
                    console.log(
                        `Album deleted successfully from ${originalTable} and currentlyListening.`
                    );

                    getFromSpecificTable(whichTable);
                } catch (error) {
                    // console.error('Error during deletion:', error.message);
                }
            } else {
                try {
                    const response = await fetch(
                        `https://first-choice-porpoise.ngrok-free.app/api/albums/${albumID}/with/${album}`,
                        {
                            method: "DELETE",
                            headers: { "Content-type": "application/json" },
                        }
                    );

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(
                            `Delete failed: ${
                                errorData.message || "Unknown error"
                            }`
                        );
                    }

                    const data = await response.json();
                    console.log("Album deleted successfully.");

                    getFromSpecificTable(whichTable);
                } catch (error) {
                    // console.error('Error during deletion:', error.message);
                }
            }
        }
    };

    const addToCurrentlyListening = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        try {
            const response = await fetch(
                `https://first-choice-porpoise.ngrok-free.app/api/addToCurrentlyListening/${album}/${whichTable}`,
                {
                    method: "POST",
                    headers: { "Content-type": "application/json" },
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                console.log(errorData.message);
            }

            const data = await response.json();
            setCurrentlyListening("true");
        } catch (error) {
            if (error instanceof Error) {
                console.log(error);
            }
        }
    };

    const addToQueue = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        try {
            const response = await fetch(
                `https://first-choice-porpoise.ngrok-free.app/api/addAlbumToQueue/${album}`,
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
            console.log("Album added successfully.");
        } catch (error) {
            if (error instanceof Error) {
                console.log(error);
            }
        }
    };

    const getDataForSpecificEntry = async (title: string) => {
        try {
            const response = await fetch(
                `https://first-choice-porpoise.ngrok-free.app/api/specificMusicEntry/${title}/${whichTable}/${EXPO_PUBLIC_MUSIC_TABLES_DATASET}`
            );

            if (!response.ok) {
                const errorData = await response.json();
                console.log(errorData.message);
            }

            const data: [SpecificAlbumOrEntryDataType] = await response.json();

            setAlbum(data[0]["title"]);
            setAlbumID(data[0]["id"]);
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
                tables={musicTables}
                getFromSpecificTable={getFromSpecificTable}
                addToQueue={addToQueue}
            />
            <ContentCard
                whichTable={whichTable}
                availability={albumAndTableAvailable}
                type={"album"}
                contentName={album}
                getDataForSpecificEntry={getDataForSpecificEntry}
            />
            <MainButtons
                getContent={getAlbum}
                deleteContent={deleteAlbum}
                type={"album"}
                currentlyListening={currentlyListening}
                addToCurrentlyListening={addToCurrentlyListening}
                availability={albumAndTableAvailable}
                contentName={album}
            />
        </View>
    );
}
