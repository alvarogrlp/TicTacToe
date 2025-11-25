# Servidor Flask para Tic Tac Toe Multijugador

Este servidor implementa la API REST para el juego de Tic Tac Toe multijugador con Python y Flask.

## 🚀 Instalación

### 1. Instalar Python

Asegúrate de tener Python 3.7+ instalado.

### 2. Instalar dependencias

```powershell
cd server
pip install flask flask-restx flask-cors
```

O usando el archivo requirements.txt:

```powershell
pip install -r requirements.txt
```

## ▶️ Ejecutar el servidor

```powershell
python server.py
```

El servidor se ejecutará en `http://0.0.0.0:5000` y mostrará:

```
🎮 Servidor Tic Tac Toe API
📡 Ejecutándose en http://0.0.0.0:5000

💡 Obtén tu IP con: ipconfig
   Actualiza config/api.js con tu IP
```

## 🌐 Obtener tu IP

En PowerShell ejecuta:

```powershell
ipconfig
```

Busca tu `IPv4 Address` (ejemplo: `192.168.1.16`) y actualiza `config/api.js`:

```javascript
const API_URL = 'http://192.168.1.16:5000';
```

## 📋 Endpoints Principales

### Dispositivos
- `POST /devices` - Registra un nuevo dispositivo/jugador
- `GET /devices` - Lista dispositivos conectados  
- `GET /devices/<device_id>/info` - Obtiene estadísticas del dispositivo

### Partidas
- `POST /matches` - Crea/busca una partida
- `GET /matches/waiting-status?device_id=<id>` - Verifica si se encontró oponente
- `POST /matches/<match_id>/moves` - Realiza un movimiento
- `GET /matches/<match_id>` - Obtiene estado actual de la partida

## 🎮 Cómo funciona

1. **Registro**: Al abrir la app, cada dispositivo se registra automáticamente
2. **Búsqueda**: Cuando un jugador crea una partida, el servidor busca otro jugador esperando con el mismo tamaño de tablero
3. **Emparejamiento**: Si encuentra oponente, crea la partida; si no, deja al jugador en espera
4. **Turnos**: Los jugadores alternan turnos. El servidor valida cada movimiento
5. **Ganador**: Al detectar un ganador o empate, actualiza las estadísticas

## 📝 Características

- ✅ Multijugador en tiempo real (polling cada 2 segundos)
- ✅ Soporte para tableros de 3x3 a 7x7
- ✅ Sistema de turnos con validación
- ✅ Detección automática de ganador y empates
- ✅ Estadísticas persistentes por dispositivo
- ✅ Limpieza automática de dispositivos inactivos (5 minutos)
- ✅ Documentación Swagger en `/` (cuando ejecutas el servidor)

## 🔧 Desarrollo

Para ver la documentación interactiva Swagger, abre tu navegador en:

```
http://localhost:5000/
```

## ⚠️ Notas

- Los datos se almacenan en memoria (se pierden al reiniciar)
- Los dispositivos inactivos por más de 5 minutos se eliminan
- El servidor usa CORS para permitir conexiones desde la app móvil
- Para producción, considera usar una base de datos real y websockets
