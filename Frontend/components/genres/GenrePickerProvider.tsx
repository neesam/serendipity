import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabase";

export type Genre = { id: number; name: string; parent_id: number | null };

type PickerContext = {
  loading: boolean;
  error: string | null;
  getGenre: (id: number) => Genre | undefined;
  childrenOf: (parentId: number | null) => Genre[];
  selected: Set<number>;
  toggle: (id: number) => void;
  countUnder: (id: number) => number;
  save: () => Promise<void>;
};

const Ctx = createContext<PickerContext | null>(null);

export function GenrePickerProvider({ children }: { children: ReactNode }) {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [saved, setSaved] = useState<Set<number>>(new Set());
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const [g, u] = await Promise.all([
        supabase.from("genres").select("id, name, parent_id").order("name").limit(5000),
        supabase.from("user_genres").select("genre_id"),
      ]);
      if (g.error || u.error) {
        setError("Couldn't load genres. Check your connection and try again.");
      } else {
        const existing = new Set<number>(u.data.map((r) => r.genre_id));
        setGenres(g.data);
        setSaved(existing);
        setSelected(new Set(existing));
      }
      setLoading(false);
    })();
  }, []);

  const { byId, kids } = useMemo(() => {
    const byId = new Map<number, Genre>();
    const kids = new Map<number, Genre[]>(); // key 0 = top level
    for (const g of genres) {
      byId.set(g.id, g);
      const key = g.parent_id ?? 0;
      kids.set(key, [...(kids.get(key) ?? []), g]);
    }
    return { byId, kids };
  }, [genres]);

  const childrenOf = useCallback((p: number | null) => kids.get(p ?? 0) ?? [], [kids]);
  const getGenre = useCallback((id: number) => byId.get(id), [byId]);

  const toggle = useCallback((id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  // How many selected genres sit anywhere beneath this one (for the badges)
  const countUnder = useCallback(
    (id: number): number =>
      (kids.get(id) ?? []).reduce((n, c) => n + (selected.has(c.id) ? 1 : 0) + countUnder(c.id), 0),
    [kids, selected]
  );

  const save = useCallback(async () => {
    const toAdd = [...selected].filter((id) => !saved.has(id));
    const toRemove = [...saved].filter((id) => !selected.has(id));

    if (toAdd.length) {
      const { error } = await supabase
        .from("user_genres")
        .upsert(toAdd.map((genre_id) => ({ genre_id })), {
          onConflict: "user_id,genre_id",
          ignoreDuplicates: true,
        });
      if (error) throw error;
    }
    if (toRemove.length) {
      const { error } = await supabase.from("user_genres").delete().in("genre_id", toRemove);
      if (error) throw error;
    }
    setSaved(new Set(selected));
  }, [selected, saved]);

  return (
    <Ctx.Provider value={{ loading, error, getGenre, childrenOf, selected, toggle, countUnder, save }}>
      {children}
    </Ctx.Provider>
  );
}

export function useGenrePicker() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useGenrePicker must be used inside GenrePickerProvider");
  return ctx;
}