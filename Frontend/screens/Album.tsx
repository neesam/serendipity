import { View } from "react-native";
import { useState, useEffect } from "react";

import * as Haptics from "expo-haptics";

import randomColor from "../utils/randomColor";
import { musicTables, musicTablesMap } from "../helper/lists";
import { containerStyles } from "../styles/styles";

import TopScreenFunctionality from "../components/TopScreenFunctionality";
import MainButtons from "../components/MainButtons";
import ContentCard from "../components/ContentCard";

const EXPO_PUBLIC_MUSIC_TABLES_DATASET =
    process.env.EXPO_PUBLIC_MUSIC_TABLES_DATASET;

const EXPO_PUBLIC_RAILWAY_URL = process.env.EXPO_PUBLIC_RAILWAY_URL;

const API_BASE_URL = __DEV__
    ? "http://192.168.0.86:5002"
    : EXPO_PUBLIC_RAILWAY_URL;

// interface SpecificAlbumOrEntryDataType {
//     title: string;
//     id: string;
//     currently_listening?: string;
//     original_table?: string;
// }

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
        console.log(originalTable)
    }, [album, whichTable]);

    const getAlbum = async () => {
        const start = Date.now();
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        setAlbumAndTableAvailable(false);

        console.log(`${API_BASE_URL}/api/whichMusicTable`);

        // Function to fetch actual album

        const response = await fetch(`${API_BASE_URL}/api/whichMusicTable`);

        if (!response.ok) {
            throw new Error(`Failed to fetch details for ${whichTable}`);
        }

        const data: GetAlbumDataType = await response.json();
        const responseTime = Date.now() - start;
        console.log(responseTime);

        console.log(data);

        setAlbum(data["data"][0]["name"] || data["data"][0]["title"]);
        setAlbumID(data["data"][0]["id"]);

        setCurrentlyListening(
            data["data"][0]["currently_listening"] || "false",
        );

        setWhichTable(musicTablesMap[data["randomTable"]]);

        setAlbumAndTableAvailable(true);

        // Logic to change background on each button press

        const bgColor = randomColor();
        setBackgroundColor(bgColor);

        try {
            const response = await fetch(
                `${API_BASE_URL}/api/update_fetch_count/${data['randomTable']}`,
                {
                    method: "POST",
                    headers: { "Content-type": "application/json" },
                },
            );

            if (!response.ok) {
                const errorData = await response.json();
                console.log(errorData.message);
            }

            await response.json();
            } catch (error) {
                if (error instanceof Error) {
                    console.log(error);
                }
            }
    };

    const getFromSpecificTable = async (specificTable: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        const response = await fetch(
            `${API_BASE_URL}/api/${specificTable}/${EXPO_PUBLIC_MUSIC_TABLES_DATASET}/album`,
        );

        console.log(
            `${API_BASE_URL}/api/${specificTable}/${EXPO_PUBLIC_MUSIC_TABLES_DATASET}/album`,
        );

        if (response["error"]) {
            console.log(response);
        }

        const data = await response.json();

        console.log("------>", data);

        const albumVal = data["data"][0]["title"];
        const albumIDVal = data["data"][0]["id"];
        const currently_listening =
            data["data"][0]["currently_listening"] || "false";
        const originalTableVal = data["data"][0]["original_table"] || null;
        const bgColor = randomColor();

        setAlbum(albumVal);
        setAlbumID(albumIDVal);
        setCurrentlyListening(currently_listening);
        setOriginalTable(originalTableVal);
        setWhichTable(musicTablesMap[specificTable]);
        setBackgroundColor(bgColor);
    };

    const deleteAlbum = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        const tempAlbumID = albumID;
        const tempAlbum = album;

        // Gets actual title of table for whichTable

        const whichTableKey = Object.keys(musicTablesMap).find(
            (key) => musicTablesMap[key] == whichTable,
        );

        // If album is not in currently listening table...

        if (currentlyListening === "false") {
            console.log("Not currently listening");
            try {
                const response = await fetch(
                    `${API_BASE_URL}/api/albums/${tempAlbumID}/from/${originalTable}/${EXPO_PUBLIC_MUSIC_TABLES_DATASET}`,
                    {
                        method: "DELETE",
                        headers: { "Content-type": "application/json" },
                    },
                );

                if (!response.ok) {
                    const errorData = await response.json();
                    console.log(errorData);
                    throw new Error(
                        `Delete failed: ${errorData.message || "Unknown error"}`,
                    );
                }

                console.log(await response.json());
                console.log("Album deleted successfully.");
            } catch (error) {
                if (error instanceof Error) {
                    console.error("Error during deletion:", error.message);
                }
            }

            getFromSpecificTable(whichTableKey);
        } else if (originalTable) {
            console.log("Currently listening and ");
            try {
                const response = await fetch(
                    `${API_BASE_URL}/api/albums/${tempAlbumID}/${tempAlbum}/${originalTable}/${EXPO_PUBLIC_MUSIC_TABLES_DATASET}`,
                    {
                        method: "DELETE",
                        headers: { "Content-type": "application/json" },
                    },
                );
                console.log(`${API_BASE_URL}/api/albums/${tempAlbumID}/${tempAlbum}/${originalTable}/${EXPO_PUBLIC_MUSIC_TABLES_DATASET}`,)


                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(
                        `Delete failed: ${errorData.message || "Unknown error"}`,
                    );
                }

                const data = await response.json();
                console.log("Album deleted successfully.");
            } catch (error) {
                if (error instanceof Error) {
                    console.error("Error during deletion:", error.message);
                }
            }

            getFromSpecificTable(whichTableKey);

            try {
                const response = await fetch(
                    `${API_BASE_URL}/api/delete_from_spotify/${album}`,
                    {
                        method: "POST",
                        headers: { "Content-type": "application/json" },
                    },
                );

                if (!response.ok) {
                    const errorData = await response.json();
                    console.log(errorData.message);
                }

                const data = await response.json();
            } catch (error) {
                if (error instanceof Error) {
                    console.log(error);
                }
            }

            // If album was added to currently listening table manually...
        } else {
            try {
                const response = await fetch(
                    `${API_BASE_URL}/api/albums/${tempAlbumID}/with/${tempAlbum}/${EXPO_PUBLIC_MUSIC_TABLES_DATASET}`,
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
                }

                const data = await response.json();
                console.log("Album deleted successfully.");
            } catch (error) {
                if (error instanceof Error) {
                    console.error("Error during deletion:", error.message);
                }
            }

            getFromSpecificTable(whichTableKey);

            try {
                const response = await fetch(
                    `${API_BASE_URL}/api/delete_from_spotify/${album}`,
                    {
                        method: "POST",
                        headers: { "Content-type": "application/json" },
                    },
                );

                if (!response.ok) {
                    const errorData = await response.json();
                    console.log(errorData.message);
                }

                const data = await response.json();
            } catch (error) {
                if (error instanceof Error) {
                    console.log(error);
                }
            }

        }
    };

    const addToCurrentlyListening = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        const whichTableKey = Object.keys(musicTablesMap).find(
            (key) => musicTablesMap[key] == whichTable,
        );
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/add_to_music_table/${album}/${whichTableKey}/${EXPO_PUBLIC_MUSIC_TABLES_DATASET}/4/5`,
                {
                    method: "POST",
                    headers: { "Content-type": "application/json" },
                },
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

        try {
            const response = await fetch(
                `${API_BASE_URL}/api/add_to_spotify`,
                {
                    method: "POST",
                    headers: { "Content-type": "application/json" },
                },
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
                `${API_BASE_URL}/api/addAlbumToQueue/${album}`,
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
            }

            console.log(await response.json());
            console.log("Album added successfully.");
        } catch (error) {
            if (error instanceof Error) {
                console.log(error);
            }
        }
    };

    const addToSpotifyPlaylist = async (playlist, album) => {
        
         try {
            const response = await fetch(
                `${API_BASE_URL}/api/add_to_rym_spotify_playlist/${album}/${playlist}/${originalTable}`
            );

            if (!response.ok) {
                const errorData = await response.json();
                console.log(errorData.message);
            }

            const data = await response.json();

        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
            }
        }

        deleteAlbum()
    }

    const getDataForSpecificEntry = async (title: string) => {
        console.log(whichTable);
        console.log(title);

        const whichTableKey = Object.keys(musicTablesMap).find(
            (key) => musicTablesMap[key] == whichTable,
        );

        console.log(
            `${API_BASE_URL}/api/specificMusicEntry/${title}/${whichTableKey}/${EXPO_PUBLIC_MUSIC_TABLES_DATASET}`,
        );

        try {
            const response = await fetch(
                `${API_BASE_URL}/api/specificMusicEntry/${title}/${whichTableKey}/${EXPO_PUBLIC_MUSIC_TABLES_DATASET}`,
            );

            if (!response.ok) {
                const errorData = await response.json();
                console.log(errorData.message);
            }

            const data: [SpecificAlbumOrEntryDataType] = await response.json();

            setAlbum(data["data"][0]["title"]);
            setAlbumID(data["data"][0]["id"]);
            setOriginalTable(data["data"][0]["original_table"] || null);
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
                contentName={album}
                type={"album"}
            />
            <ContentCard
                whichTable={whichTable}
                originTable={originalTable}
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
                addToSpotifyPlaylist={addToSpotifyPlaylist}
            />
        </View>
    );
}
