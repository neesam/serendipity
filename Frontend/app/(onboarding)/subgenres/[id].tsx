import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useGenrePicker } from "@/components/genres/GenrePickerProvider";
import GenreRow from "@/components/genres/GenreRow";
import { authStyles as styles } from "@/styles/authStyles";

export default function Subgenres() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const picker = useGenrePicker();

  const genreId = Number(id);
  const genre = picker.getGenre(genreId);
  const kids = picker.childrenOf(genreId);

  return (
    <View style={styles.flex}>
      <View style={local.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={local.back}>‹ Back</Text>
        </Pressable>
        <Text style={styles.title}>{genre?.name ?? "Genre"}</Text>
      </View>

      <FlatList
        data={kids}
        keyExtractor={(g) => String(g.id)}
        ListEmptyComponent={<Text style={local.empty}>Nothing here yet.</Text>}
        renderItem={({ item }) => {
          const hasKids = picker.childrenOf(item.id).length > 0;
          return (
            <GenreRow
              name={item.name}
              hasKids={hasKids}
              selectable
              selected={picker.selected.has(item.id)}
              count={picker.countUnder(item.id)}
              onToggle={() => picker.toggle(item.id)}
              onOpen={() => router.push({ pathname: "/subgenres/[id]", params: { id: String(item.id) } })}
            />
          );
        }}
      />
    </View>
  );
}

const local = StyleSheet.create({
  header: { paddingTop: 70, paddingHorizontal: 20, paddingBottom: 12, gap: 8 },
  back: { color: "#3b82f6", fontSize: 17 },
  empty: { color: "#888", padding: 20 },
});