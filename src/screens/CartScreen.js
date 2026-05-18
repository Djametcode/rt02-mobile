import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CartContext } from '../context/CartContext';
import { ThemeContext } from '../context/ThemeContext';
import { getImageUrl } from '../services/api';
import { spacing, typography, radius, shadows } from '../styles/theme';

const CartScreen = ({ navigation }) => {
  const { cartItems, removeFromCart, clearCart, fetchCart, user } = useContext(CartContext);
  const { theme } = useContext(ThemeContext);
  const c = theme.colors;
  const g = theme.gradients;

  useEffect(() => { if (user) fetchCart(); }, [user]);

  if (!user) {
    return (
      <LinearGradient colors={g.background} style={styles.container}>
        <View style={styles.centerContainer}>
          <View style={[styles.messageCard, { backgroundColor: c.card }]}>
            <Text style={styles.icon}>🔒</Text>
            <Text style={[styles.messageTitle, { color: c.text }]}>Login Diperlukan</Text>
            <Text style={[styles.messageText, { color: c.textMuted }]}>
              Silakan login untuk melihat keranjang
            </Text>
            <TouchableOpacity style={styles.ctaWrapper} onPress={() => navigation.navigate('Login')}>
              <LinearGradient colors={g.primary} style={styles.ctaButton}>
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
    Alert.alert('Checkout Berhasil!', 'Pesanan Anda sedang diproses.', [
      { text: 'OK', onPress: () => clearCart() }
    ]);
  };

  if (validItems.length === 0) {
    return (
      <LinearGradient colors={g.background} style={styles.container}>
        <View style={styles.centerContainer}>
          <View style={[styles.messageCard, { backgroundColor: c.card }]}>
            <Text style={styles.icon}>🛒</Text>
            <Text style={[styles.messageTitle, { color: c.text }]}>Keranjang Kosong</Text>
            <Text style={[styles.messageText, { color: c.textMuted }]}>
              Belum ada produk di keranjang
            </Text>
            <TouchableOpacity style={styles.ctaWrapper} onPress={() => navigation.navigate('ProductListTab')}>
              <LinearGradient colors={g.primary} style={styles.ctaButton}>
                <Text style={styles.ctaText}>Mulai Belanja</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    );
  }

  const renderItem = ({ item }) => (
    <View style={[styles.cartItem, { backgroundColor: c.card }]}>
      <Image source={{ uri: getImageUrl(item.product.imageUrl) }} style={styles.itemImage} resizeMode="cover" />
      <View style={styles.itemInfo}>
        <Text style={[styles.itemName, { color: c.text }]} numberOfLines={2}>{item.product.name}</Text>
        <View style={styles.itemMeta}>
          <Text style={[styles.itemQty, { color: c.textMuted }]}>Qty: {item.quantity}</Text>
          <Text style={[styles.itemPrice, { color: c.primaryLight }]}>{formatPrice(item.product.price * item.quantity)}</Text>
        </View>
      </View>
      <TouchableOpacity 
        style={[styles.removeBtn, { backgroundColor: c.background }]}
        onPress={() => removeFromCart(item.product._id)}
      >
        <Text style={[styles.removeText, { color: c.danger }]}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient colors={g.background} style={styles.container}>
      <View style={[styles.header, { borderBottomColor: c.border }]}>
        <Text style={[styles.headerTitle, { color: c.text }]}>Keranjang</Text>
      </View>

      <FlatList
        data={validItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.product._id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <View style={[styles.summary, { backgroundColor: c.background, borderTopColor: c.border }]}>
        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { color: c.textSecondary }]}>Total Belanja</Text>
          <LinearGradient colors={g.primary} start={{x:0,y:0}} end={{x:1,y:0}} style={styles.totalBadge}>
            <Text style={styles.totalValue}>{formatPrice(total)}</Text>
          </LinearGradient>
        </View>
        <TouchableOpacity style={styles.checkoutWrapper} onPress={handleCheckout} activeOpacity={0.8}>
          <LinearGradient colors={g.accent} start={{x:0,y:0}} end={{x:1,y:0}} style={styles.checkoutBtn}>
            <Text style={styles.checkoutText}>Checkout Sekarang</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.lg },
  header: {
    paddingTop: 50, paddingHorizontal: spacing.lg, paddingBottom: spacing.lg,
    borderBottomWidth: 1,
  },
  headerTitle: { ...typography.h2 },
  messageCard: { padding: spacing.xl, borderRadius: radius.xxl, alignItems: 'center' },
  icon: { fontSize: 64, marginBottom: spacing.md },
  messageTitle: { ...typography.h2, marginBottom: spacing.sm },
  messageText: { ...typography.body, textAlign: 'center', marginBottom: spacing.lg },
  ctaWrapper: { borderRadius: radius.full, overflow: 'hidden', ...shadows.medium },
  ctaButton: { paddingVertical: 14, paddingHorizontal: 32, borderRadius: radius.full },
  ctaText: { ...typography.bodyBold, color: '#fff' },
  list: { padding: spacing.lg, paddingBottom: 180 },
  cartItem: {
    flexDirection: 'row', padding: spacing.md, borderRadius: radius.xl,
    marginBottom: spacing.md, alignItems: 'center', ...shadows.small,
  },
  itemImage: { width: 70, height: 70, borderRadius: radius.md, marginRight: spacing.md },
  itemInfo: { flex: 1 },
  itemName: { ...typography.bodyBold, marginBottom: spacing.xs },
  itemMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemQty: { ...typography.small },
  itemPrice: { ...typography.bodyBold },
  removeBtn: {
    width: 32, height: 32, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center', marginLeft: spacing.sm,
  },
  removeText: { fontSize: 16, fontWeight: '700' },
  summary: {
    position: 'absolute', bottom: 70, left: 0, right: 0,
    paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.md,
    borderTopWidth: 1,
  },
  totalRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: spacing.md,
  },
  totalLabel: { ...typography.h3 },
  totalBadge: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: radius.md },
  totalValue: { ...typography.h3, color: '#fff' },
  checkoutWrapper: { borderRadius: radius.full, overflow: 'hidden', ...shadows.medium },
  checkoutBtn: { paddingVertical: 16, alignItems: 'center', borderRadius: radius.full },
  checkoutText: { ...typography.bodyBold, color: '#fff', fontSize: 16 },
});

export default CartScreen;
