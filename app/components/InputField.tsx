import { TextInput, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
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
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  rightIcon?: React.ReactNode; // 👈 added
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
  rightIcon,
}: InputFieldProps) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.wrapper, containerStyle]}>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.inputBackground,
            color: colors.text,
            borderColor: colors.border,
          },
          inputStyle,
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
      {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  } as ViewStyle,
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
  } as TextStyle,
  iconContainer: {
    position: 'absolute',
    right: 20,
    top: 13, // adjust based on icon size
  } as ViewStyle,
});
