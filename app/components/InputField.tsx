// import React from 'react';
// import { 
//   TextInput, 
//   View, 
//   StyleSheet, 
//   Text, 
//   TextStyle, 
//   ViewStyle,
// } from 'react-native';
// import { useTheme } from '../hooks/useTheme';
// import { useLanguage } from '../contexts/LanguageContext';

// // Define a type for your translation keys
// import { TranslationKey  }from '../types/types';

// type InputFieldProps = {
//   label?: string;
//   labelTranslationKey?: TranslationKey;
//   placeholder?: string;
//   placeholderTranslationKey?: TranslationKey;
//   value: string;
//   onChangeText: (text: string) => void;
//   secureTextEntry?: boolean;
//   keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
//   autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
//   containerStyle?: ViewStyle;
//   inputStyle?: TextStyle;
//   textAlign?: 'left' | 'right' | 'center';
//   errorMessage?: string;
//   errorTranslationKey?: TranslationKey;
//   writingDirection?: 'ltr' | 'rtl';
//   fontSize?: number;
//   placeholderFontSize?: number; // Add this line
//   inputHeight?: number;
// };

// const InputField = ({
//   label,
//   labelTranslationKey,
//   placeholder,
//   placeholderTranslationKey,
//   value,
//   onChangeText,
//   secureTextEntry = false,
//   keyboardType = 'default',
//   autoCapitalize = 'none',
//   containerStyle = {},
//   inputStyle = {},
//   textAlign,
//   errorMessage,
//   errorTranslationKey,
//   fontSize = 14,
//   inputHeight = 56,
// }: InputFieldProps) => {
//   const { colors } = useTheme();
//   const { t, isRTL } = useLanguage();

//   // Properly typed dynamic styles
//   const dynamicStyles: {
//     textAlignment: TextStyle;
//     layoutDirection: ViewStyle;
//   } = {
//     textAlignment: {
//       textAlign: textAlign || (isRTL ? 'right' : 'left'),
//       writingDirection: isRTL ? 'rtl' : 'ltr',
//     },
//     layoutDirection: {
//       flexDirection: isRTL ? 'row-reverse' : 'row',
//     }
//   };

//   // Resolve translations with fallbacks
//   const resolvedLabel = labelTranslationKey ? t(labelTranslationKey) : label;
//   const resolvedPlaceholder = placeholderTranslationKey ? 
//     t(placeholderTranslationKey) : 
//     placeholder;
//   const resolvedErrorMessage = errorTranslationKey ? 
//     t(errorTranslationKey) : 
//     errorMessage;

//   return (
//     <View style={[styles.container, containerStyle]}>
//       {resolvedLabel && (
//         <Text style={[
//           styles.label, 
//           { 
//             color: colors.text,
//             fontSize: fontSize,
//             ...dynamicStyles.textAlignment,
//           }
//         ]}>
//           {resolvedLabel}
//         </Text>
//       )}
      
//       <TextInput
//         style={[
//           styles.input,
//           {
//             backgroundColor: colors.inputBackground,
//             color: colors.text,
//             borderColor: errorMessage ? colors.error : colors.border,
//             height: inputHeight,
//             fontSize: fontSize,
//             ...dynamicStyles.textAlignment,
//           },
//           inputStyle,
//         ]}
//         placeholder={resolvedPlaceholder}
//         placeholderTextColor={colors.placeholder}
//         value={value}
//         onChangeText={onChangeText}
//         secureTextEntry={secureTextEntry}
//         keyboardType={keyboardType}
//         autoCapitalize={autoCapitalize}
//         textAlignVertical="center"
//         allowFontScaling={false}
//       />

//       {resolvedErrorMessage && (
//         <Text style={[
//           styles.errorText,
//           { 
//             color: colors.error,
//             fontSize: fontSize - 2,
//             ...dynamicStyles.textAlignment,
//           }
//         ]}>
//           {resolvedErrorMessage}
//         </Text>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     marginBottom: 24,
//     width: '100%',
//   },
//   label: {
//     fontWeight: '500',
//     marginBottom: 12,
//   },
//   input: {
//     borderWidth: 1,
//     borderRadius: 12,
//     paddingHorizontal: 18,
//     paddingVertical: 4,
//   },
//   errorText: {
//     marginTop: 8,
//   },
// });

// export default InputField;

import React from 'react';
import { 
  TextInput, 
  View, 
  StyleSheet, 
  Text, 
  TextStyle, 
  ViewStyle,
  StyleProp,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../contexts/LanguageContext';
import { TranslationKey } from '../types/types';

type InputFieldProps = {
  label?: string;
  labelTranslationKey?: TranslationKey;
  placeholder?: string;
  placeholderTranslationKey?: TranslationKey;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  textAlign?: 'left' | 'right' | 'center';
  errorMessage?: string;
  errorTranslationKey?: TranslationKey;
  writingDirection?: 'ltr' | 'rtl';
  fontSize?: number;
  placeholderSize?: number;
  inputHeight?: number;
  fullWidth?: boolean;
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
  containerStyle,
  inputStyle,
  textAlign,
  errorMessage,
  errorTranslationKey,
  fontSize = 16,
  placeholderSize = 16,
  inputHeight = 56,
  fullWidth = true,
}: InputFieldProps) => {
  const { colors } = useTheme();
  const { t, isRTL } = useLanguage();

  const dynamicStyles: {
    textAlignment: TextStyle;
    layoutDirection: ViewStyle;
  } = {
    textAlignment: {
      textAlign: textAlign || (isRTL ? 'right' : 'left'),
      writingDirection: isRTL ? 'rtl' : 'ltr',
    },
    layoutDirection: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
    }
  };

  const resolvedLabel = labelTranslationKey ? t(labelTranslationKey) : label;
  const resolvedPlaceholder = placeholderTranslationKey ? 
    t(placeholderTranslationKey) : 
    placeholder;
  const resolvedErrorMessage = errorTranslationKey ? 
    t(errorTranslationKey) : 
    errorMessage;

  return (
    <View style={[styles.container, containerStyle]}>
      {resolvedLabel && (
        <Text style={[
          styles.label, 
          { 
            color: colors.text,
            fontSize: fontSize,
            ...dynamicStyles.textAlignment,
          }
        ]}>
          {resolvedLabel}
        </Text>
      )}
      
      <View style={[
        styles.inputWrapper,
        { 
          borderColor: errorMessage ? colors.error : colors.border,
          height: inputHeight,
        },
        fullWidth && styles.fullWidth,
      ]}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.inputBackground,
              color: colors.text,
              fontSize: placeholderSize,
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
          allowFontScaling={false}
        />
      </View>

      {resolvedErrorMessage && (
        <Text style={[
          styles.errorText,
          { 
            color: colors.error,
            fontSize: fontSize - 2,
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
    marginBottom: 24,
    width: '100%',
  },
  inputWrapper: {
    borderWidth: 1,
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  fullWidth: {
    width: '100%',
  },
  label: {
    fontWeight: '500',
    marginBottom: 12,
    fontSize: 16,
  },
  input: {
    paddingVertical: 12,
    includeFontPadding: false,
    fontSize: 16,
  },
  errorText: {
    marginTop: 8,
    fontSize: 14,
  },
});

export default InputField;