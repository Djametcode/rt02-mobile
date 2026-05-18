import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CartContext } from '../context/CartContext';
import { ThemeContext } from '../context/ThemeContext';
import { spacing, typography, radius, shadows } from '../styles/theme';

const ProfileScreen = ({ navigation }) => {
  const { user, logout, cartItems } = useContext(CartContext);
  const { theme, isDark, toggleTheme } = useContext(ThemeContext);
  const c = theme.colors;
  const g = theme.gradients;

  const handleLogout = () => {
    Alert.alert('Logout', 'Yakin ingin keluar?', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => {
        logout();
        navigation.navigate('Home');
      }}
    ]);
  };

  if (!user) {
    return (
      <LinearGradient colors={g.background} style={styles.container}>
        <View style={styles.centerContainer}>
          <View style={[styles.messageCard, { backgroundColor: c.card }]}>
            <Text style={styles.icon}>👤</Text>
            <Text style={[styles.messageTitle, { color: c.text }]}>Belum Login</Text>
            <Text style={[styles.messageText, { color: c.textMuted }]}>
              Login untuk melihat profil dan riwayat belanja
            </Text>
            <TouchableOpacity 
              style={styles.ctaWrapper}
              onPress={() => navigation.navigate('Login')}
            >
              <LinearGradient colors={g.primary} style={styles.ctaButton}>
                <Text style={styles.ctaText}>Login Sekarang</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    );
  }

  const initials = user.name?.charAt(0)?.toUpperCase() || 'U';
  const validItems = cartItems?.filter(i => i && i.product) || [];
  const totalCart = validItems.reduce((s, i) => s + i.product.price * i.quantity, 0);

  return (
    <LinearGradient colors={g.background} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: c.text }]}>Profil</Text>
          <TouchableOpacity onPress={toggleTheme} style={[styles.themeBtn, { backgroundColor: c.card }]}>
            <Text style={styles.themeIcon}>{isDark ? '☀️' : '🌙'}</Text>
          </TouchableOpacity>
        </View>

        {/* User Card */}
        <LinearGradient colors={g.primary} style={[styles.userCard, shadows.medium]}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </LinearGradient>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: c.card }]}>
            <Text style={[styles.statValue, { color: c.primary }]}>{validItems.length}</Text>
            <Text style={[styles.statLabel, { color: c.textMuted }]}>Item Cart</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: c.card }]}>
            <Text style={[styles.statValue, { color: c.accent }]}>
              Rp {(totalCart / 1000).toFixed(0)}K
            </Text>
            <Text style={[styles.statLabel, { color: c.textMuted }]}>Total Belanja</Text>
          </View>
        </View>

        {/* Settings Section */}
        <Text style={[styles.sectionTitle, { color: c.textMuted }]}>PENGATURAN</Text>
        
        <View style={[styles.menuCard, { backgroundColor: c.card }]}>
          <View style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Text style={styles.menuIcon}>{isDark ? '🌙' : '☀️'}</Text>
              <Text style={[styles.menuLabel, { color: c.text }]}>
                {isDark ? 'Mode Gelap' : 'Mode Terang'}
              </Text>
            </View>
            <Switch 
              value={isDark} 
              onValueChange={toggleTheme}
              trackColor={{ false: c.border, true: c.primary }}
              thumbColor={'#fff'}
            />
          </View>
        </View>

        {/* Account Section */}
        <Text style={[styles.sectionTitle, { color: c.textMuted }]}>AKUN</Text>
        
        <View style={[styles.menuCard, { backgroundColor: c.card }]}>
          <TouchableOpacity 
            style={[styles.menuItem, { borderBottomColor: c.border, borderBottomWidth: 1 }]}
            onPress={() => navigation.navigate('Cart')}
          >
            <View style={styles.menuLeft}>
              <Text style={styles.menuIcon}>🛒</Text>
              <Text style={[styles.menuLabel, { color: c.text }]}>Keranjang Saya</Text>
            </View>
            <Text style={[styles.menuArrow, { color: c.textMuted }]}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.menuItem, { borderBottomColor: c.border, borderBottomWidth: 1 }]}
            onPress={() => Alert.alert('Info', 'Fitur sedang dikembangkan')}
          >
            <View style={styles.menuLeft}>
              <Text style={styles.menuIcon}>📦</Text>
              <Text style={[styles.menuLabel, { color: c.text }]}>Pesanan Saya</Text>
            </View>
            <Text style={[styles.menuArrow, { color: c.textMuted }]}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => Alert.alert('Info', 'Fitur sedang dikembangkan')}
          >
            <View style={styles.menuLeft}>
              <Text style={styles.menuIcon}>📍</Text>
              <Text style={[styles.menuLabel, { color: c.text }]}>Alamat</Text>
            </View>
            <Text style={[styles.menuArrow, { color: c.textMuted }]}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity 
          style={[styles.logoutBtn, { backgroundColor: c.card, borderColor: c.danger }]}
          onPress={handleLogout}
        >
          <Text style={[styles.logoutText, { color: c.danger }]}>🚪  Logout</Text>
        </TouchableOpacity>

        <Text style={[styles.version, { color: c.textSubtle }]}>rt02 v1.0.0</Text>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: spacing.lg, paddingTop: 60, paddingBottom: 100 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.lg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  headerTitle: { ...typography.h1 },
  themeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeIcon: { fontSize: 20 },
  userCard: {
    padding: spacing.xl,
    borderRadius: radius.xxl,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '800',
    color: '#fff',
  },
  userName: {
    ...typography.h2,
    color: '#fff',
    marginBottom: 4,
  },
  userEmail: {
    ...typography.body,
    color: 'rgba(255,255,255,0.85)',
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    padding: spacing.md,
    borderRadius: radius.lg,
    alignItems: 'center',
  },
  statValue: { ...typography.h2 },
  statLabel: { ...typography.small, marginTop: 4 },
  sectionTitle: {
    ...typography.caption,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  menuCard: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    paddingVertical: 18,
  },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  menuIcon: { fontSize: 22 },
  menuLabel: { ...typography.body, fontWeight: '500' },
  menuArrow: { fontSize: 20, fontWeight: '400' },
  logoutBtn: {
    padding: spacing.md,
    borderRadius: radius.lg,
    alignItems: 'center',
    borderWidth: 1,
    marginTop: spacing.md,
  },
  logoutText: { ...typography.bodyBold },
  version: {
    textAlign: 'center',
    marginTop: spacing.lg,
    ...typography.small,
  },
  // Unauthorized
  messageCard: {
    padding: spacing.xl,
    borderRadius: radius.xxl,
    alignItems: 'center',
  },
  icon: { fontSize: 64, marginBottom: spacing.md },
  messageTitle: { ...typography.h2, marginBottom: spacing.sm },
  messageText: { ...typography.body, textAlign: 'center', marginBottom: spacing.lg },
  ctaWrapper: { borderRadius: radius.full, overflow: 'hidden' },
  ctaButton: { paddingVertical: 14, paddingHorizontal: 32, borderRadius: radius.full },
  ctaText: { ...typography.bodyBold, color: '#fff' },
});

export default ProfileScreen;
