import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { CartContext } from '../context/CartContext';
import { colors, spacing, typography, shadows } from '../styles/theme';

const HomeScreen = ({ navigation }) => {
  const { user } = useContext(CartContext);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <View style={styles.heroContent}>
          <Text style={styles.tagline}>Solusi Cerdas Rumah Tangga</Text>
          <Text style={styles.title}>
            Lengkapi Rumahmu{'\n'}Bersama <Text style={styles.brand}>rt02</Text>
          </Text>
          <Text style={styles.description}>
            Temukan peralatan rumah tangga modern dengan desain minimalis dan kualitas terjamin untuk keluarga Indonesia.
          </Text>

          <View style={styles.buttonGroup}>
            <TouchableOpacity 
              style={styles.btnPrimary}
              onPress={() => navigation.navigate('ProductList')}
            >
              <Text style={styles.btnPrimaryText}>Mulai Belanja</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.btnOutline}
              onPress={() => navigation.navigate(user ? 'Cart' : 'Login')}
            >
              <Text style={styles.btnOutlineText}>
                {user ? 'Lihat Keranjangmu' : 'Daftar Akun'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.heroImageContainer}>
          <View style={styles.imageBlob}>
            <Image 
              source={{ uri: 'https://online-marketplace02-bwri.vercel.app/gambar-hero.jpg' }}
              style={styles.heroImage}
              resizeMode="cover"
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: spacing.xl,
  },
  hero: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  heroContent: {
    marginBottom: spacing.xl,
  },
  tagline: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.h1,
    fontSize: 36,
    lineHeight: 44,
    marginBottom: spacing.md,
  },
  brand: {
    color: colors.primary,
  },
  description: {
    ...typography.body,
    color: colors.textMuted,
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  buttonGroup: {
    gap: spacing.md,
  },
  btnPrimary: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    ...shadows.small,
  },
  btnPrimaryText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  btnOutline: {
    borderWidth: 2,
    borderColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnOutlineText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  heroImageContainer: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  imageBlob: {
    width: 280,
    height: 280,
    borderRadius: 140,
    overflow: 'hidden',
    backgroundColor: colors.primary + '20',
    ...shadows.medium,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
});

export default HomeScreen;
