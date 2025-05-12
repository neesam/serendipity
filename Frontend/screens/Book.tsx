import { useEffect, useState } from "react";
import { View } from "react-native";

import * as Haptics from "expo-haptics";

import { bookAnthologies } from "../helper/lists";
import { containerStyles } from "../styles/styles";
import randomColor from "../utils/randomColor";
import TopScreenFunctionality from "../components/TopScreenFunctionality";
import MainButtons from "../components/MainButtons";
import ContentCard from "../components/ContentCard";
import { bookTables } from "../helper/lists";

const EXPO_PUBLIC_BOOK_TABLES_DATASET =
    process.env.EXPO_PUBLIC_BOOK_TABLES_DATASET;

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
            const response = await fetch(
                `https://first-choice-porpoise.ngrok-free.app/api/whichBookTable`
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch details for book table`);
            }

            const data = await response.json();

            if (bookAnthologies.includes(data["rows"][0]["title"])) {
                const getRandomInt = (min: number, max: number) => {
                    const minCeiled = Math.ceil(min);
                    const maxFloored = Math.floor(max);
                    return Math.floor(
                        Math.random() * (maxFloored - minCeiled) + minCeiled
                    );
                };
                setBookID(data["rows"][0]["id"]);
                setBook(data["rows"][0]["title"] + " " + getRandomInt(2, 5));
            } else {
                setBookID(data["rows"][0]["id"]);
                setBook(data["rows"][0]["title"]);
            }

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
                `https://first-choice-porpoise.ngrok-free.app/api/book/${bookID}/from/${whichTable}/${EXPO_PUBLIC_BOOK_TABLES_DATASET}`,
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
                `https://first-choice-porpoise.ngrok-free.app/api/addBookToQueue/${book}`,
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
            console.log("Book added successfully.");
        } catch (error) {
            console.error("Error in API call", error);
        }
    };

    const getDataForSpecificEntry = async (title: string) => {
        try {
            const response = await fetch(
                `https://first-choice-porpoise.ngrok-free.app/api/specificBookEntry/${title}/${whichTable}/${EXPO_PUBLIC_BOOK_TABLES_DATASET}`
            );

            if (!response.ok) {
                const errorData = await response.json();
                console.log(errorData.message);
            }

            const data = await response.json();

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
            `https://first-choice-porpoise.ngrok-free.app/api/book/${specificTable}/${EXPO_PUBLIC_BOOK_TABLES_DATASET}`
        );

        console.log(response);

        if (!response.ok) {
            throw new Error(`Failed to fetch details for ${specificTable}`);
        }

        const data = await response.json();

        console.log(data);

        const bookVal = data[0]["title"];
        const bookIDVal = data[0]["id"];
        const bgColor = randomColor();

        setBook(bookVal);
        setBookID(bookIDVal);
        setWhichTable(specificTable);
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
