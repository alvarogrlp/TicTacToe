import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import API_URL from '../../config/api';
import Board from './Board.jsx';

export default function Game() {
  // Estados del dispositivo y conexión
  const [deviceId, setDeviceId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  
  // Estados de la partida
  const [matchId, setMatchId] = useState(null);
  const [board, setBoard] = useState([]);
  const [boardSize, setBoardSize] = useState(3);
  const [players, setPlayers] = useState(null);
  const [mySymbol, setMySymbol] = useState(null);
  const [currentTurn, setCurrentTurn] = useState(null);
  const [winner, setWinner] = useState(null);
  
  // Estados de UI
  const [isWaiting, setIsWaiting] = useState(false);
  const [sizeInput, setSizeInput] = useState('3');
  const [stats, setStats] = useState({ wins: 0, losses: 0, ratio: 0 });
  const [isLoading, setIsLoading] = useState(false);

  // Registrar dispositivo al iniciar
  useEffect(() => {
    registerDevice();
  }, []);

  // Polling para verificar estado de espera y sincronización
  useEffect(() => {
    if (!deviceId) return;

    const interval = setInterval(() => {
      if (isWaiting) {
        checkWaitingStatus();
      } else if (matchId) {
        syncMatch();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [deviceId, isWaiting, matchId]);

  // Cargar stats cuando haya deviceId
  useEffect(() => {
    if (deviceId) {
      loadStats();
    }
  }, [deviceId]);

  async function registerDevice() {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/devices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alias: 'Jugador' }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setDeviceId(data.device_id);
        setIsConnected(true);
      } else {
        Alert.alert('Error', 'No se pudo conectar al servidor');
      }
    } catch (error) {
      console.log('Error al registrar dispositivo:', error);
      Alert.alert('Error', 'No se pudo conectar al servidor. Verifica la IP en config/api.js');
    } finally {
      setIsLoading(false);
    }
  }

  async function loadStats() {
    if (!deviceId) return;
    try {
      const response = await fetch(`${API_URL}/devices/${deviceId}/info`);
      if (response.ok) {
        const data = await response.json();
        setStats({
          wins: data.wins,
          losses: data.losses,
          ratio: data.ratio,
        });
      }
    } catch (error) {
      console.log('Error al cargar stats:', error);
    }
  }

  async function createMatch() {
    const size = Number.parseInt(sizeInput, 10);
    if (Number.isNaN(size) || size < 3 || size > 7) {
      Alert.alert('Tamaño inválido', 'Ingrese un número entre 3 y 7');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/matches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ device_id: deviceId, size }),
      });

      const data = await response.json();

      if (response.status === 201) {
        // Partida creada inmediatamente
        setMatchId(data.match_id);
        setPlayers(data.players);
        setMySymbol(data.players[deviceId]);
        setBoardSize(data.board_size);
        setBoard(Array(data.board_size).fill(null).map(() => Array(data.board_size).fill('')));
        setIsWaiting(false);
        syncMatch(data.match_id);
      } else if (response.status === 202) {
        // Esperando oponente
        setIsWaiting(true);
        setBoardSize(size);
      }
    } catch (error) {
      console.log('Error al crear partida:', error);
      Alert.alert('Error', 'No se pudo crear la partida');
    } finally {
      setIsLoading(false);
    }
  }

  async function checkWaitingStatus() {
    if (!deviceId) return;
    try {
      const response = await fetch(`${API_URL}/matches/waiting-status?device_id=${deviceId}`);
      const data = await response.json();

      if (data.status === 'matched') {
        setMatchId(data.match_id);
        setPlayers(data.players);
        setMySymbol(data.players[deviceId]);
        setBoardSize(data.board_size);
        setIsWaiting(false);
        syncMatch(data.match_id);
      }
    } catch (error) {
      console.log('Error al verificar estado de espera:', error);
    }
  }

  async function syncMatch(mid = matchId) {
    if (!mid) return;
    try {
      const response = await fetch(`${API_URL}/matches/${mid}`);
      if (response.ok) {
        const data = await response.json();
        setBoard(data.board);
        setCurrentTurn(data.turn);
        setWinner(data.winner);
        setPlayers(data.players);
        setBoardSize(data.size);
        
        if (!mySymbol && data.players[deviceId]) {
          setMySymbol(data.players[deviceId]);
        }

        // Si hay ganador, recargar stats
        if (data.winner) {
          loadStats();
        }
      }
    } catch (error) {
      console.log('Error al sincronizar partida:', error);
    }
  }

  async function handlePlay(x, y) {
    if (!matchId || currentTurn !== deviceId || winner) return;

    try {
      const response = await fetch(`${API_URL}/matches/${matchId}/moves`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ device_id: deviceId, x, y }),
      });

      if (response.ok) {
        const data = await response.json();
        setBoard(data.board);
        setCurrentTurn(data.next_turn);
        setWinner(data.winner);
        
        if (data.winner) {
          loadStats();
        }
      } else {
        const error = await response.json();
        Alert.alert('Movimiento inválido', error.message || 'No puedes hacer ese movimiento');
      }
    } catch (error) {
      console.log('Error al hacer movimiento:', error);
    }
  }

  function resetGame() {
    setMatchId(null);
    setBoard([]);
    setPlayers(null);
    setMySymbol(null);
    setCurrentTurn(null);
    setWinner(null);
    setIsWaiting(false);
    loadStats();
  }

  // Renderizado condicional basado en estados
  if (isLoading && !isConnected) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Conectando al servidor...</Text>
      </View>
    );
  }

  if (!isConnected) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>❌ No conectado</Text>
        <TouchableOpacity style={styles.retryButton} onPress={registerDevice}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Pantalla de espera de oponente
  if (isWaiting) {
    return (
      <View style={styles.container}>
        <View style={styles.waitingCard}>
          <Text style={styles.waitingTitle}>⏳ Buscando oponente...</Text>
          <Text style={styles.waitingSubtitle}>Tablero {boardSize}x{boardSize}</Text>
          <ActivityIndicator size="large" color="#6366f1" style={{ marginTop: 20 }} />
          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={() => setIsWaiting(false)}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Lobby - sin partida activa
  if (!matchId) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>🎮 Tic Tac Toe</Text>
          <Text style={styles.subtitle}>Multijugador Online</Text>
        </View>

        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>📊 Tus Estadísticas</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.wins}</Text>
              <Text style={styles.statLabel}>Victorias</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.losses}</Text>
              <Text style={styles.statLabel}>Derrotas</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{(stats.ratio * 100).toFixed(0)}%</Text>
              <Text style={styles.statLabel}>Ratio</Text>
            </View>
          </View>
        </View>

        <View style={styles.createCard}>
          <Text style={styles.createTitle}>Nueva Partida</Text>
          <Text style={styles.label}>Tamaño del tablero (3-7):</Text>
          <View style={styles.sizeSelector}>
            {[3, 4, 5, 6, 7].map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.sizeButton,
                  sizeInput === size.toString() && styles.sizeButtonActive,
                ]}
                onPress={() => setSizeInput(size.toString())}
              >
                <Text
                  style={[
                    styles.sizeButtonText,
                    sizeInput === size.toString() && styles.sizeButtonTextActive,
                  ]}
                >
                  {size}x{size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.playButton}
            onPress={createMatch}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.playButtonText}>🎯 Buscar Partida</Text>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.deviceId}>ID: {deviceId?.substring(0, 8)}</Text>
      </ScrollView>
    );
  }

  // Partida activa
  const isMyTurn = currentTurn === deviceId;
  const opponentSymbol = mySymbol === 'X' ? 'O' : 'X';
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.gameHeader}>
        <View style={styles.playerIndicator}>
          <View style={[styles.symbolBadge, mySymbol === 'X' && styles.symbolBadgeX]}>
            <Text style={styles.symbolText}>{mySymbol}</Text>
          </View>
          <Text style={styles.playerLabel}>Tú</Text>
        </View>
        
        <Text style={styles.vsText}>VS</Text>
        
        <View style={styles.playerIndicator}>
          <View style={[styles.symbolBadge, opponentSymbol === 'X' && styles.symbolBadgeX]}>
            <Text style={styles.symbolText}>{opponentSymbol}</Text>
          </View>
          <Text style={styles.playerLabel}>Oponente</Text>
        </View>
      </View>

      {winner ? (
        <View style={styles.statusCard}>
          <Text style={styles.statusEmoji}>
            {winner === 'Draw' ? '🤝' : winner === mySymbol ? '🎉' : '😔'}
          </Text>
          <Text style={styles.statusText}>
            {winner === 'Draw' 
              ? '¡Empate!' 
              : winner === mySymbol 
              ? '¡Ganaste!' 
              : '¡Perdiste!'}
          </Text>
        </View>
      ) : (
        <View style={[styles.statusCard, isMyTurn && styles.statusCardActive]}>
          <Text style={styles.statusText}>
            {isMyTurn ? '🎯 Tu turno' : '⏳ Turno del oponente'}
          </Text>
        </View>
      )}

      <Board
        size={boardSize}
        squares={board.flat()}
        onPlay={handlePlay}
        isMyTurn={isMyTurn}
        disabled={!!winner}
      />

      {winner && (
        <TouchableOpacity style={styles.newGameButton} onPress={resetGame}>
          <Text style={styles.newGameButtonText}>🔄 Nueva Partida</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.leaveButton} onPress={resetGame}>
        <Text style={styles.leaveButtonText}>Salir de la partida</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#94a3b8',
  },
  statsCard: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6366f1',
  },
  statLabel: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#334155',
  },
  createCard: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  createTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: '#cbd5e1',
    marginBottom: 12,
  },
  sizeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  sizeButton: {
    backgroundColor: '#334155',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    minWidth: 60,
    alignItems: 'center',
  },
  sizeButtonActive: {
    backgroundColor: '#6366f1',
  },
  sizeButtonText: {
    color: '#94a3b8',
    fontSize: 16,
    fontWeight: '600',
  },
  sizeButtonTextActive: {
    color: '#fff',
  },
  playButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  playButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  deviceId: {
    color: '#475569',
    fontSize: 12,
    marginTop: 20,
  },
  waitingCard: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    width: '90%',
  },
  waitingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  waitingSubtitle: {
    fontSize: 18,
    color: '#94a3b8',
  },
  cancelButton: {
    marginTop: 30,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#ef4444',
    borderRadius: 12,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  playerIndicator: {
    alignItems: 'center',
  },
  symbolBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  symbolBadgeX: {
    backgroundColor: '#f59e0b',
  },
  symbolText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  playerLabel: {
    fontSize: 14,
    color: '#94a3b8',
  },
  vsText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#475569',
  },
  statusCard: {
    backgroundColor: '#1e293b',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#334155',
  },
  statusCardActive: {
    borderColor: '#6366f1',
    backgroundColor: '#312e81',
  },
  statusEmoji: {
    fontSize: 40,
    textAlign: 'center',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  newGameButton: {
    backgroundColor: '#10b981',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    marginTop: 24,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  newGameButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  leaveButton: {
    marginTop: 16,
    paddingVertical: 12,
  },
  leaveButtonText: {
    color: '#94a3b8',
    fontSize: 14,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#94a3b8',
  },
  errorText: {
    fontSize: 20,
    color: '#ef4444',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
