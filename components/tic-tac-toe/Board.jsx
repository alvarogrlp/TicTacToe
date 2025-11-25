import { StyleSheet, View } from 'react-native';
import Square from './Square.jsx';
import { calculateWinner } from './winner';

export default function Board({ size = 3, squares, onPlay, isMyTurn = true, disabled = false }) {
  function handleClick(i) {
    if (disabled || !isMyTurn) return;
    
    const x = Math.floor(i / size);
    const y = i % size;
    
    // Verificar si la casilla ya está ocupada
    if (squares[i] && squares[i] !== '') return;
    
    onPlay(x, y);
  }

  const result = calculateWinner(squares, size);

  const rows = [];
  for (let r = 0; r < size; r++) {
    const cols = [];
    for (let c = 0; c < size; c++) {
      const idx = r * size + c;
      const highlight = result ? result.line.includes(idx) : false;
      const value = squares[idx] || '';
      cols.push(
        <Square 
          key={idx} 
          value={value} 
          highlight={highlight} 
          onSquareClick={() => handleClick(idx)}
          disabled={disabled || !isMyTurn}
        />
      );
    }
    rows.push(
      <View key={r} style={styles.boardRow}>
        {cols}
      </View>
    );
  }

  return (
    <View style={styles.board}>
      {rows}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  boardRow: {
    flexDirection: 'row',
  },
});
