import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../services/api';
import { CartContext } from '../context/CartContext';
import { colors, spacing, typography, radius, shadows, gradients } from '../styles/theme';

const LoginScreen = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(CartContext);

  const handleSubmit = async () => {
    if (!email || !password || (!isLogin && !name)) {
      Alert.alert('Error', 'Mohon lengkapi semua field');
      return;
    }

    setLoading(true);
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin ? { email, password } : { name, email, password };
      const { data } = await api.post(endpoint, payload);

      await login(data.token, data);

      Alert.alert(
        'Berhasil',
        isLogin ? 'Login Berhasil!' : 'Registrasi Berhasil!',
        [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
      );
    } catch (error) {
      Alert.alert(
        'Gagal',
        error.response?.data?.message || 'Terjadi kesalahan pada server'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={gradients.background} style={styles.container}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.authCard}>
            {/* Logo */}
            <View style={styles.header}>
              <Text style={styles.logo}>rt<Text style={styles.logoAccent}>02</Text></Text>
              <Text style={styles.subtitle}>
                {isLogin ? 'Selamat datang kembali' : 'Buat akun baru'}
              </Text>
            </View>

            {/* Form */}
            {!isLogin && (
              <View style={styles.formGroup}>
                <Text style={styles.label}>Nama Lengkap</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="John Doe"
                    placeholderTextColor={colors.textSubtle}
                    autoCapitalize="words"
                  />
                </View>
              </View>
            )}

            <View style={styles.formGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="email@example.com"
                  placeholderTextColor={colors.textSubtle}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor={colors.textSubtle}
                  secureTextEntry
                />
              </View>
            </View>

            {/* Submit */}
            <TouchableOpacity 
              style={[styles.submitWrapper, loading && { opacity: 0.6 }]}
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={gradients.primary}
                start={{x:0,y:0}} end={{x:1,y:0}}
                style={styles.submitBtn}
              >
                <Text style={styles.submitText}>
                  {loading ? 'Memproses...' : (isLogin ? 'Masuk' : 'Daftar')}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Switch */}
            <View style={styles.switch}>
              <Text style={styles.switchText}>
                {isLogin ? 'Belum punya akun? ' : 'Sudah punya akun? '}
              </Text>
              <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                <Text style={styles.switchLink}>
                  {isLogin ? 'Daftar' : 'Masuk'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  authCard: {
    backgroundColor: colors.card,
    padding: spacing.xl,
    borderRadius: radius.xxl,
    ...shadows.large,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logo: {
    fontSize: 48,
    fontWeight: '800',
    color: colors.textMain,
    letterSpacing: -1,
  },
  logoAccent: {
    color: colors.primary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  formGroup: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.bodyBold,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    fontSize: 14,
  },
  inputWrapper: {
    backgroundColor: colors.background,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  input: {
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.white,
  },
  submitWrapper: {
    marginTop: spacing.md,
    borderRadius: radius.full,
    overflow: 'hidden',
    ...shadows.medium,
  },
  submitBtn: {
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: radius.full,
  },
  submitText: {
    ...typography.bodyBold,
    color: colors.white,
    fontSize: 16,
  },
  switch: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  switchText: {
    ...typography.body,
    color: colors.textMuted,
  },
  switchLink: {
    ...typography.body,
    color: colors.primaryLight,
    fontWeight: '700',
  },
});

export default LoginScreen;
