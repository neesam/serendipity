import { View, Text, Pressable, Image, FlatList, Linking } from 'react-native'
import { useState, useEffect } from 'react'
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

export default function FinishedContentFilms() {

    const [finishedFilms, setFinishedFilms] = useState([])

    useEffect(() => {
        handleLoadFinishedFilms()
    }, [])

    const handleLoadFinishedFilms = async () => {
        try {
            const response = await fetch(`https://first-choice-porpoise.ngrok-free.app/api/film_metadata_all`)

            if (!response.ok) {
                console.log(response.status)
            }

            const data = await response.json()

            setFinishedFilms(data)

            console.log(data)

        } catch (error) {
            console.log(error.message)
        }
    }

    const openLink = (film_name) => {
        const encodedQuery = encodeURIComponent(film_name + ' ' + 'film');
        const googleUrl = `https://www.google.com/search?q=${encodedQuery}`;

        Linking.openURL(googleUrl).catch((err) => {
            console.error('Failed to open Google:', err);
            // If Spotify is not installed, open Spotify in the browser
        });
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }} edges={['top']}>
                <FlatList
                    data={finishedFilms}
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
                                    key={item.vote_avg}
                                    style={{
                                        height: 350,
                                        width: 350,
                                        borderRadius: 8,
                                        marginBottom: 10,
                                        maxWidth: '90%'
                                    }}
                                    source={{ uri: item.poster_path }}
                                    resizeMode="contain"
                                />
                                <Pressable onPress={() => openLink(item.title)}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 16, alignSelf: 'flex-start' }}>{item.title}</Text>
                                </Pressable>
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