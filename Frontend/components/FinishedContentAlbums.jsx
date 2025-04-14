import { View, Text, Pressable, Image, FlatList, Linking } from "react-native";
import { useState, useEffect } from "react";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

import CustomFlatList from "@/components/CustomFlatList";
import openLink from "@/helper/openLink";

export default function FinishedContentAlbums() {
    const [finishedAlbums, setFinishedAlbums] = useState([]);

    useEffect(() => {
        handleLoadFinishedAlbums();
    }, []);

    const handleLoadFinishedAlbums = async () => {
        try {
            const response = await fetch(
                `https://first-choice-porpoise.ngrok-free.app/api/music_metadata_all`,
            );

            if (!response.ok) {
                console.log(response.status);
            }

            const data = await response.json();

            setFinishedAlbums(data);

            console.log(data);
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
                <CustomFlatList
                    openLink={openLink}
                    data={finishedAlbums}
                    type={"album"}
                />
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
