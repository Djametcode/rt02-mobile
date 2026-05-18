import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import api, { getImageUrl } from '../services/api';
import { ThemeContext } from '../context/ThemeContext';
import { spacing, typography, radius, shadows } from '../styles/theme';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - spacing.lg * 2 - spacing.md) / 2;

const ProductListScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useContext(ThemeContext);
  const c = theme.colors;
  const g = theme.gradients;

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
      <View style={[styles.productCard, { backgroundColor: c.card }]}>
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
            <View style={[styles.stockBadge, { backgroundColor: c.danger }]}>
              <Text style={styles.stockText}>Terbatas</Text>
            </View>
          )}
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={[styles.category, { color: c.textMuted }]} numberOfLines={1}>{item.category}</Text>
          <Text style={[styles.productName, { color: c.text }]} numberOfLines={2}>{item.name}</Text>
          
          <LinearGradient
            colors={g.primary}
            start={{x:0,y:0}} end={{x:1,y:0}}
            style={styles.priceGradient}
          >
            <Text style={styles.price}>Rp {item.price.toLocaleString('id-ID')}</Text>
          </LinearGradient>

          <View style={styles.stockRow}>
            <View style={[styles.stockDot, { backgroundColor: item.stock > 0 ? c.success : c.danger }]} />
            <Text style={[styles.stockInfo, { color: c.textMuted }]}>{item.stock > 0 ? `${item.stock} tersedia` : 'Habis'}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={g.background} style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: c.border }]}>
        <Text style={[styles.headerTitle, { color: c.text }]}>Produk</Text>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={c.primary} />
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={[styles.errorText, { color: c.danger }]}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchProducts}>
            <LinearGradient colors={g.primary} style={styles.retryGradient}>
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
    paddingTop: 50,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
  },
  headerTitle: {
    ...typography.h2,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    ...typography.body,
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
    color: '#fff',
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
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: radius.sm,
  },
  stockText: {
    ...typography.caption,
    color: '#fff',
  },
  content: {
    padding: spacing.md,
  },
  category: {
    ...typography.caption,
    marginBottom: spacing.xs,
  },
  productName: {
    ...typography.bodyBold,
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
    color: '#fff',
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
  },
});

export default ProductListScreen;
