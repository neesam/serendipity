import { View, StyleSheet, Text, Pressable } from "react-native";
import { useState, useEffect } from "react";

// import { ToastContainer, toast } from 'react-toastify';

const Film = () => {

    const [whichTable, setWhichTable] = useState('')
    const [film, setFilm] = useState('')
    const [filmID, setFilmID] = useState('')
    const [tablesUsed, setTablesUsed] = useState([])
    const [backgroundColor, setBackgroundColor] = useState('')
    const [filmAndTableAvailable, setFilmAndTableAvailable] = useState<boolean>(false)

    const tables = [
        'film_ebert',
        'film_imdb250',
        'filmrecs',
        'film_towatch',
        'film_visualhypnagogia',
        'film_rymtop1500',
        'film_criterion',
        'film_noir1000',
        'film_tspdt2500'
    ]

    useEffect(() => {

    }, [film]);

    const getFilm = async () => {
        const fetchFilmFromWhichTable = async (whichTable: string) => {
            const response = await fetch(`https://first-choice-porpoise.ngrok-free.app/api/${whichTable}`)
            if (!response.ok) {
                throw new Error(`Failed to fetch details for ${whichTable}`);
            }
            const data = await response.json()

            setFilm(data[0]['title'])
            setFilmID(data[0]['id'])

            setFilmAndTableAvailable(true)

            // const bgColor = randomColor()
    
            // setBackgroundColor(bgColor)
            // localStorage.setItem('filmBackgroundColor', bgColor)
        }

        const fetchWhichTable = async () => {

            let localTablesUsed = [...tablesUsed];

            if (localTablesUsed.length === 8) {
                localTablesUsed = []
                setTablesUsed([])
            }

            let tableUsed = false

            setFilmAndTableAvailable(false)

            while (!tableUsed) {

                const response = await fetch('https://first-choice-porpoise.ngrok-free.app/api/whichFilmTable');

                if (!response.ok) {
                    throw new Error('Failed to fetch whichTable');
                }

                const data = await response.json()
                const fetchedTable: string = data[0]['title']

                console.log(data)

                if (!localTablesUsed.includes(fetchedTable)) {

                    tableUsed = true

                    setWhichTable(fetchedTable)

                    localTablesUsed.push(fetchedTable);
                    setTablesUsed(localTablesUsed);
                    console.log('After update:', [...tablesUsed, fetchedTable]);

                    if (data.length > 0) {
                        fetchFilmFromWhichTable(fetchedTable); // Assuming data is an array and we're using the first item
                    }
                }
            }
        }

        fetchWhichTable();
    }

    const deleteFilm = async () => {
        try {
        
            const response = await fetch(`https://first-choice-porpoise.ngrok-free.app/api/film/${filmID}/${whichTable}`, {
                method: 'DELETE',
                headers: { 'Content-type': 'application/json' },
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Delete failed: ${errorData.message || 'Unknown error'}`);
            }

            console.log(await response.json());
            console.log('Film deleted successfully.');
        } catch (error: any) {
            console.error('Error during deletion:', error.message);
        }

        // toast('Deleted film!', {
        //         autoClose: 2000,
        //         theme: "light",
        // });

        getFilm()
    };

    const getFromSpecificTable = async (specificTable: string) => {
        const response = await fetch(`https://first-choice-porpoise.ngrok-free.app/api/${specificTable}`)
            if (!response.ok) {
                throw new Error(`Failed to fetch details for ${specificTable}`);
            }
            const data = await response.json()

            setFilm(data[0]['title'])
            setFilmID(data[0]['id'])
            setWhichTable(specificTable)

            // Logic to change background on each button press

            // setBackgroundColor(bgColor)
            // localStorage.setItem('filmBackgroundColor', bgColor)
    }

    const addToQueue = async () => {
        try {
            const response = await fetch(`https://first-choice-porpoise.ngrok-free.app/api/addFilmToQueue/${film}`, {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
            })

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Post failed: ${errorData.message || 'Unknown error'}`);
            }

            console.log(await response.json());
            console.log('Film added successfully.');
        } catch(error) {
            console.error('Error in API call', error);
        }

        // toast('Added to queue!', {
        //     autoClose: 2000,
        //     theme: "light",
        //     });
      }

    
      return (
        <View style={containerStyles.screenContainer}>
            <View style={containerStyles.cardContainer}>
                {filmAndTableAvailable ? (
                    <>
                        <Text style={cardStyles.albumName}>
                            {film}
                        </Text>
                        <Text style={cardStyles.tableName}>
                            {whichTable}
                        </Text>
                    </>
                ) : 
                    <>
                        <Text style={cardStyles.loadingText}>
                            Getting info...
                        </Text>
                    </>}
            </View>
            <View style={containerStyles.buttonsContainer}>
                <Pressable onPress={getFilm}>
                    <View style={containerStyles.getFilmButtonContainer}>
                            <Text style={buttonStyles.buttonText}>Get film</Text>
                    </View>
                </Pressable>
                <Pressable>
                    <View style={containerStyles.deleteFilmButtonContainer}>
                            <Text style={buttonStyles.buttonText}>Delete film</Text>
                    </View>
                </Pressable>
            </View>
        </View>
    );
}

export default Film


const cardStyles = StyleSheet.create({
    albumName: {
        fontSize: 22,
        fontWeight: '600',
        marginBottom: 5,
        color: '#333',
    },
    tableName: {
        fontSize: 18,
        color: '#555',
    },
    loadingText: {
        fontSize: 18,
        fontStyle: 'italic',
        color: '#888',
    }
});

const containerStyles = StyleSheet.create({
    screenContainer: {
        backgroundColor: '#f8f8f8',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: 20,
    },
    cardContainer: {
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: 'gold',
        borderRadius: 10,
        padding: 30,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,  // This will give it a slight shadow on Android
        marginBottom: 20,
    },
    getFilmButtonContainer: {
        backgroundColor: 'blue',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'white',
        borderWidth: 3,
    },
    deleteFilmButtonContainer: {
        backgroundColor: 'red',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'white',
        borderWidth: 3,
    },
    buttonsContainer: {
        flexDirection: 'row',
        gap: 10
    }
});

const buttonStyles = StyleSheet.create({
    buttonText: {
        fontSize: 18,
        fontWeight: '600',
        color: 'white',
    },
});