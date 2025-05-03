import { TouchableOpacity, Text, StyleSheet, TextStyle, ViewStyle, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { ReactNode } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { TranslationKey }from '../types/types';

type ButtonProps = {
  title?: string; // Optional fallback if translationKey not provided
  translationKey?: TranslationKey; // Use TranslationKey instead of string
  onPress?: () => void; 
  disabled?: boolean;
  type?: 'primary' | 'secondary' | 'text';
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right'; // New prop for RTL-aware icon positioning
};

export const Button = ({
  title,
  translationKey,
  onPress = () => {},
  disabled = false,
  type = 'primary',
  style = {},
  textStyle = {},
  icon,
  iconPosition = 'left', // Default to left
}: ButtonProps) => {
  const { colors } = useTheme();
  const { t, isRTL } = useLanguage();

  // Enhanced text handling with fallbacks
  const buttonText = translationKey ? t(translationKey) : title || '';

  // RTL-aware icon position
  const resolvedIconPosition = isRTL ? 
    (iconPosition === 'left' ? 'right' : 'left') : 
    iconPosition;

  const getButtonStyle = (): ViewStyle => {
    const baseStyle = {
      backgroundColor: 'transparent',
      borderWidth: 0,
    };

    switch (type) {
      case 'secondary':
        return {
          ...baseStyle,
          borderColor: colors.primary,
          borderWidth: 1,
        };
      case 'text':
        return baseStyle;
      default: // primary
        return {
          backgroundColor: disabled ? colors.disabled : colors.primary,
        };
    }
  };

  const getTextStyle = (): TextStyle => {
    return {
      color: type === 'text' || type === 'secondary' ? 
        colors.primary : 
        colors.buttonText,
      textAlign: 'center',
      writingDirection: isRTL ? 'rtl' : 'ltr',
    };
  };

  return (
    <TouchableOpacity
      style={[
        styles.button, 
        getButtonStyle(), 
        style,
        icon ? { flexDirection: resolvedIconPosition === 'left' ? 'row' : 'row-reverse' } : {}
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      accessibilityLabel={buttonText}
    >
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text 
        style={[styles.text, getTextStyle(), textStyle]} 
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.8}
      >
        {buttonText}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    minHeight: 50,
    minWidth: 250,
    maxWidth: '100%',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    flexDirection: 'row',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    flexShrink: 1,
  },
  iconContainer: {
    marginHorizontal: 8,
  },
});