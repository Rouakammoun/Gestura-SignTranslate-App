import { TouchableOpacity, Text, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { ReactNode } from 'react';

type ButtonProps = {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  type?: 'primary' | 'secondary' | 'text';
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: ReactNode;
  
};

export const Button = ({
  title,
  onPress = () => {},
  disabled = false,
  type = 'primary',
  style = {},
  textStyle = {},
  icon,
}: ButtonProps) => {
  const { colors } = useTheme();

  const getButtonStyle = () => {
    switch (type) {
      case 'secondary':
        return {
          backgroundColor: 'transparent',
          borderColor: colors.primary,
          borderWidth: 1,
        };
      case 'text':
        return {
          backgroundColor: 'transparent',
          borderWidth: 0,
        };
      default:
        return {
          backgroundColor: disabled ? colors.disabled : colors.primary,
        };
    }
  };

  const getTextStyle = () => {
    switch (type) {
      case 'text':
        return { color: colors.primary };
      default:
        return { color: type === 'secondary' ? colors.primary : colors.buttonText };
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      
      <Text style={[styles.text, getTextStyle(), textStyle]} numberOfLines={1}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '80%',
    minWidth: 250,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    
  },
});
