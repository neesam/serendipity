import { View, Text, Pressable, Image, FlatList, Linking } from "react-native";
import { useState, useEffect } from "react";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

import CustomFlatList from "@/components/CustomFlatList";
import openLink from "@/utils/openLink";

export default function FinishedContentAlbums() {
    const [finishedBooks, setFinishedBooks] = useState([]);

    useEffect(() => {
        handleLoadFinishedBooks();
    }, []);

    const handleLoadFinishedBooks = async () => {
        try {
            const response = await fetch(
                `https://first-choice-porpoise.ngrok-free.app/api/book_metadata_all`
            );

            if (!response.ok) {
                console.log(response.status);
            }

            const data = await response.json();

            setFinishedBooks(data);

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
                    data={finishedBooks}
                    type={"book"}
                />
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
