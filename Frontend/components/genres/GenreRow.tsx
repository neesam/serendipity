import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  name: string;
  hasKids: boolean;
  selectable: boolean;
  selected: boolean;
  count: number;
  onToggle: () => void;
  onOpen: () => void;
};

export default function GenreRow({ name, hasKids, selectable, selected, count, onToggle, onOpen }: Props) {
  return (
    <Pressable style={s.row} onPress={hasKids ? onOpen : onToggle}>
      {selectable && (
        <Pressable onPress={onToggle} hitSlop={10} style={[s.box, selected && s.boxOn]}>
          {selected && <Text style={s.tick}>✓</Text>}
        </Pressable>
      )}
      <Text style={s.name}>{name}</Text>
      {count > 0 && (
        <View style={s.badge}>
          <Text style={s.badgeText}>{count}</Text>
        </View>
      )}
      {hasKids && <Text style={s.chevron}>›</Text>}
    </Pressable>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 16, paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "#333" },
  box: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: "#555",
    alignItems: "center", justifyContent: "center" },
  boxOn: { backgroundColor: "#3b82f6", borderColor: "#3b82f6" },
  tick: { color: "#fff", fontWeight: "700", fontSize: 14 },
  name: { flex: 1, color: "#fff", fontSize: 17 },
  badge: { backgroundColor: "#3b82f6", borderRadius: 10, minWidth: 22, paddingHorizontal: 7, paddingVertical: 2, alignItems: "center" },
  badgeText: { color: "#fff", fontSize: 13, fontWeight: "600" },
  chevron: { color: "#888", fontSize: 26 },
});