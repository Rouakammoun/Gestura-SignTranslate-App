import { TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

type ThemedTextInputProps = {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
};

export const ThemedTextInput = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
}: ThemedTextInputProps) => {
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
      ]}
      placeholder={placeholder}
      placeholderTextColor={colors.placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
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
  },
});