import { View, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export const Divider = () => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.divider,
        {
          backgroundColor: colors.border,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  divider: {
    height: 1,
    marginVertical: 20,
    width: '100%',
  },
});