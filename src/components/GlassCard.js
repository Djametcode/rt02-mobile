// Reusable Glass Card component
import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, shadows } from '../styles/theme';

export const GlassCard = ({ 
  children, 
  style, 
  intensity = 40, 
  borderRadius = radius.lg,
  noBorder = false,
  glow = false,
}) => {
  return (
    <View style={[
      styles.wrapper, 
      { borderRadius }, 
      glow && shadows.glow,
      style
    ]}>
      <BlurView 
        intensity={intensity} 
        tint="dark" 
        style={[styles.blur, { borderRadius }]}
      >
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.04)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.gradient,
            { borderRadius },
            !noBorder && styles.border,
          ]}
        >
          {children}
        </LinearGradient>
      </BlurView>
    </View>
  );
};

export const GradientButton = ({ children, onPress, style, gradient = ['#6366f1', '#8b5cf6'], disabled = false }) => {
  const Touchable = require('react-native').TouchableOpacity;
  return (
    <Touchable 
      onPress={onPress} 
      disabled={disabled}
      activeOpacity={0.8}
      style={[styles.btnWrapper, disabled && { opacity: 0.5 }, style]}
    >
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientBtn}
      >
        {children}
      </LinearGradient>
    </Touchable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  blur: {
    overflow: 'hidden',
  },
  gradient: {
    overflow: 'hidden',
  },
  border: {
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  btnWrapper: {
    borderRadius: radius.full,
    overflow: 'hidden',
    ...shadows.glow,
  },
  gradientBtn: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
  },
});
