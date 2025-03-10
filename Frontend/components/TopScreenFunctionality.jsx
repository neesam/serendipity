import { View, Pressable } from 'react-native'

import { Ionicons } from '@expo/vector-icons'

import TablesModalAndButton from './TablesModalAndButton.jsx'

const TopScreenFunctionality = ({ containerStyles, tables, getFromSpecificTable, addToQueue, type }) => {
    return (
        <>
        { type !== 'book' ? (
            <>
            <View style={containerStyles.topLeftCornerContainer}>
                <TablesModalAndButton 
                    tables={tables}
                    setEntry={getFromSpecificTable}
                    name={'list-sharp'}
                    type={type}
                />
            </View>
            <View style={containerStyles.topRightCornerContainer}>
                <Pressable onPress={addToQueue}>
                    <Ionicons name={'add-sharp'} size={20}/>
                </Pressable>
            </View>
            </>
        ) : (
            <View style={containerStyles.topRightCornerContainer}>
                <Pressable onPress={addToQueue}>
                    <Ionicons name={'add-sharp'} size={20}/>
                </Pressable>
            </View>
        )}
        </>
    )
}

export default TopScreenFunctionality