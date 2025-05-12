import { View } from "react-native";
import { useState, useEffect } from "react";

import * as Haptics from "expo-haptics";

import { containerStyles } from "../styles/styles";
import { showTables } from "../helper/lists";
import TopScreenFunctionality from "../components/TopScreenFunctionality";
import MainButtons from "../components/MainButtons";
import ContentCard from "../components/ContentCard";
import randomColor from "../utils/randomColor";

const EXPO_PUBLIC_SHOW_TABLES_DATASET =
    process.env.EXPO_PUBLIC_SHOW_TABLES_DATASET;

const Show = () => {
    const [whichTable, setWhichTable] = useState("");
    const [show, setShow] = useState("");
    const [showID, setShowID] = useState("");
    const [backgroundColor, setBackgroundColor] = useState("");
    const [showAndTableAvailable, setShowAndTableAvailable] = useState(true);

    useEffect(() => {}, [show]);

    const getShow = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        setShowAndTableAvailable(false);

        const response = await fetch(
            `https://first-choice-porpoise.ngrok-free.app/api/whichShowTable`
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch details for ${whichTable}`);
        }

        const data = await response.json();

        setShow(data["rows"][0]["title"]);
        setWhichTable(data["randomTable"]);

        setShowAndTableAvailable(true);

        const bgColor = randomColor();
        setBackgroundColor(bgColor);
    };

    const getFromSpecificTable = async (specificTable: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        const response = await fetch(
            `https://first-choice-porpoise.ngrok-free.app/api/show/${specificTable}/${EXPO_PUBLIC_SHOW_TABLES_DATASET}`
        );
        if (!response.ok) {
            throw new Error(`Failed to fetch details for ${specificTable}`);
        }
        const data = await response.json();

        console.log(data);

        setShow(data[0]["title"]);
        setWhichTable(specificTable);

        // Logic to change background on each button press

        const bgColor = randomColor();
        setBackgroundColor(bgColor);
    };

    const deleteShow = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        console.log(showID);
        console.log(`Requesting DELETE for show ID: ${showID}`);
        try {
            const response = await fetch(
                `https://first-choice-porpoise.ngrok-free.app/api/shows/${showID}`,
                {
                    method: "DELETE",
                }
            );

            const data = await response.json();
            console.log(data.message);
        } catch (err) {
            if (err instanceof Error) {
                console.error(err.message);
            }
        }

        getShow();
    };

    const addToQueue = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        try {
            const response = await fetch(
                `https://first-choice-porpoise.ngrok-free.app/api/addShowToQueue/${show}`,
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
            console.log("Show added successfully.");
        } catch (error) {
            console.error("Error in API call", error);
        }

        // toast('Added to queue!', {
        //     autoClose: 2000,
        //     theme: "light",
        //     });
    };

    const getDataForSpecificEntry = async (title: string) => {
        try {
            const response = await fetch(
                `https://first-choice-porpoise.ngrok-free.app/api/specificShowEntry/${title}/${whichTable}/${EXPO_PUBLIC_SHOW_TABLES_DATASET}`
            );

            if (!response.ok) {
                const errorData = await response.json();
                console.log(errorData.message);
            }

            const data = await response.json();

            setShow(data[0]["title"]);
            setShowID(data[0]["id"]);
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
                tables={showTables}
                getFromSpecificTable={getFromSpecificTable}
                addToQueue={addToQueue}
            />
            <ContentCard
                whichTable={whichTable}
                availability={showAndTableAvailable}
                type={"show"}
                contentName={show}
                getDataForSpecificEntry={getDataForSpecificEntry}
            />
            <MainButtons
                getContent={getShow}
                deleteContent={deleteShow}
                type={"show"}
                availability={showAndTableAvailable}
                contentName={show}
            />
        </View>
    );
};

export default Show;
