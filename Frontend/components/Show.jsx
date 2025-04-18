import { View } from "react-native";
import { useState, useEffect } from "react";

import * as Haptics from "expo-haptics";

import { containerStyles } from "../Styles/Styles";
import { showTables } from "../helper/lists";
import TopScreenFunctionality from "./TopScreenFunctionality";
import MainButtons from "./MainButtons";
import ContentCard from "./ContentCard";
import randomColor from "../helper/randomColor";

// import { ToastContainer, toast } from 'react-toastify';

const Show = () => {
    const [whichTable, setWhichTable] = useState("");
    const [show, setShow] = useState("");
    const [showID, setShowID] = useState("");
    const [backgroundColor, setBackgroundColor] = useState("");
    const [showAndTableAvailable, setShowAndTableAvailable] = useState(true);

    useEffect(() => { }, [show]);

    const getShow = async () => {

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        setShowAndTableAvailable(false);

        const response = await fetch(
            `https://first-choice-porpoise.ngrok-free.app/api/whichShowTable`,
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch details for ${whichTable}`);
        }

        const data = await response.json();


        setShow(data['rows'][0]["title"]);
        setWhichTable(data['randomTable'])

        setShowAndTableAvailable(true);

        const bgColor = randomColor();
        setBackgroundColor(bgColor);
    };

    const getFromSpecificTable = async (specificTable) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        const response = await fetch(
            `https://first-choice-porpoise.ngrok-free.app/api/${specificTable}`,
        );
        if (!response.ok) {
            throw new Error(`Failed to fetch details for ${specificTable}`);
        }
        const data = await response.json();

        console.log(data);

        setShow(data[0]["title"]);
        setWhichTable(specificTable)

        // Logic to change background on each button press

        const bgColor = randomColor()
        setBackgroundColor(bgColor)
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
                },
            );

            const data = await response.json();
            console.log(data.message);
        } catch (err) {
            console.log(err.message);
        }

        // toast('Deleted show!', {
        //     autoClose: 2000,
        //     theme: "light",
        //     });

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
                },
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Post failed: ${errorData.message || "Unknown error"}`);
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

    const getDataForSpecificEntry = async (title) => {
        try {
            const response = await fetch(
                `https://first-choice-porpoise.ngrok-free.app/api/specificShowEntry/${title}/${whichTable}`,
            );

            if (!response.ok) {
                const errorData = await response.json();
                console.log(errorData.message);
            }

            const data = await response.json();

            setShow(data[0]["title"]);
            setShowID(data[0]["id"]);
        } catch (error) {
            console.log(error.message);
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
                setEntry={setShow}
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
