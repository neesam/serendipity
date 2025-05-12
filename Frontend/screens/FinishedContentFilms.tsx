import { View, Text, Pressable, Image, FlatList, Linking } from "react-native";
import { useState, useEffect } from "react";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

import CustomFlatList from "@/components/CustomFlatList";

import openLink from "@/utils/openLink";

const EXPO_PUBLIC_METADATA_DATASET = process.env.EXPO_PUBLIC_METADATA_DATASET;

const EXPO_PUBLIC_MUSIC_METADATA_TABLE =
    process.env.EXPO_PUBLIC_MUSIC_METADATA_TABLE;

export default function FinishedContentFilms() {
    const [finishedFilms, setFinishedFilms] = useState([]);

    useEffect(() => {
        handleLoadFinishedFilms();
    }, []);

    const handleLoadFinishedFilms = async () => {
        try {
            const response = await fetch(
                `https://first-choice-porpoise.ngrok-free.app/api/film_metadata_all/${EXPO_PUBLIC_METADATA_DATASET}/${EXPO_PUBLIC_MUSIC_METADATA_TABLE}`
            );

            if (!response.ok) {
                console.log(response.status);
            }

            const data = await response.json();

            setFinishedFilms(data);

            console.log(data);
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
            }
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
                <CustomFlatList
                    openLink={openLink}
                    data={finishedFilms}
                    type={"film"}
                />
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
