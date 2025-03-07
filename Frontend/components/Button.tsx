import { StyleSheet, View, Pressable, Text } from "react-native";

type Props = {
    label: String
}

export default function Button({ label }: Props) {
    return (
        <View style={styles.buttonContainer}>
            <Pressable style={styles.button}>
                <Text>{label}</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
        width: 320,
        height: 68,
        marginHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3
    },
    button: {
        borderRadius: 10,
        width: '100%'
    }
})