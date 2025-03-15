import { useState, useEffect } from 'react'
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

import CustomFlatList from '@/components/CustomFlatList'

import openLink from '@/helper/openLink'

export default function FinishedContentShows() {

    const [finishedShows, setFinishedShows] = useState([])

    useEffect(() => {
        handleLoadFinishedShows()
    }, [])

    const handleLoadFinishedShows = async () => {
        try {
            const response = await fetch(`https://first-choice-porpoise.ngrok-free.app/api/show_metadata_all`)

            if (!response.ok) {
                console.log(response.status)
            }

            const data = await response.json()

            setFinishedShows(data)

            console.log(data)

        } catch (error) {
            console.log(error.message)
        }
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }} edges={['top']}>
                <CustomFlatList openLink={openLink} data={finishedShows} type={'show'} />
            </SafeAreaView>
        </SafeAreaProvider>
    )
}