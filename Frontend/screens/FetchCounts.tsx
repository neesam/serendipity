import {
    Text,
    View,
    TextInput,
    Modal,
    Pressable,
    StyleSheet,
    StatusBar
} from "react-native";

import { Picker } from "@react-native-picker/picker";

import { containerStyles, formStyles } from "../styles/styles";

import { useEffect, useState } from "react";

import { allTables } from "@/helper/lists";
import { FlatList } from "react-native-gesture-handler";

const EXPO_PUBLIC_RAILWAY_URL = process.env.EXPO_PUBLIC_RAILWAY_URL;

const API_BASE_URL = __DEV__
    ? "http://192.168.0.86:5002"
    : EXPO_PUBLIC_RAILWAY_URL;

const Item = ({table, count, lastFetched}) => (
  <View style={styles.item}>
    <Text style={styles.title}>{table}</Text>
    <Text style={styles.title}>{count}</Text>
  </View>
);

export default function FetchCounts() {

    const [tables, setTables] = useState([])

    useEffect(() => {
        retrieveTables()
        console.log(tables)
    }, [])

    const retrieveTables = async () => {
         try {
            const response = await fetch(
                `${API_BASE_URL}/api/table_fetch_counts`,
            );

            if (!response.ok) {
                console.log(response.status);
            }

            const data = await response.json();

            setTables(data['data']);

            console.log(data['data']);
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
            }
        }
    }

    const screenStyle = {
        backgroundColor: "pink",
    };

    return (
                <FlatList
                    data={tables}
                    renderItem={({ item }) => {
                        return (
                            <Item table={item.table} count={item.fetch_count}/>
                        )
                    }}
                />
            )
                
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: "100%",
        position: "absolute",
        bottom: 10,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
    },
    setCurrentAlbumModalButtonsContainerContainer: {
        flexDirection: "row",
        width: "100%",
        height: "auto",
        justifyContent: "space-around",
    },
    setCurrentAlbumModalButtonContainer: {
        borderWidth: 0.2,
        borderColor: "black",
        borderRadius: 10,
        elevation: 5,
        padding: 10,
        width: 100,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    setCurrentAlbumModalButton: {
        fontSize: 20,
    },
    container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: "row",
    display: "flex",
    justifyContent: "space-between"
  },
  title: {
    fontSize: 32,
  },
});
