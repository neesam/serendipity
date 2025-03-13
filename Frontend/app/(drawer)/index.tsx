import { View, StyleSheet, Text, Pressable } from "react-native";
import { useState, useEffect } from "react";

import { Redirect } from "expo-router";

export default function Index() {
    return <Redirect href={'/(drawer)/(tabs)/album'}/>
}