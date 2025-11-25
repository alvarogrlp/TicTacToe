# Servidor Flask para Tic Tac Toe Multijugador

Este servidor implementa la API REST para el juego de Tic Tac Toe multijugador.

## 🚀 Instalación

```bash
pip install flask flask-restx flask-cors
```

## ▶️ Ejecutar el servidor

```bash
python server.py
```

El servidor se ejecutará en `http://0.0.0.0:5000`

## 📋 Endpoints

- `POST /devices` - Registra un nuevo dispositivo
- `GET /devices` - Lista dispositivos conectados  
- `GET /devices/<device_id>/info` - Obtiene stats del dispositivo
- `POST /matches` - Crea/busca una partida
- `GET /matches/waiting-status` - Verifica si se encontró oponente
- `POST /matches/<match_id>/moves` - Realiza un movimiento
- `GET /matches/<match_id>` - Obtiene estado de la partida

## 📝 Notas

- Los dispositivos inactivos por más de 5 minutos se eliminan automáticamente
- Las partidas se almacenan en memoria
- Soporta tableros de 3x3 a 7x7
