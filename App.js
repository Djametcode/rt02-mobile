import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity, Text, View } from 'react-native';

import { CartProvider, CartContext } from './src/context/CartContext';
import HomeScreen from './src/screens/HomeScreen';
import ProductListScreen from './src/screens/ProductListScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import CartScreen from './src/screens/CartScreen';
import LoginScreen from './src/screens/LoginScreen';
import { colors } from './src/styles/theme';

const Stack = createNativeStackNavigator();

const HeaderRight = ({ navigation }) => {
  const { cartItems, user, logout } = React.useContext(CartContext);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <TouchableOpacity 
        onPress={() => navigation.navigate('Cart')}
        style={{ flexDirection: 'row', alignItems: 'center' }}
      >
        <Text style={{ fontSize: 20 }}>🛒</Text>
        {cartCount > 0 && (
          <View style={{
            backgroundColor: colors.accent,
            borderRadius: 10,
            minWidth: 20,
            height: 20,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 4,
            marginLeft: 4,
          }}>
            <Text style={{ color: colors.white, fontSize: 11, fontWeight: '700' }}>
              {cartCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>
      {user ? (
        <TouchableOpacity onPress={logout}>
          <Text style={{ color: colors.error, fontWeight: '600' }}>Keluar</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={{ color: colors.primary, fontWeight: '600' }}>Masuk</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default function App() {
  return (
    <CartProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={({ navigation }) => ({
            headerStyle: {
              backgroundColor: colors.cardBg,
            },
            headerTitleStyle: {
              fontWeight: '700',
              color: colors.textMain,
            },
            headerTintColor: colors.primary,
            headerRight: () => <HeaderRight navigation={navigation} />,
          })}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ title: 'rt02 Marketplace' }}
          />
          <Stack.Screen 
            name="ProductList" 
            component={ProductListScreen} 
            options={{ title: 'Katalog Produk' }}
          />
          <Stack.Screen 
            name="ProductDetail" 
            component={ProductDetailScreen} 
            options={{ title: 'Detail Produk' }}
          />
          <Stack.Screen 
            name="Cart" 
            component={CartScreen} 
            options={{ title: 'Keranjang' }}
          />
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ title: 'Masuk / Daftar' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}
