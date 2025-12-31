import { View, Text, Pressable, Image, FlatList, Linking } from "react-native";
import { useState, useEffect } from "react";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

import CustomFlatList from "@/components/CustomFlatList";
import openLink from "@/utils/openLink";

const EXPO_PUBLIC_RAILWAY_URL = process.env.EXPO_PUBLIC_RAILWAY_URL;

const API_BASE_URL = __DEV__
    ? "http://10.0.0.164:5002"
    : EXPO_PUBLIC_RAILWAY_URL;

export default function FinishedContentAlbums() {
    const [finishedAlbums, setFinishedAlbums] = useState([]);

    useEffect(() => {
        handleLoadFinishedAlbums();
    }, []);

    const handleLoadFinishedAlbums = async () => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/music_metadata_all`
            );

            if (!response.ok) {
                console.log(response.status);
            }

            const data = await response.json();

            setFinishedAlbums(data);

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
                    data={finishedAlbums}
                    type={"album"}
                />
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
