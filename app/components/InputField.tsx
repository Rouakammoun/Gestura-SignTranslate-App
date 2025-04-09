import { TextInput, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { useTheme } from '../hooks/useTheme';

type InputFieldProps = {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoComplete?: 'email' | 'password' | 'name' | 'username' | 'new-password';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  minLength?: number;
  containerStyle?: ViewStyle;  // For the wrapper view
  inputStyle?: TextStyle;     // For the TextInput itself
};

export const InputField = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  containerStyle = {},
  inputStyle = {},
}: InputFieldProps) => {
  const { colors } = useTheme();

  return (
    <TextInput
      style={[
        styles.input,
        {
          backgroundColor: colors.inputBackground,
          color: colors.text,
          borderColor: colors.border,
        },
        inputStyle, // TextInput specific styles
      ]}
      placeholder={placeholder}
      placeholderTextColor={colors.placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
  } as TextStyle, // Explicitly type as TextStyle
});