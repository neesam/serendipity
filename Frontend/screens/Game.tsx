import { useEffect, useState } from "react";
import { View } from "react-native";

import * as Haptics from "expo-haptics";

import { containerStyles } from "../styles/styles";
import randomColor from "../utils/randomColor";
import TopScreenFunctionality from "../components/TopScreenFunctionality";
import MainButtons from "../components/MainButtons";
import ContentCard from "../components/ContentCard";
import { bookTables, bookTablesMap } from "../helper/lists";

const EXPO_PUBLIC_GAME_TABLES_DATASET =
    process.env.EXPO_PUBLIC_GAME_TABLES_DATASET;

const EXPO_PUBLIC_RAILWAY_URL = process.env.EXPO_PUBLIC_RAILWAY_URL;

const API_BASE_URL = __DEV__
    ? "http://192.168.0.159:5002"
    : EXPO_PUBLIC_RAILWAY_URL;

interface SpecificEntryDataType {
    title: string;
    id: string;
}

const Book = () => {
    const [book, setBook] = useState("");
    const [bookID, setBookID] = useState("");
    const [backgroundColor, setBackgroundColor] = useState("");
    const [bookAndTableAvailable, setBookAndTableAvailable] = useState(true);
    const [whichTable, setWhichTable] = useState("");

    useEffect(() => {}, [book]);

    const getBook = async () => {
        // Function to fetch actual album

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        setBookAndTableAvailable(false);

        try {
            const response = await fetch(`${API_BASE_URL}/api/whichBookTable`);

            if (!response.ok) {
                throw new Error(`Failed to fetch details for book table`);
            }

            const data = await response.json();

            setBookID(data["data"][0]["id"]);
            setBook(data["data"][0]["title"]);

            setWhichTable(data["randomTable"]);

            // Logic to change background on each button press

            const bgColor = randomColor();
            setBackgroundColor(bgColor);
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
            }
        } finally {
            setBookAndTableAvailable(true);
        }
    };

    const deleteBook = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        try {
            const response = await fetch(
                `${API_BASE_URL}/api/books/${bookID}/from/${whichTable}/${EXPO_PUBLIC_GAME_TABLES_DATASET}`,
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

            console.log(await response.json());
            console.log("Book deleted successfully.");
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error during deletion:", error.message);
            }
        }

        getBook();
    };

    const addToQueue = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        try {
            const response = await fetch(
                `${API_BASE_URL}/api/addBookToQueue/${book}`,
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
            console.log("Book added successfully.");
        } catch (error) {
            console.error("Error in API call", error);
        }
    };

    const getDataForSpecificEntry = async (title: string) => {
        const whichTableKey = Object.keys(bookTablesMap).find(
            (key) => bookTablesMap[key] == whichTable,
        );

        try {
            const response = await fetch(
                `${API_BASE_URL}/api/specificBookEntry/${title}/${whichTableKey}/${EXPO_PUBLIC_GAME_TABLES_DATASET}`,
            );

            if (!response.ok) {
                const errorData = await response.json();
                console.log(errorData.message);
            }

            const data: [SpecificEntryDataType] = await response.json();

            setBook(data[0]["title"]);
            setBookID(data[0]["id"]);
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
            }
        }
    };

    const getFromSpecificTable = async (specificTable: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        const response = await fetch(
            `${API_BASE_URL}/api/${specificTable}/${EXPO_PUBLIC_GAME_TABLES_DATASET}/book`,
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch details for ${specificTable}`);
        }

        const data: [SpecificEntryDataType] = await response.json();

        console.log(data);

        const bookVal = data["data"][0]["title"];
        const bookIDVal = data["data"][0]["id"];
        const bgColor = randomColor();

        setBook(bookVal);
        setBookID(bookIDVal);
        setWhichTable(bookTablesMap[specificTable]);
        setBackgroundColor(bgColor);
    };

    const screenStyle = {
        backgroundColor: backgroundColor,
    };

    return (
        <View style={[containerStyles.screenContainer, screenStyle]}>
            <TopScreenFunctionality
                containerStyles={containerStyles}
                addToQueue={addToQueue}
                type={"book"}
                tables={bookTables}
                getFromSpecificTable={getFromSpecificTable}
            />
            <ContentCard
                type={"book"}
                contentName={book}
                availability={bookAndTableAvailable}
                whichTable={whichTable}
                getDataForSpecificEntry={getDataForSpecificEntry}
            />
            <MainButtons
                getContent={getBook}
                deleteContent={deleteBook}
                type={"book"}
                availability={bookAndTableAvailable}
                contentName={book}
            />
        </View>
    );
};

export default Book;
