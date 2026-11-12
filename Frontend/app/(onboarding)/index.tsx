import { useRef, useState } from "react";
import { FlatList, Pressable, Text, View, StyleSheet, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import { authStyles as styles } from "@/styles/authStyles";

const SLIDES = [
  { title: "Welcome", body: "A one-line pitch of what your app does." },
  { title: "Discover", body: "Explain your first main feature here." },
  { title: "Keep track", body: "Explain your second main feature here." },
];

export default function OnboardingSlides() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const listRef = useRef<FlatList>(null);
  const [index, setIndex] = useState(0);
  const isLast = index === SLIDES.length - 1;

  const next = () => {
    if (isLast) router.push("/choose");
    else listRef.current?.scrollToIndex({ index: index + 1, animated: true });
  };

  return (
    <View style={[styles.flex, local.wrap]}>
      <FlatList
        ref={listRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(s) => s.title}
        onMomentumScrollEnd={(e) =>
          setIndex(Math.round(e.nativeEvent.contentOffset.x / width))
        }
        renderItem={({ item }) => (
          <View style={[local.slide, { width }]}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.body}</Text>
          </View>
        )}
      />

      <View style={local.dots}>
        {SLIDES.map((s, i) => (
          <View key={s.title} style={[local.dot, i === index && local.dotActive]} />
        ))}
      </View>

      <View style={local.footer}>
        <Pressable style={styles.button} onPress={next}>
          <Text style={styles.buttonText}>{isLast ? "Get started" : "Next"}</Text>
        </Pressable>
        {!isLast && (
          <Pressable onPress={() => router.push("/choose")}>
            <Text style={local.skip}>Skip</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const local = StyleSheet.create({
  wrap: { paddingTop: 80 },
  slide: { flex: 1, justifyContent: "center", paddingHorizontal: 32, gap: 8 },
  dots: { flexDirection: "row", justifyContent: "center", gap: 8, marginBottom: 20 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#333" },
  dotActive: { backgroundColor: "#fff" },
  footer: { paddingHorizontal: 24, paddingBottom: 40, gap: 16 },
  skip: { color: "#888", textAlign: "center", fontSize: 15 },
});