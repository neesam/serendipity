import { useState } from "react";
import {
  ActivityIndicator, KeyboardAvoidingView, Platform,
  Pressable, Text, TextInput, View,
} from "react-native";
import { Link } from "expo-router";
import * as Linking from "expo-linking";
import { supabase } from "@/lib/supabase";
import { friendlyAuthError } from "@/lib/authErrors";
import { authStyles as styles } from "@/styles/authStyles";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleReset = async () => {
    const cleanEmail = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      setError("Enter a valid email address.");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: Linking.createURL("reset-password"),
      });
      if (error) {
        setError(friendlyAuthError(error));
        return;
      }
      setSent(true);
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.flex, styles.container]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.title}>Reset password</Text>
      <Text style={styles.subtitle}>
        Enter your email and we'll send a reset link.
      </Text>

      <TextInput
        style={styles.input} placeholder="Email" placeholderTextColor="#888"
        value={email} onChangeText={setEmail}
        autoCapitalize="none" autoCorrect={false}
        keyboardType="email-address" autoComplete="email" editable={!loading}
      />

      {error && <Text style={styles.error}>{error}</Text>}
      {sent && (
        <Text style={styles.success}>
          If an account exists for that email, a reset link is on its way.
        </Text>
      )}

      <Pressable
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleReset} disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Send reset link</Text>}
      </Pressable>

      <View style={styles.footer}>
        <Link href="/login" style={styles.linkBold}>Back to log in</Link>
      </View>
    </KeyboardAvoidingView>
  );
}