import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CartContext } from '../context/CartContext';
import { ThemeContext } from '../context/ThemeContext';
import { spacing, typography, radius, shadows } from '../styles/theme';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { user } = useContext(CartContext);
  const { theme } = useContext(ThemeContext);
  const c = theme.colors;
  const g = theme.gradients;

  return (
    <LinearGradient colors={g.background} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.logo, { color: c.text }]}>rt<Text style={{ color: c.primary }}>02</Text></Text>
        {user && <Text style={[styles.welcome, { color: c.textMuted }]}>Halo, {user.name}!</Text>}
      </View>

      {/* Hero */}
      <View style={styles.hero}>
        <Text style={[styles.heroTitle, { color: c.text }]}>Lengkapi</Text>
        <Text style={[styles.heroTitle, { color: c.primary }]}>Rumahmu</Text>
        <Text style={[styles.heroTitle, { color: c.text }]}>Bersama Kami</Text>
        <Text style={[styles.heroSubtitle, { color: c.textMuted }]}>
          Temukan produk rumah tangga berkualitas dengan harga terbaik
        </Text>
      </View>

      {/* Action Cards */}
      <View style={styles.cards}>
        <TouchableOpacity 
          style={styles.card}
          onPress={() => navigation.navigate('ProductListTab')}
          activeOpacity={0.8}
        >
          <LinearGradient colors={g.primary} style={styles.cardGradient}>
            <Text style={styles.cardIcon}>🛍️</Text>
            <Text style={styles.cardTitle}>Jelajahi Produk</Text>
            <Text style={styles.cardDesc}>Lihat koleksi lengkap</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.card}
          onPress={() => navigation.navigate('CartTab')}
          activeOpacity={0.8}
        >
          <LinearGradient colors={g.accent} style={styles.cardGradient}>
            <Text style={styles.cardIcon}>🛒</Text>
            <Text style={styles.cardTitle}>Keranjang</Text>
            <Text style={styles.cardDesc}>Lihat belanjaan</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* CTA */}
      <TouchableOpacity 
        style={styles.ctaWrapper}
        onPress={() => navigation.navigate('ProductListTab')}
        activeOpacity={0.9}
      >
        <LinearGradient colors={g.primary} start={{x:0,y:0}} end={{x:1,y:0}} style={styles.cta}>
          <Text style={styles.ctaText}>Mulai Belanja</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Login Link */}
      {!user && (
        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.loginLink}>
          <Text style={[styles.loginText, { color: c.textMuted }]}>
            Sudah punya akun? <Text style={{ color: c.primary, fontWeight: '600' }}>Masuk</Text>
          </Text>
        </TouchableOpacity>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logo: {
    fontSize: 32,
    fontWeight: '800',
  },
  welcome: {
    ...typography.body,
  },
  hero: {
    marginBottom: spacing.xxl,
  },
  heroTitle: {
    ...typography.hero,
  },
  heroSubtitle: {
    ...typography.body,
    marginTop: spacing.md,
    lineHeight: 24,
  },
  cards: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  card: {
    flex: 1,
    borderRadius: radius.xl,
    overflow: 'hidden',
    ...shadows.medium,
  },
  cardGradient: {
    padding: spacing.lg,
    minHeight: 140,
    borderRadius: radius.xl,
  },
  cardIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  cardTitle: {
    ...typography.h3,
    color: '#fff',
    marginBottom: spacing.xs,
  },
  cardDesc: {
    ...typography.small,
    color: 'rgba(255,255,255,0.8)',
  },
  ctaWrapper: {
    borderRadius: radius.full,
    overflow: 'hidden',
    ...shadows.medium,
  },
  cta: {
    paddingVertical: 18,
    alignItems: 'center',
    borderRadius: radius.full,
  },
  ctaText: {
    ...typography.bodyBold,
    color: '#fff',
    fontSize: 16,
  },
  loginLink: {
    marginTop: spacing.xl,
    alignSelf: 'center',
  },
  loginText: {
    ...typography.body,
  },
});

export default HomeScreen;
