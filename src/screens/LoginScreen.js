import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../services/api';
import { CartContext } from '../context/CartContext';
import { ThemeContext } from '../context/ThemeContext';
import { spacing, typography, radius, shadows } from '../styles/theme';

const LoginScreen = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(CartContext);
  const { theme } = useContext(ThemeContext);
  const c = theme.colors;
  const g = theme.gradients;

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
        [{ text: 'OK', onPress: () => navigation.navigate('Tabs') }]
      );
    } catch (error) {
      Alert.alert('Gagal', error.response?.data?.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={g.background} style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Back Button */}
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={[styles.backBtn, { backgroundColor: c.card }]}
          >
            <Text style={[styles.backText, { color: c.text }]}>←</Text>
          </TouchableOpacity>

          <View style={[styles.authCard, { backgroundColor: c.card }]}>
            {/* Logo */}
            <View style={styles.header}>
              <Text style={[styles.logo, { color: c.text }]}>rt<Text style={{ color: c.primary }}>02</Text></Text>
              <Text style={[styles.subtitle, { color: c.textMuted }]}>
                {isLogin ? 'Selamat datang kembali' : 'Buat akun baru'}
              </Text>
            </View>

            {/* Form */}
            {!isLogin && (
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: c.textSecondary }]}>Nama Lengkap</Text>
                <View style={[styles.inputWrapper, { backgroundColor: c.background, borderColor: c.border }]}>
                  <TextInput
                    style={[styles.input, { color: c.text }]}
                    value={name}
                    onChangeText={setName}
                    placeholder="John Doe"
                    placeholderTextColor={c.textSubtle}
                    autoCapitalize="words"
                  />
                </View>
              </View>
            )}

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: c.textSecondary }]}>Email</Text>
              <View style={[styles.inputWrapper, { backgroundColor: c.background, borderColor: c.border }]}>
                <TextInput
                  style={[styles.input, { color: c.text }]}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="email@example.com"
                  placeholderTextColor={c.textSubtle}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: c.textSecondary }]}>Password</Text>
              <View style={[styles.inputWrapper, { backgroundColor: c.background, borderColor: c.border }]}>
                <TextInput
                  style={[styles.input, { color: c.text }]}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor={c.textSubtle}
                  secureTextEntry
                />
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.submitWrapper, loading && { opacity: 0.6 }]}
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.8}
            >
              <LinearGradient colors={g.primary} start={{x:0,y:0}} end={{x:1,y:0}} style={styles.submitBtn}>
                <Text style={styles.submitText}>
                  {loading ? 'Memproses...' : (isLogin ? 'Masuk' : 'Daftar')}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.switch}>
              <Text style={[styles.switchText, { color: c.textMuted }]}>
                {isLogin ? 'Belum punya akun? ' : 'Sudah punya akun? '}
              </Text>
              <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                <Text style={[styles.switchLink, { color: c.primaryLight }]}>
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
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: spacing.lg },
  backBtn: {
    position: 'absolute', top: 50, left: spacing.lg,
    width: 44, height: 44, borderRadius: 22,
    justifyContent: 'center', alignItems: 'center',
    ...shadows.small,
  },
  backText: { fontSize: 22, fontWeight: '600' },
  authCard: {
    padding: spacing.xl, borderRadius: radius.xxl,
    ...shadows.large,
  },
  header: { alignItems: 'center', marginBottom: spacing.xl },
  logo: { fontSize: 48, fontWeight: '800', letterSpacing: -1 },
  subtitle: { ...typography.body, marginTop: spacing.xs },
  formGroup: { marginBottom: spacing.md },
  label: { ...typography.bodyBold, marginBottom: spacing.xs, fontSize: 14 },
  inputWrapper: {
    borderRadius: radius.md, borderWidth: 1, overflow: 'hidden',
  },
  input: {
    paddingHorizontal: spacing.md, paddingVertical: 14,
    fontSize: 15,
  },
  submitWrapper: {
    marginTop: spacing.md, borderRadius: radius.full,
    overflow: 'hidden', ...shadows.medium,
  },
  submitBtn: { paddingVertical: 16, alignItems: 'center', borderRadius: radius.full },
  submitText: { ...typography.bodyBold, color: '#fff', fontSize: 16 },
  switch: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.lg },
  switchText: { ...typography.body },
  switchLink: { ...typography.body, fontWeight: '700' },
});

export default LoginScreen;
