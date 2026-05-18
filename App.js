import 'react-native-gesture-handler';
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Text, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { CartProvider, CartContext } from './src/context/CartContext';
import { ThemeProvider, ThemeContext } from './src/context/ThemeContext';
import HomeScreen from './src/screens/HomeScreen';
import ProductListScreen from './src/screens/ProductListScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import CartScreen from './src/screens/CartScreen';
import LoginScreen from './src/screens/LoginScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Icon component
const TabIcon = ({ focused, icon, label, theme }) => (
  <View style={styles.tabIconContainer}>
    {focused ? (
      <LinearGradient 
        colors={theme.gradients.primary}
        start={{x:0,y:0}} end={{x:1,y:0}}
        style={styles.tabIconActive}
      >
        <Text style={styles.tabIconText}>{icon}</Text>
      </LinearGradient>
    ) : (
      <Text style={[styles.tabIconText, { opacity: 0.5 }]}>{icon}</Text>
    )}
    <Text style={[
      styles.tabLabel,
      { color: focused ? theme.colors.primary : theme.colors.textMuted }
    ]}>{label}</Text>
  </View>
);

// Cart Icon with badge
const CartTabIcon = ({ focused, theme }) => {
  const { cartItems } = useContext(CartContext);
  const cartCount = cartItems?.filter(i => i && i.product).reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <View style={styles.tabIconContainer}>
      <View style={{ position: 'relative' }}>
        {focused ? (
          <LinearGradient 
            colors={theme.gradients.primary}
            start={{x:0,y:0}} end={{x:1,y:0}}
            style={styles.tabIconActive}
          >
            <Text style={styles.tabIconText}>🛒</Text>
          </LinearGradient>
        ) : (
          <Text style={[styles.tabIconText, { opacity: 0.5 }]}>🛒</Text>
        )}
        {cartCount > 0 && (
          <View style={[styles.badge, { backgroundColor: theme.colors.accent }]}>
            <Text style={styles.badgeText}>{cartCount > 9 ? '9+' : cartCount}</Text>
          </View>
        )}
      </View>
      <Text style={[
        styles.tabLabel,
        { color: focused ? theme.colors.primary : theme.colors.textMuted }
      ]}>Cart</Text>
    </View>
  );
};

// Bottom Tab Navigator
const TabNavigator = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
          height: 70,
          paddingTop: 8,
          paddingBottom: 8,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="🏠" label="Home" theme={theme} />,
        }}
      />
      <Tab.Screen 
        name="ProductListTab" 
        component={ProductListScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="🛍️" label="Shop" theme={theme} />,
        }}
      />
      <Tab.Screen 
        name="CartTab" 
        component={CartScreen}
        options={{
          tabBarIcon: ({ focused }) => <CartTabIcon focused={focused} theme={theme} />,
        }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="👤" label="Profile" theme={theme} />,
        }}
      />
    </Tab.Navigator>
  );
};

// Root Stack (TabNav + modal screens)
const RootStack = () => {
  const { isDark } = useContext(ThemeContext);

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs" component={TabNavigator} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        {/* Aliases for navigation.navigate calls from screens */}
        <Stack.Screen name="Home" component={TabNavigator} />
        <Stack.Screen name="ProductList" component={TabNavigator} />
        <Stack.Screen name="Cart" component={TabNavigator} />
        <Stack.Screen name="Profile" component={TabNavigator} />
      </Stack.Navigator>
    </>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
      </CartProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    paddingTop: 4,
  },
  tabIconActive: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  tabIconText: {
    fontSize: 22,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
});
