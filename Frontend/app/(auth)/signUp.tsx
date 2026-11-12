import { useState } from "react";
import {
  ActivityIndicator, KeyboardAvoidingView, Platform,
  Pressable, ScrollView, Text, TextInput, View,
} from "react-native";
import { Link } from "expo-router";
import * as Linking from "expo-linking";
import { supabase } from "@/lib/supabase";
import { friendlyAuthError } from "@/lib/authErrors";
import { authStyles as styles } from "@/styles/authStyles";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSignUp = async () => {
    const cleanEmail = email.trim().toLowerCase();

    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: { emailRedirectTo: Linking.createURL("login") },
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

  if (sent) {
    return (
      <View style={[styles.flex, styles.container]}>
        <Text style={styles.title}>Check your email</Text>
        <Text style={styles.subtitle}>
          If that address can be used, we've sent a confirmation link. Tap it,
          then come back and log in.
        </Text>
        <Link href="/login" style={styles.linkBold}>Back to log in</Link>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Create account</Text>
        <Text style={styles.subtitle}>Sign up with your email</Text>

        <TextInput
          style={styles.input} placeholder="Email" placeholderTextColor="#888"
          value={email} onChangeText={setEmail}
          autoCapitalize="none" autoCorrect={false}
          keyboardType="email-address" textContentType="emailAddress"
          autoComplete="email" editable={!loading}
        />
        <TextInput
          style={styles.input} placeholder="Password (8+ characters)" placeholderTextColor="#888"
          value={password} onChangeText={setPassword}
          secureTextEntry autoCapitalize="none"
          textContentType="newPassword" autoComplete="password-new" editable={!loading}
        />
        <TextInput
          style={styles.input} placeholder="Confirm password" placeholderTextColor="#888"
          value={confirm} onChangeText={setConfirm}
          secureTextEntry autoCapitalize="none"
          textContentType="newPassword" editable={!loading}
          onSubmitEditing={handleSignUp} returnKeyType="go"
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <Pressable
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSignUp} disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign up</Text>}
        </Pressable>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Link href="/login" style={styles.linkBold}>Log in</Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}