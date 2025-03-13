import { useEffect, useState } from 'react'
import { View } from "react-native";

import * as Haptics from 'expo-haptics';

// import { ToastContainer, toast } from 'react-toastify';

import { bookAnthologies } from '../Helper/lists';
import { containerStyles } from '../Styles/Styles'
import randomColor from '../Helper/randomColor';
import TopScreenFunctionality from './TopScreenFunctionality'
import MainButtons from './MainButtons'
import ContentCard from './ContentCard'

const Book = () => {

    const [book, setBook] = useState('')
    const [bookID, setBookID] = useState('')
    const [backgroundColor, setBackgroundColor] = useState('')
    const [bookAndTableAvailable, setBookAndTableAvailable] = useState(true)

    useEffect(() => {

    }, [book]);

    const getBook = async () => {

        setBookAndTableAvailable(false)

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        try {
            const response = await fetch(`https://first-choice-porpoise.ngrok-free.app/api/book_toread`)

            if (!response.ok) {
                throw new Error(`Failed to fetch details`);
            }

            const data = await response.json()

            if (bookAnthologies.includes(data[0]['title'])) {
                const getRandomInt = (min, max) => {
                    const minCeiled = Math.ceil(min);
                    const maxFloored = Math.floor(max);
                    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
                }
                setBookID(data[0]['id'])
                setBook(data[0]['title'] + ' ' + getRandomInt(2, 5))
            } else {
                setBookID(data[0]['id'])
                setBook(data[0]['title'])
            }

            // Logic to change background on each button press

            const bgColor = randomColor()
            setBackgroundColor(bgColor)
        } catch (err) {
            console.log(err)
        } finally {
            setBookAndTableAvailable(true)
        }

    }

    const deleteBook = async () => {

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        try {

            const response = await fetch(`https://first-choice-porpoise.ngrok-free.app/api/book_toread/${bookID}`, {
                method: 'DELETE',
                headers: { 'Content-type': 'application/json' },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Delete failed: ${errorData.message || 'Unknown error'}`);
            }

            console.log(await response.json());
            console.log('Book deleted successfully.');
        } catch (error) {
            console.error('Error during deletion:', error.message);
        }

        // toast('Deleted book!', {
        //     autoClose: 2000,
        //     theme: "light",
        //     });

        getBook()
    };

    const addToQueue = async () => {

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        try {
            const response = await fetch(`https://first-choice-porpoise.ngrok-free.app/api/addBookToQueue/${book}`, {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
            })

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Post failed: ${errorData.message || 'Unknown error'}`);
            }

            console.log(await response.json());
            console.log('Book added successfully.');
        } catch (error) {
            console.error('Error in API call', error);
        }

        // toast('Added to queue!', {
        //     autoClose: 2000,
        //     theme: "light",
        //     });
    }

    const screenStyle = {
        backgroundColor: backgroundColor
    }

    return (
        <View style={[containerStyles.screenContainer, screenStyle]}>
            <TopScreenFunctionality
                containerStyles={containerStyles}
                addToQueue={addToQueue}
                type={'book'}
            />
            <ContentCard
                type={'book'}
                contentName={book}
                setEntry={setBook}
                availability={bookAndTableAvailable}
            />
            <MainButtons
                getContent={getBook}
                deleteContent={deleteBook}
                type={'book'}
                availability={bookAndTableAvailable}
                contentName={book}
            />
        </View>
    )
}

export default Book