import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Link } from "expo-router";
import { supabase } from "@/lib/supabase";
import { friendlyAuthError } from "@/lib/authErrors";
import { useSession } from "@/context/session";
import { authStyles } from "@/styles/authStyles";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError("Enter your email and password.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      setError("That doesn't look like a valid email address.");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });
      if (error) setError(friendlyAuthError(error));
      // On success there's nothing to do: the auth listener updates the
      // session and the gate swaps you into the app automatically.
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSpotify = () => {
    // TODO: Spotify OAuth comes later
  };

  return (
    <KeyboardAvoidingView
      style={authStyles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={authStyles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={authStyles.title}>Welcome back</Text>
        <Text style={authStyles.subtitle}>Log in to continue</Text>

        <TextInput
          style={authStyles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          textContentType="emailAddress"
          autoComplete="email"
          editable={!loading}
        />

        <TextInput
          style={authStyles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          textContentType="password"
          autoComplete="password"
          editable={!loading}
          onSubmitEditing={handleLogin}
          returnKeyType="go"
        />

        {error && <Text style={authStyles.error}>{error}</Text>}

        <Link href="/forgotPassword" style={authStyles.link}>
          Forgot password?
        </Link>

        <Pressable
          style={[authStyles.button, loading && authStyles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={authStyles.buttonText}>Log in</Text>
          )}
        </Pressable>

        <View style={authStyles.dividerRow}>
          <View style={authStyles.dividerLine} />
          <Text style={authStyles.dividerText}>or</Text>
          <View style={authStyles.dividerLine} />
        </View>

        <Pressable
          style={[authStyles.button, authStyles.spotifyButton]}
          onPress={handleSpotify}
          disabled={loading}
        >
          <Text style={authStyles.buttonText}>Continue with Spotify</Text>
        </Pressable>

        <View style={authStyles.footer}>
          <Text style={authStyles.footerText}>Don't have an account? </Text>
          <Link href="/signUp" style={authStyles.linkBold}>
            Sign up
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}