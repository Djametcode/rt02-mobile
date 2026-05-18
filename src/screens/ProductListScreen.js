import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import api, { getImageUrl } from '../services/api';
import { colors, spacing, typography, radius, shadows, gradients } from '../styles/theme';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - spacing.lg * 2 - spacing.md) / 2;

const ProductListScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/products');
      setProducts(data);
      setError(null);
    } catch (err) {
      setError('Gagal memuat produk');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.productWrapper}
      onPress={() => navigation.navigate('ProductDetail', { productId: item._id })}
      activeOpacity={0.8}
    >
      <View style={styles.productCard}>
        {/* Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: getImageUrl(item.imageUrl) }}
            style={styles.productImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.6)']}
            style={styles.imageOverlay}
          />
          {item.stock < 5 && (
            <View style={styles.stockBadge}>
              <Text style={styles.stockText}>Terbatas</Text>
            </View>
          )}
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.category} numberOfLines={1}>{item.category}</Text>
          <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
          
          <LinearGradient
            colors={gradients.primary}
            start={{x:0,y:0}} end={{x:1,y:0}}
            style={styles.priceGradient}
          >
            <Text style={styles.price}>Rp {item.price.toLocaleString('id-ID')}</Text>
          </LinearGradient>

          <View style={styles.stockRow}>
            <View style={[styles.stockDot, { backgroundColor: item.stock > 0 ? colors.success : colors.danger }]} />
            <Text style={styles.stockInfo}>{item.stock > 0 ? `${item.stock} tersedia` : 'Habis'}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={gradients.background} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Kembali</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Produk</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchProducts}>
            <LinearGradient colors={gradients.primary} style={styles.retryGradient}>
              <Text style={styles.retryText}>Coba Lagi</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item._id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          scrollIndicatorInsets={{ right: 1 }}
        />
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    ...typography.bodyBold,
    color: colors.primary,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.textMain,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    ...typography.body,
    color: colors.danger,
    marginBottom: spacing.lg,
  },
  retryButton: {
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  retryGradient: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  retryText: {
    ...typography.bodyBold,
    color: colors.white,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  columnWrapper: {
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  productWrapper: {
    width: ITEM_WIDTH,
    borderRadius: radius.xl,
    overflow: 'hidden',
    ...shadows.medium,
  },
  productCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: ITEM_WIDTH,
    position: 'relative',
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  stockBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: radius.sm,
  },
  stockText: {
    ...typography.caption,
    color: colors.white,
  },
  content: {
    padding: spacing.md,
  },
  category: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  productName: {
    ...typography.bodyBold,
    color: colors.textMain,
    marginBottom: spacing.sm,
    height: 40,
  },
  priceGradient: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
  },
  price: {
    ...typography.bodyBold,
    color: colors.white,
    fontSize: 14,
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  stockDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  stockInfo: {
    ...typography.small,
    color: colors.textMuted,
  },
});

export default ProductListScreen;
