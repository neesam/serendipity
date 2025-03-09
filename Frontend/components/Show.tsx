import { View, StyleSheet, Text, Pressable, ImageBackground } from "react-native";
import { useState, useEffect } from "react";

// import { ToastContainer, toast } from 'react-toastify';

const placeholderImage = require('/Users/anees/entertainmentRecSystemMobile/Frontend/assets/sticker-smash-assets/images/1.png')

const Show = () => {

    const [whichTable, setWhichTable] = useState('')
    const [show, setShow] = useState()
    const [tablesUsed, setTablesUsed] = useState([])
    const [showID, setShowID] = useState('')
    const [backgroundColor, setBackgroundColor] = useState('')
    const [showAndTableAvailable, setShowAndTableAvailable] = useState<boolean>(false)


    const tables = [
        'shows',
        'anime_classic',
        'anime_other',
        'shows_top50'
    ]


    useEffect(() => {

    }, [show]);

    const getShow = async () => {

        // Function to fetch actual show

        const fetchShowFromWhichTable = async (whichTable: string) => {
            const response = await fetch(`https://first-choice-porpoise.ngrok-free.app/api/${whichTable}`)
            if (!response.ok) {
                throw new Error(`Failed to fetch details for ${whichTable}`);
            }
            const data = await response.json()

            console.log(data)

            setShow(data[0]['title'])

            setShowAndTableAvailable(true)

            // Logic to change background on each button press

            // const bgColor = randomColor()
            // setBackgroundColor(bgColor)
            // localStorage.setItem('albumBackgroundColor', bgColor)
        }

        // Function to retrieve specific table

        const fetchWhichTable = async () => {

            setShowAndTableAvailable(false)

            let localTablesUsed = [...tablesUsed];

            if (localTablesUsed.length === 3) {
                localTablesUsed = []
                setTablesUsed([])
            }

            let tableUsed = false

            while (!tableUsed) {

                const response = await fetch('https://first-choice-porpoise.ngrok-free.app/api/whichShowTable');

                if (!response.ok) {
                    throw new Error('Failed to fetch whichTable');
                }

                const data = await response.json()
                const fetchedTable: string = data[0]['title']
                console.log(fetchedTable)

                if (!localTablesUsed.includes(fetchedTable)) {

                    tableUsed = true

                    setWhichTable(fetchedTable)

                    localTablesUsed.push(fetchedTable);
                    setTablesUsed(localTablesUsed);
                    console.log('After update:', [...tablesUsed, fetchedTable]);

                    if (data.length > 0) {
                        fetchShowFromWhichTable(fetchedTable); // Assuming data is an array and we're using the first item
                    }
                }
            }
        }

        fetchWhichTable();
    }

    const getFromSpecificTable = async (specificTable: string) => {
        const response = await fetch(`https://first-choice-porpoise.ngrok-free.app/api/${specificTable}`)
            if (!response.ok) {
                throw new Error(`Failed to fetch details for ${specificTable}`);
            }
            const data = await response.json()

            console.log(data)

            setShow(data[0]['title'])

            // Logic to change background on each button press

            // const bgColor = randomColor()
            // setBackgroundColor(bgColor)
            // localStorage.setItem('showBackgroundColor', bgColor)
    }

    const deleteShow = async () => {
        console.log(showID)
        console.log(`Requesting DELETE for show ID: ${showID}`);
        try {
            const response = await fetch(`https://first-choice-porpoise.ngrok-free.app/api/shows/${showID}`, {
                method: 'DELETE'
            })

            const data = await response.json()
            console.log(data.message)
        } catch (err: any) {
            console.log(err.message);
        }

        // toast('Deleted show!', {
        //     autoClose: 2000,
        //     theme: "light",
        //     });

        getShow()
    }

    const addToQueue = async () => {
        try {
            const response = await fetch(`https://first-choice-porpoise.ngrok-free.app/api/addShowToQueue/${show}`, {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
            })

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Post failed: ${errorData.message || 'Unknown error'}`);
            }

            console.log(await response.json());
            console.log('Show added successfully.');
        } catch(error) {
            console.error('Error in API call', error);
        }

        // toast('Added to queue!', {
        //     autoClose: 2000,
        //     theme: "light",
        //     });
      }

    return (
        <ImageBackground source={placeholderImage}>
            <View style={containerStyles.screenContainer}>
                <View style={containerStyles.cardContainer}>
                    {showAndTableAvailable ? (
                        <>
                            <Text style={cardStyles.albumName}>
                                {show}
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
                    <Pressable onPress={getShow}>
                        <View style={containerStyles.getShowButtonContainer}>
                                <Text style={buttonStyles.buttonText}>Get show</Text>
                        </View>
                    </Pressable>
                    <Pressable onPress={deleteShow}>
                        <View style={containerStyles.deleteShowButtonContainer}>
                                <Text style={buttonStyles.buttonText}>Delete show</Text>
                        </View>
                    </Pressable>
                </View>
            </View>
        </ImageBackground>
        );
}

export default Show

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
        backgroundImage: placeholderImage,
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
    getShowButtonContainer: {
        backgroundColor: 'blue',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'white',
        borderWidth: 3,
    },
    deleteShowButtonContainer: {
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