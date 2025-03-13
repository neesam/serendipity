import { View, Text, Pressable, Image, FlatList, Linking } from 'react-native'
import { useState, useEffect } from 'react'
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

export default function FinishedContentAlbums() {

    const [finishedAlbums, setFinishedAlbums] = useState([])

    useEffect(() => {
        handleLoadFinishedAlbums()
    }, [])

    const handleLoadFinishedAlbums = async () => {
        try {
            const response = await fetch(`https://first-choice-porpoise.ngrok-free.app/api/music_metadata_all`)

            if (!response.ok) {
                console.log(response.status)
            }

            const data = await response.json()

            setFinishedAlbums(data)

            console.log(data)

        } catch (error) {
            console.log(error.message)
        }
    }

    const openLink = (album_name) => {
        const encodedQuery = encodeURIComponent(album_name);
        const spotifyWebUrl = `https://open.spotify.com/search/${encodedQuery}`;

        // Open the Spotify app or redirect to Spotify on the web if app is not installed
        Linking.openURL(spotifyWebUrl).catch((err) => {
            console.error('Failed to open Spotify:', err);
            // If Spotify is not installed, open Spotify in the browser
            Linking.openURL(`https://open.spotify.com/search/${encodeURIComponent(album_name)}`);
        });
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }} edges={['top']}>
                <FlatList
                    data={finishedAlbums}
                    renderItem={({ item }) => {
                        return (
                            <View style={{
                                width: '100%',
                                padding: 16,
                                marginBottom: 16,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'white',
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.1,
                                shadowRadius: 3,
                                elevation: 2,
                            }}>
                                <Image
                                    key={item.image_url}
                                    style={{
                                        height: 350,
                                        width: 350,
                                        borderRadius: 8,
                                        marginBottom: 10,
                                        maxWidth: '90%'
                                    }}
                                    source={{ uri: item.image_url }}
                                    resizeMode="contain"
                                />
                                <Pressable onPress={() => openLink(item.album_name)}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 16, alignSelf: 'flex-start' }}>{item.album_name}</Text>
                                </Pressable>
                                <Text style={{ color: '#666', alignSelf: 'flex-start' }}>{item.artist_name}</Text>
                            </View>
                        )
                    }}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                />
            </SafeAreaView>
        </SafeAreaProvider>
    )
}