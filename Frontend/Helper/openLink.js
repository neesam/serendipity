import { Linking } from "react-native";

import * as Haptics from "expo-haptics";

export default openLink = (title, type) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    if (type === "album") {
        const encodedQuery = encodeURIComponent(title);
        const spotifyWebUrl = `https://open.spotify.com/search/${encodedQuery}`;

        // Open the Spotify app or redirect to Spotify on the web if app is not installed
        Linking.openURL(spotifyWebUrl).catch((err) => {
            console.error("Failed to open Spotify:", err);
            // If Spotify is not installed, open Spotify in the browser
            Linking.openURL(
                `https://open.spotify.com/search/${encodeURIComponent(title)}`
            );
        });
    } else {
        const encodedQuery = encodeURIComponent(title + " " + type);
        const googleUrl = `https://www.google.com/search?q=${encodedQuery}`;

        Linking.openURL(googleUrl).catch((err) => {
            console.error("Failed to open Google:", err);
            // If Spotify is not installed, open Spotify in the browser
        });
    }
};
