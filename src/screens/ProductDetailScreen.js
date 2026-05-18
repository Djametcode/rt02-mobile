import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import api, { getImageUrl } from '../services/api';
import { CartContext } from '../context/CartContext';
import { ThemeContext } from '../context/ThemeContext';
import { spacing, typography, radius, shadows } from '../styles/theme';

const { width } = Dimensions.get('window');

const ProductDetailScreen = ({ route, navigation }) => {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const { addToCart, user } = useContext(CartContext);
  const { theme } = useContext(ThemeContext);
  const c = theme.colors;
  const g = theme.gradients;

  useEffect(() => { fetchProduct(); }, [productId]);

  const fetchProduct = async () => {
    try {
      const { data } = await api.get(`/products/${productId}`);
      setProduct(data);
    } catch (err) {
      Alert.alert('Error', 'Gagal memuat detail produk');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      Alert.alert('Login Required', 'Silakan login terlebih dahulu', [
        { text: 'Batal', style: 'cancel' },
        { text: 'Login', onPress: () => navigation.navigate('Login') }
      ]);
      return;
    }
    setAdding(true);
    const result = await addToCart(productId, 1);
    setAdding(false);
    if (result.success) {
      Alert.alert('Berhasil', 'Produk ditambahkan ke keranjang', [
        { text: 'Lanjut', style: 'cancel' },
        { text: 'Lihat Keranjang', onPress: () => navigation.navigate('CartTab') }
      ]);
    } else {
      Alert.alert('Gagal', result.error || 'Gagal menambah ke keranjang');
    }
  };

  if (loading) {
    return (
      <LinearGradient colors={g.background} style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={c.primary} />
        </View>
      </LinearGradient>
    );
  }
  if (!product) return null;

  return (
    <LinearGradient colors={g.background} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageWrapper}>
          <Image source={{ uri: getImageUrl(product.imageUrl) }} style={styles.heroImage} resizeMode="cover" />
          <LinearGradient colors={['transparent', c.background]} style={styles.imageOverlay} />
          <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backButton, { backgroundColor: c.card }]}>
            <Text style={[styles.backText, { color: c.text }]}>←</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={[styles.categoryBadge, { backgroundColor: c.card }]}>
            <Text style={[styles.category, { color: c.textMuted }]}>{product.category}</Text>
          </View>

          <Text style={[styles.productName, { color: c.text }]}>{product.name}</Text>

          <LinearGradient colors={g.primary} start={{x:0,y:0}} end={{x:1,y:0}} style={styles.priceGradient}>
            <Text style={styles.priceText}>Rp {product.price.toLocaleString('id-ID')}</Text>
          </LinearGradient>

          <View style={styles.stockRow}>
            <View style={[styles.stockDot, { backgroundColor: product.stock > 0 ? c.success : c.danger }]} />
            <Text style={[styles.stockText, { color: c.textSecondary }]}>
              {product.stock > 0 ? `${product.stock} stok tersedia` : 'Stok habis'}
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: c.border }]} />
          <Text style={[styles.sectionTitle, { color: c.text }]}>Deskripsi</Text>
          <Text style={[styles.description, { color: c.textSecondary }]}>{product.description}</Text>
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { backgroundColor: c.background, borderTopColor: c.border }]}>
        <TouchableOpacity
          onPress={handleAddToCart}
          disabled={adding || product.stock === 0}
          style={[styles.ctaWrapper, (adding || product.stock === 0) && { opacity: 0.5 }]}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={product.stock === 0 ? ['#666', '#444'] : g.primary}
            start={{x:0,y:0}} end={{x:1,y:0}}
            style={styles.ctaButton}
          >
            <Text style={styles.ctaText}>
              {adding ? 'Menambah...' : product.stock === 0 ? 'Stok Habis' : '+ Tambah ke Keranjang'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  imageWrapper: { width: '100%', height: width, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  imageOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%' },
  backButton: {
    position: 'absolute', top: 50, left: spacing.lg,
    width: 44, height: 44, borderRadius: 22,
    justifyContent: 'center', alignItems: 'center',
    ...shadows.medium,
  },
  backText: { fontSize: 22, fontWeight: '600' },
  content: { padding: spacing.lg, paddingBottom: 120 },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 6, paddingHorizontal: 14,
    borderRadius: radius.full, marginBottom: spacing.md,
  },
  category: { ...typography.caption },
  productName: { ...typography.h1, marginBottom: spacing.lg },
  priceGradient: {
    alignSelf: 'flex-start',
    paddingVertical: 10, paddingHorizontal: 18,
    borderRadius: radius.md, marginBottom: spacing.md,
  },
  priceText: { ...typography.h2, color: '#fff' },
  stockRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
  stockDot: { width: 8, height: 8, borderRadius: 4 },
  stockText: { ...typography.body },
  divider: { height: 1, marginVertical: spacing.lg },
  sectionTitle: { ...typography.h3, marginBottom: spacing.sm },
  description: { ...typography.body, lineHeight: 24 },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: 30,
    borderTopWidth: 1,
  },
  ctaWrapper: { borderRadius: radius.full, overflow: 'hidden', ...shadows.medium },
  ctaButton: { paddingVertical: 16, alignItems: 'center', borderRadius: radius.full },
  ctaText: { ...typography.bodyBold, color: '#fff', fontSize: 16 },
});

export default ProductDetailScreen;
