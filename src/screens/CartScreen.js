import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CartContext } from '../context/CartContext';
import { getImageUrl } from '../services/api';
import { colors, spacing, typography, radius, shadows, gradients } from '../styles/theme';

const CartScreen = ({ navigation }) => {
  const { cartItems, removeFromCart, clearCart, fetchCart, user } = useContext(CartContext);

  useEffect(() => {
    if (user) fetchCart();
  }, [user]);

  if (!user) {
    return (
      <LinearGradient colors={gradients.background} style={styles.container}>
        <View style={styles.centerContainer}>
          <View style={styles.messageCard}>
            <Text style={styles.messageIcon}>🔒</Text>
            <Text style={styles.messageTitle}>Login Diperlukan</Text>
            <Text style={styles.messageText}>
              Silakan login untuk melihat keranjang belanja
            </Text>
            <TouchableOpacity 
              style={styles.ctaWrapper}
              onPress={() => navigation.navigate('Login')}
            >
              <LinearGradient colors={gradients.primary} style={styles.ctaButton}>
                <Text style={styles.ctaText}>Login Sekarang</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    );
  }

  const validItems = cartItems.filter(item => item && item.product);
  const total = validItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const formatPrice = (price) => `Rp ${price.toLocaleString('id-ID')}`;

  const handleCheckout = () => {
    Alert.alert(
      'Checkout Berhasil!',
      'Pesanan Anda sedang diproses.',
      [{ text: 'OK', onPress: () => clearCart() }]
    );
  };

  if (validItems.length === 0) {
    return (
      <LinearGradient colors={gradients.background} style={styles.container}>
        <View style={styles.centerContainer}>
          <View style={styles.messageCard}>
            <Text style={styles.messageIcon}>🛒</Text>
            <Text style={styles.messageTitle}>Keranjang Kosong</Text>
            <Text style={styles.messageText}>
              Belum ada produk di keranjang. Yuk mulai belanja!
            </Text>
            <TouchableOpacity 
              style={styles.ctaWrapper}
              onPress={() => navigation.navigate('ProductList')}
            >
              <LinearGradient colors={gradients.primary} style={styles.ctaButton}>
                <Text style={styles.ctaText}>Mulai Belanja</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image
        source={{ uri: getImageUrl(item.product.imageUrl) }}
        style={styles.itemImage}
        resizeMode="cover"
      />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={2}>{item.product.name}</Text>
        <View style={styles.itemMeta}>
          <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
          <Text style={styles.itemPrice}>{formatPrice(item.product.price * item.quantity)}</Text>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.removeBtn}
        onPress={() => removeFromCart(item.product._id)}
      >
        <Text style={styles.removeText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient colors={gradients.background} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Kembali</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Keranjang</Text>
        <View style={{ width: 60 }} />
      </View>

      <FlatList
        data={validItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.product._id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      {/* Bottom Summary */}
      <View style={styles.summary}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Belanja</Text>
          <LinearGradient
            colors={gradients.primary}
            start={{x:0,y:0}} end={{x:1,y:0}}
            style={styles.totalBadge}
          >
            <Text style={styles.totalValue}>{formatPrice(total)}</Text>
          </LinearGradient>
        </View>
        
        <TouchableOpacity 
          style={styles.checkoutWrapper}
          onPress={handleCheckout}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={gradients.accent}
            start={{x:0,y:0}} end={{x:1,y:0}}
            style={styles.checkoutBtn}
          >
            <Text style={styles.checkoutText}>Checkout Sekarang</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
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
  messageCard: {
    backgroundColor: colors.card,
    padding: spacing.xl,
    borderRadius: radius.xxl,
    alignItems: 'center',
    ...shadows.large,
  },
  messageIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  messageTitle: {
    ...typography.h2,
    color: colors.textMain,
    marginBottom: spacing.sm,
  },
  messageText: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  ctaWrapper: {
    borderRadius: radius.full,
    overflow: 'hidden',
    ...shadows.medium,
  },
  ctaButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: radius.full,
  },
  ctaText: {
    ...typography.bodyBold,
    color: colors.white,
  },
  list: {
    padding: spacing.lg,
    paddingBottom: 140,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: radius.xl,
    marginBottom: spacing.md,
    alignItems: 'center',
    ...shadows.small,
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: radius.md,
    marginRight: spacing.md,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    ...typography.bodyBold,
    color: colors.textMain,
    marginBottom: spacing.xs,
  },
  itemMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemQty: {
    ...typography.small,
    color: colors.textMuted,
  },
  itemPrice: {
    ...typography.bodyBold,
    color: colors.primaryLight,
  },
  removeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  removeText: {
    color: colors.danger,
    fontSize: 16,
    fontWeight: '700',
  },
  summary: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  totalLabel: {
    ...typography.h3,
    color: colors.textSecondary,
  },
  totalBadge: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: radius.md,
  },
  totalValue: {
    ...typography.h3,
    color: colors.white,
  },
  checkoutWrapper: {
    borderRadius: radius.full,
    overflow: 'hidden',
    ...shadows.medium,
  },
  checkoutBtn: {
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: radius.full,
  },
  checkoutText: {
    ...typography.bodyBold,
    color: colors.white,
    fontSize: 16,
  },
});

export default CartScreen;
