import { View, Text, TouchableOpacity } from "react-native";

import { containerStyles, buttonStyles } from '../Styles/AlbumStyles.jsx'


const MainButtons = ({ getContent, deleteContent, type }) => {
    return (
        <View style={containerStyles.mainButtonsContainer}>
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
        </View>
    )
}

export default MainButtons