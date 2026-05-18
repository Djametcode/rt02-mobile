import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CartContext } from '../context/CartContext';
import { colors, spacing, typography, radius, shadows, gradients } from '../styles/theme';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { user } = useContext(CartContext);

  return (
    <LinearGradient colors={gradients.background} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>rt<Text style={styles.logoAccent}>02</Text></Text>
        {user && <Text style={styles.welcome}>Halo, {user.name}!</Text>}
      </View>

      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Lengkapi</Text>
        <Text style={styles.heroTitleGradient}>Rumahmu</Text>
        <Text style={styles.heroTitle}>Bersama Kami</Text>
        <Text style={styles.heroSubtitle}>
          Temukan produk rumah tangga berkualitas dengan harga terbaik
        </Text>
      </View>

      {/* Action Cards */}
      <View style={styles.cards}>
        <TouchableOpacity 
          style={styles.card}
          onPress={() => navigation.navigate('ProductList')}
          activeOpacity={0.8}
        >
          <LinearGradient colors={['#6366f1', '#8b5cf6']} style={styles.cardGradient}>
            <Text style={styles.cardIcon}>🛍️</Text>
            <Text style={styles.cardTitle}>Jelajahi Produk</Text>
            <Text style={styles.cardDesc}>Lihat koleksi lengkap</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.card}
          onPress={() => navigation.navigate('Cart')}
          activeOpacity={0.8}
        >
          <LinearGradient colors={['#f59e0b', '#ec4899']} style={styles.cardGradient}>
            <Text style={styles.cardIcon}>🛒</Text>
            <Text style={styles.cardTitle}>Keranjang</Text>
            <Text style={styles.cardDesc}>Lihat belanjaan</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* CTA */}
      <TouchableOpacity 
        style={styles.ctaWrapper}
        onPress={() => navigation.navigate('ProductList')}
        activeOpacity={0.9}
      >
        <LinearGradient colors={gradients.primary} start={{x:0,y:0}} end={{x:1,y:0}} style={styles.cta}>
          <Text style={styles.ctaText}>Mulai Belanja</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Login Link */}
      {!user && (
        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.loginLink}>
          <Text style={styles.loginText}>
            Sudah punya akun? <Text style={styles.loginAccent}>Masuk</Text>
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
    color: colors.textMain,
  },
  logoAccent: {
    color: colors.primary,
  },
  welcome: {
    ...typography.body,
    color: colors.textMuted,
  },
  hero: {
    marginBottom: spacing.xxl,
  },
  heroTitle: {
    ...typography.hero,
    color: colors.textMain,
  },
  heroTitleGradient: {
    ...typography.hero,
    color: colors.primary,
  },
  heroSubtitle: {
    ...typography.body,
    color: colors.textMuted,
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
    color: colors.white,
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
    color: colors.white,
    fontSize: 16,
  },
  loginLink: {
    marginTop: spacing.xl,
    alignSelf: 'center',
  },
  loginText: {
    ...typography.body,
    color: colors.textMuted,
  },
  loginAccent: {
    color: colors.primary,
    fontWeight: '600',
  },
});

export default HomeScreen;
