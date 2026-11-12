import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

type SessionContextType = {
  session: Session | null;
  isSignedIn: boolean;
  onboarded: boolean | null;
  loading: boolean;
  signOut: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
};

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [onboarded, setOnboarded] = useState<boolean | null>(null);

  const userId = session?.user.id;

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => listener.subscription.unsubscribe();
  }, []);


  useEffect(() => {
      if (!userId) {
        setOnboarded(null);
        return;
      }
      let cancelled = false;

      supabase
        .from("profiles")
        .select("onboarding_completed")
        .eq("id", userId)
        .maybeSingle()
        .then(({ data, error }) => {
          if (cancelled) return;
          if (error) {
            console.log("profile load failed:", error.message);
            setOnboarded(true); // fail open: an existing user shouldn't get stuck
            return;
          }
          setOnboarded(data?.onboarding_completed ?? false);
        });

      return () => {
        cancelled = true;
      };
    }, [userId]);

  const completeOnboarding = useCallback(async () => {
    if (!userId) return;
    const { error } = await supabase
      .from("profiles")
      .update({ onboarding_completed: true })
      .eq("id", userId);
    if (error) throw error;
    setOnboarded(true); // the gate swaps groups on its own
  }, [userId]);

  const signOut = async () => {
    await supabase.auth.signOut();
    // Later: clear any data caches here too
  };

  const loading = authLoading || (!!session && onboarded === null);

  return (
    <SessionContext.Provider
      value={{ session, isSignedIn: !!session, onboarded, loading, signOut, completeOnboarding }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used inside SessionProvider");
  return ctx;
}