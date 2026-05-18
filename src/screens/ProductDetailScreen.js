import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import api, { getImageUrl } from '../services/api';
import { CartContext } from '../context/CartContext';
import { colors, spacing, typography, radius, shadows, gradients } from '../styles/theme';

const { width } = Dimensions.get('window');

const ProductDetailScreen = ({ route, navigation }) => {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const { addToCart, user } = useContext(CartContext);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

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
        { text: 'Lanjut Belanja', style: 'cancel' },
        { text: 'Lihat Keranjang', onPress: () => navigation.navigate('Cart') }
      ]);
    } else {
      Alert.alert('Gagal', result.error || 'Gagal menambah ke keranjang');
    }
  };

  if (loading) {
    return (
      <LinearGradient colors={gradients.background} style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </LinearGradient>
    );
  }

  if (!product) return null;

  return (
    <LinearGradient colors={gradients.background} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: getImageUrl(product.imageUrl) }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', colors.background]}
            style={styles.imageOverlay}
          />
          
          {/* Back button */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.categoryBadge}>
            <Text style={styles.category}>{product.category}</Text>
          </View>

          <Text style={styles.productName}>{product.name}</Text>

          <LinearGradient
            colors={gradients.primary}
            start={{x:0,y:0}} end={{x:1,y:0}}
            style={styles.priceGradient}
          >
            <Text style={styles.priceText}>Rp {product.price.toLocaleString('id-ID')}</Text>
          </LinearGradient>

          <View style={styles.stockRow}>
            <View style={[styles.stockDot, { backgroundColor: product.stock > 0 ? colors.success : colors.danger }]} />
            <Text style={styles.stockText}>
              {product.stock > 0 ? `${product.stock} stok tersedia` : 'Stok habis'}
            </Text>
          </View>

          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>Deskripsi</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          onPress={handleAddToCart}
          disabled={adding || product.stock === 0}
          style={[styles.ctaWrapper, (adding || product.stock === 0) && { opacity: 0.5 }]}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={product.stock === 0 ? ['#666', '#444'] : gradients.primary}
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
  imageWrapper: {
    width: '100%',
    height: width,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: '40%',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: spacing.lg,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.medium,
  },
  backText: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '600',
  },
  content: {
    padding: spacing.lg,
    paddingBottom: 120,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.card,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: radius.full,
    marginBottom: spacing.md,
  },
  category: {
    ...typography.caption,
    color: colors.textMuted,
  },
  productName: {
    ...typography.h1,
    color: colors.textMain,
    marginBottom: spacing.lg,
  },
  priceGradient: {
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: radius.md,
    marginBottom: spacing.md,
  },
  priceText: {
    ...typography.h2,
    color: colors.white,
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  stockDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stockText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textMain,
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  ctaWrapper: {
    borderRadius: radius.full,
    overflow: 'hidden',
    ...shadows.medium,
  },
  ctaButton: {
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: radius.full,
  },
  ctaText: {
    ...typography.bodyBold,
    color: colors.white,
    fontSize: 16,
  },
});

export default ProductDetailScreen;
