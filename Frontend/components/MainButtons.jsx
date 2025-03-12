import { View, Text, TouchableOpacity } from "react-native";

import { containerStyles, buttonStyles } from '../Styles/AlbumStyles.jsx'


const MainButtons = ({ getContent, deleteContent, type, currentlyListening, addToCurrentlyListening, availability, contentName }) => {
    return (
        <>
        {availability ? (
            <View style={containerStyles.mainButtonsContainer}>
                {contentName === '' ? (
                    <TouchableOpacity onPress={getContent}>
                        <View style={containerStyles.getContentButtonContainer}>
                            <Text style={buttonStyles.buttonText}>Get {type}</Text>
                        </View>
                    </TouchableOpacity>
                ) : (
                    <>
                    <TouchableOpacity onPress={getContent}>
                    <View style={containerStyles.getContentButtonContainer}>
                        <Text style={buttonStyles.buttonText}>Get {type}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={deleteContent}>
                    <View style={containerStyles.deleteContentButtonContainer}>
                        <Text style={buttonStyles.buttonText}>Delete {type}</Text>
                    </View>
                </TouchableOpacity>
                </>
                )}
            </View>
        ) : (
            <></>
        )}
            {currentlyListening === 'false' && availability === true ? (
                <View style={containerStyles.addToCurrentlyListeningButtonContainer}>
                    <TouchableOpacity onPress={addToCurrentlyListening}>
                        <View>
                            <Text style={buttonStyles.buttonText}>Add to currents</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            ) : (
                <></>
            )}
        </>
    )
}

export default MainButtons