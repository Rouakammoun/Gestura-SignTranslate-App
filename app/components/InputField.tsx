import React from 'react';
import { 
  TextInput, 
  View, 
  StyleSheet, 
  Text, 
  TextStyle, 
  ViewStyle,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../contexts/LanguageContext';

type InputFieldProps = {
  label?: string;
  labelTranslationKey?: string;
  placeholder?: string;
  placeholderTranslationKey?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  textAlign?: 'left' | 'right' | 'center';
  errorMessage?: string;
  errorTranslationKey?: string;
};

const InputField = ({
  label,
  labelTranslationKey,
  placeholder,
  placeholderTranslationKey,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  containerStyle = {},
  inputStyle = {},
  textAlign,
  errorMessage,
  errorTranslationKey,
}: InputFieldProps) => {
  const { colors } = useTheme();
  const { t, isRTL } = useLanguage();

  // Resolve translations with fallbacks
  const resolvedLabel = labelTranslationKey ? t(labelTranslationKey) : label;
  const resolvedPlaceholder = placeholderTranslationKey ? 
    t(placeholderTranslationKey) : 
    placeholder;
  const resolvedErrorMessage = errorTranslationKey ? 
    t(errorTranslationKey) : 
    errorMessage;

  // RTL-aware styles
  const dynamicStyles = {
    textAlignment: {
      textAlign: textAlign || (isRTL ? 'right' : 'left'),
      writingDirection: isRTL ? 'rtl' : 'ltr',
    },
    layoutDirection: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {resolvedLabel && (
        <Text style={[
          styles.label, 
          { 
            color: colors.text,
            ...dynamicStyles.textAlignment,
          }
        ]}>
          {resolvedLabel}
        </Text>
      )}
      
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.inputBackground,
            color: colors.text,
            borderColor: errorMessage ? colors.error : colors.border,
            ...dynamicStyles.textAlignment,
          },
          inputStyle,
        ]}
        placeholder={resolvedPlaceholder}
        placeholderTextColor={colors.placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        textAlignVertical="center"
      />

      {resolvedErrorMessage && (
        <Text style={[
          styles.errorText,
          { 
            color: colors.error,
            ...dynamicStyles.textAlignment,
          }
        ]}>
          {resolvedErrorMessage}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  errorText: {
    fontSize: 14,
    marginTop: 5,
  },
});

export default InputField;