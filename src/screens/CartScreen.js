import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { CartContext } from '../context/CartContext';
import { colors, spacing, typography, shadows } from '../styles/theme';

const CartScreen = ({ navigation }) => {
  const { cartItems, removeFromCart, clearCart, fetchCart, user } = useContext(CartContext);

  useEffect(() => {
    if (user) fetchCart();
  }, [user]);

  if (!user) {
    return (
      <View style={styles.unauthorized}>
        <Text style={styles.unauthTitle}>Akses Ditolak</Text>
        <Text style={styles.unauthMessage}>
          Anda harus login terlebih dahulu untuk melihat dan mengelola keranjang belanja Anda.
        </Text>
        <TouchableOpacity 
          style={styles.loginBtn}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginBtnText}>Pergi ke Halaman Login</Text>
        </TouchableOpacity>
      </View>
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
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>Keranjang Kosong</Text>
        <Text style={styles.emptyMessage}>
          Keranjang Anda masih kosong. Yuk, cari barang impianmu!
        </Text>
        <TouchableOpacity 
          style={styles.shopBtn}
          onPress={() => navigation.navigate('ProductList')}
        >
          <Text style={styles.shopBtnText}>Mulai Belanja</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.product.name}</Text>
        <Text style={styles.itemQty}>x{item.quantity}</Text>
      </View>
      <View style={styles.itemAction}>
        <Text style={styles.itemPrice}>
          {formatPrice(item.product.price * item.quantity)}
        </Text>
        <TouchableOpacity 
          style={styles.removeBtn}
          onPress={() => removeFromCart(item.product._id)}
        >
          <Text style={styles.removeBtnText}>Hapus</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Keranjang Belanja Anda</Text>
      
      <FlatList
        data={validItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.product._id}
        contentContainerStyle={styles.list}
      />

      <View style={styles.summary}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Belanja:</Text>
          <Text style={styles.totalValue}>{formatPrice(total)}</Text>
        </View>
        <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
          <Text style={styles.checkoutBtnText}>Proses Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: { ...typography.h2, padding: spacing.lg, paddingBottom: spacing.md },
  list: { paddingHorizontal: spacing.lg },
  cartItem: {
    backgroundColor: colors.cardBg,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shadows.small,
  },
  itemInfo: { flex: 1 },
  itemName: { ...typography.body, fontWeight: '600', marginBottom: 4 },
  itemQty: { ...typography.caption },
  itemAction: { alignItems: 'flex-end' },
  itemPrice: { fontSize: 16, fontWeight: '700', color: colors.primary, marginBottom: spacing.xs },
  removeBtn: {
    backgroundColor: colors.error,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  removeBtnText: { color: colors.white, fontSize: 12, fontWeight: '600' },
  summary: {
    backgroundColor: colors.cardBg,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  totalLabel: { ...typography.h3 },
  totalValue: { fontSize: 24, fontWeight: '700', color: colors.primary },
  checkoutBtn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    ...shadows.small,
  },
  checkoutBtnText: { color: colors.white, fontSize: 16, fontWeight: '600' },
  unauthorized: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  unauthTitle: { ...typography.h2, marginBottom: spacing.md },
  unauthMessage: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  loginBtn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
  },
  loginBtnText: { color: colors.white, fontWeight: '600' },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  emptyTitle: { ...typography.h2, marginBottom: spacing.sm },
  emptyMessage: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  shopBtn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
  },
  shopBtnText: { color: colors.white, fontWeight: '600' },
});

export default CartScreen;
