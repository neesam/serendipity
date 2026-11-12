import { useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useGenrePicker } from "@/components/genres/GenrePickerProvider";
import GenreRow from "@/components/genres/GenreRow";
import { useSession } from "@/context/session";
import { authStyles as styles } from "@/styles/authStyles";

export default function ChooseGenres() {
  const router = useRouter();
  const { completeOnboarding } = useSession();
  const picker = useGenrePicker();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const finish = async () => {
    if (picker.selected.size === 0) {
      setError("Pick at least one genre to continue.");
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await picker.save();           // genres first...
      await completeOnboarding();    // ...then flip the flag; the gate moves them in
    } catch {
      setError("Couldn't save your genres. Please try again.");
      setSaving(false);
    }
  };

  if (picker.loading) return <View style={[styles.flex, local.center]}><ActivityIndicator color="#fff" /></View>;
  if (picker.error) return <View style={[styles.flex, local.center]}><Text style={styles.error}>{picker.error}</Text></View>;

  const top = picker.childrenOf(null);

  return (
    <View style={styles.flex}>
      <View style={local.header}>
        <Text style={styles.title}>Pick your genres</Text>
        <Text style={styles.subtitle}>Open a genre to choose the subgenres you like. Come back and open as many as you want.</Text>
      </View>

      <FlatList
        data={top}
        keyExtractor={(g) => String(g.id)}
        renderItem={({ item }) => {
          const hasKids = picker.childrenOf(item.id).length > 0;
          return (
            <GenreRow
              name={item.name}
              hasKids={hasKids}
              selectable={!hasKids}
              selected={picker.selected.has(item.id)}
              count={picker.countUnder(item.id)}
              onToggle={() => picker.toggle(item.id)}
              onOpen={() => router.push({ pathname: "/subgenres/[id]", params: { id: String(item.id) } })}
            />
          );
        }}
      />

      <View style={local.footer}>
        {error && <Text style={styles.error}>{error}</Text>}
        <Pressable style={[styles.button, saving && styles.buttonDisabled]} onPress={finish} disabled={saving}>
          {saving ? <ActivityIndicator color="#fff" /> : (
            <Text style={styles.buttonText}>Save genres ({picker.selected.size})</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const local = StyleSheet.create({
  center: { justifyContent: "center", alignItems: "center" },
  header: { paddingTop: 80, paddingHorizontal: 20, paddingBottom: 12 },
  footer: { padding: 20, paddingBottom: 36, gap: 8, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: "#333" },
});