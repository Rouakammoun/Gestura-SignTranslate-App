import { TouchableOpacity, View, StyleSheet } from 'react-native';

type CheckboxProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  color?: string;
  size?: number;
};

export const Checkbox = ({
  value,
  onValueChange,
  color = '#6200ee',
  size = 20,
}: CheckboxProps) => {
  return (
    <TouchableOpacity onPress={() => onValueChange(!value)}>
      <View
        style={[
          styles.checkbox,
          {
            width: size,
            height: size,
            borderColor: color,
          },
        ]}
      >
        {value && (
          <View
            style={[
              styles.inner,
              {
                backgroundColor: color,
                width: size - 8,
                height: size - 8,
              },
            ]}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkbox: {
    borderWidth: 2,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inner: {
    borderRadius: 2,
  },
});