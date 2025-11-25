export function calculateWinner(squares, size) {
  const total = size * size;
  // rows
  for (let r = 0; r < size; r++) {
    const start = r * size;
    const first = squares[start];
    if (first) {
      let win = true;
      const line = [start];
      for (let c = 1; c < size; c++) {
        const idx = start + c;
        if (squares[idx] !== first) {
          win = false;
          break;
        }
        line.push(idx);
      }
      if (win) return { winner: first, line };
    }
  }

  // cols
  for (let c = 0; c < size; c++) {
    const first = squares[c];
    if (first) {
      let win = true;
      const line = [c];
      for (let r = 1; r < size; r++) {
        const idx = r * size + c;
        if (squares[idx] !== first) {
          win = false;
          break;
        }
        line.push(idx);
      }
      if (win) return { winner: first, line };
    }
  }

  // main diagonal
  const firstMain = squares[0];
  if (firstMain) {
    let win = true;
    const line = [0];
    for (let i = 1; i < size; i++) {
      const idx = i * size + i;
      if (squares[idx] !== firstMain) {
        win = false;
        break;
      }
      line.push(idx);
    }
    if (win) return { winner: firstMain, line };
  }

  // anti diagonal
  const firstAnti = squares[size - 1];
  if (firstAnti) {
    let win = true;
    const line = [size - 1];
    for (let i = 1; i < size; i++) {
      const idx = i * size + (size - 1 - i);
      if (squares[idx] !== firstAnti) {
        win = false;
        break;
      }
      line.push(idx);
    }
    if (win) return { winner: firstAnti, line };
  }

  return null;
}
