import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function Square({ value, onSquareClick, highlight, disabled }) {
  return (
    <TouchableOpacity
      style={[
        styles.square, 
        highlight && styles.highlight,
        disabled && styles.disabled,
      ]}
      onPress={onSquareClick}
      disabled={disabled}
    >
      <Text style={[
        styles.text,
        value === 'X' && styles.textX,
        value === 'O' && styles.textO,
      ]}>
        {value}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  square: {
    width: 80,
    height: 80,
    borderWidth: 2,
    borderColor: '#334155',
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 2,
    borderRadius: 8,
  },
  text: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  textX: {
    color: '#f59e0b',
  },
  textO: {
    color: '#10b981',
  },
  highlight: {
    backgroundColor: '#10b981',
    borderColor: '#059669',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },
  disabled: {
    opacity: 0.6,
  },
});
