import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import api, { getImageUrl } from '../services/api';
import { CartContext } from '../context/CartContext';
import { colors, spacing, typography, shadows } from '../styles/theme';

const ProductDetailScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart, user } = useContext(CartContext);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
    } catch (err) {
      console.error(err);
      setError('Detail produk tidak ditemukan atau terjadi gangguan koneksi.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      Alert.alert('Login Diperlukan', 'Silakan login terlebih dahulu untuk menambahkan ke keranjang', [
        { text: 'Batal', onPress: () => {} },
        { text: 'Login', onPress: () => navigation.navigate('Login') },
      ]);
      return;
    }

    const result = await addToCart(product._id);
    if (result.success) {
      Alert.alert('Berhasil', 'Produk ditambahkan ke keranjang', [
        { text: 'Lanjut Belanja', onPress: () => navigation.goBack() },
        { text: 'Lihat Keranjang', onPress: () => navigation.navigate('Cart') },
      ]);
    } else {
      Alert.alert('Gagal', result.message);
    }
  };

  const formatPrice = (price) => {
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Memuat detail produk...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>← Kembali ke Katalog</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backLink} onPress={() => navigation.goBack()}>
        <Text style={styles.backLinkText}>← Kembali ke Katalog</Text>
      </TouchableOpacity>

      <View style={styles.detailCard}>
        <View style={styles.imageSection}>
          {product?.imageUrl || product?.image ? (
            <Image 
              source={{ uri: getImageUrl(product.imageUrl || product.image) }}
              style={styles.detailImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderText}>Gambar Tidak Tersedia</Text>
            </View>
          )}
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.category}>{product?.category}</Text>
          <Text style={styles.title}>{product?.name}</Text>
          
          <Text style={styles.price}>{formatPrice(product?.price)}</Text>
          
          <View style={styles.divider} />

          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Deskripsi</Text>
            <Text style={styles.description}>{product?.description}</Text>
          </View>

          <View style={styles.stockSection}>
            <Text style={styles.stockLabel}>Stok:</Text>
            <Text style={styles.stockValue}>{product?.stock} unit</Text>
          </View>

          <TouchableOpacity 
            style={styles.addCartBtn}
            onPress={handleAddToCart}
          >
            <Text style={styles.addCartBtnText}>🛒 Tambahkan ke Keranjang</Text>
          </TouchableOpacity>
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
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  loadingText: {
    marginTop: spacing.md,
    ...typography.body,
    color: colors.textMuted,
  },
  errorText: {
    ...typography.body,
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  backBtn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
  },
  backBtnText: {
    color: colors.white,
    fontWeight: '600',
  },
  backLink: {
    marginBottom: spacing.md,
  },
  backLinkText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  detailCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    overflow: 'hidden',
    ...shadows.medium,
  },
  imageSection: {
    width: '100%',
    height: 300,
    backgroundColor: colors.border,
  },
  detailImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.border,
  },
  placeholderText: {
    ...typography.body,
    color: colors.textMuted,
  },
  infoSection: {
    padding: spacing.lg,
  },
  category: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.h2,
    marginBottom: spacing.md,
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  descriptionSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.body,
    color: colors.textMuted,
    lineHeight: 24,
  },
  stockSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  stockLabel: {
    ...typography.body,
    fontWeight: '600',
    marginRight: spacing.sm,
  },
  stockValue: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  addCartBtn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    ...shadows.small,
  },
  addCartBtnText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProductDetailScreen;
