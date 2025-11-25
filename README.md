# 🎮 Tic Tac Toe Multijugador

Juego de Tres en Línea (Tic Tac Toe) **multijugador online** con React Native y Expo, conectado a un servidor Flask.

## ✨ Características

- 🌐 **Multijugador en tiempo real** - Juega contra otros jugadores en la misma red
- 📏 **Tableros configurables** - Desde 3x3 hasta 7x7
- 🎯 **Sistema de turnos** - Validación del servidor, solo juegas en tu turno
- ✅ **Detección automática de ganador** - Líneas completas (horizontal, vertical, diagonal)
- 💚 **Resalte de línea ganadora** - Efecto visual verde brillante
- 📊 **Estadísticas persistentes** - Victorias, derrotas y ratio por dispositivo
- 🎨 **Diseño moderno** - Tema oscuro con colores vibrantes
- 🔄 **Sincronización automática** - El tablero se actualiza cada 2 segundos

## 🚀 Inicio Rápido

### 1. Instalar dependencias del proyecto

```powershell
npm install
```

### 2. Configurar y ejecutar el servidor

```powershell
cd server
pip install -r requirements.txt
python server.py
```

### 3. Obtener tu IP local

```powershell
ipconfig
```

Busca tu `IPv4 Address` (ej: `192.168.1.2`)

### 4. Actualizar configuración de API

Edita `config/api.js`:

```javascript
const API_URL = 'http://TU_IP_AQUI:5000';
```

### 5. Ejecutar la aplicación

```powershell
npx expo start
```

## 📱 Cómo Jugar

1. **Abre la app** en dos dispositivos/emuladores
2. **Selecciona el tamaño del tablero** (ambos deben elegir el mismo)
3. **Presiona "Buscar Partida"**
4. El primer jugador quedará en espera, el segundo iniciará la partida
5. **Juega por turnos** - La app te indicará cuándo es tu turno
6. Al finalizar, las estadísticas se actualizan automáticamente

## 🏗️ Estructura del Proyecto

```
TicTacToe/
├── app/                      # Pantallas de navegación (Expo Router)
├── components/
│   └── tic-tac-toe/
│       ├── Game.jsx          # Componente principal (lobby + partida)
│       ├── Board.jsx         # Tablero NxN dinámico
│       ├── Square.jsx        # Casilla individual con estilos
│       └── winner.js         # Lógica de detección de ganador
├── config/
│   └── api.js                # Configuración de URL del servidor
├── server/
│   ├── server.py             # Servidor Flask (API REST)
│   ├── requirements.txt      # Dependencias Python
│   └── README.md             # Documentación del servidor
├── API_SETUP.md              # Guía completa de configuración
└── package.json              # Dependencias Node.js
```

## 🎨 Capturas (Funcionalidad)

### Lobby
- Estadísticas personales (victorias, derrotas, ratio)
- Selector de tamaño de tablero visual (3-7)
- Botón "Buscar Partida"

### Esperando Oponente
- Indicador de carga animado
- Muestra el tamaño seleccionado
- Botón para cancelar la búsqueda

### Partida Activa
- Badges circulares con los símbolos (X naranja, O verde)
- Indicador de turno actual
- Tablero con casillas interactivas
- Línea ganadora resaltada en verde
- Mensaje de victoria/derrota/empate

## 🛠️ Tecnologías

### Frontend (App)
- **React Native** + **Expo** - Framework de desarrollo móvil
- **JavaScript (JSX)** - Lenguaje de programación
- **StyleSheet API** - Estilos nativos

### Backend (Servidor)
- **Python 3.7+** - Lenguaje del servidor
- **Flask** - Framework web minimalista
- **Flask-RESTX** - Documentación Swagger automática
- **Flask-CORS** - Manejo de CORS para permitir conexiones móviles

## 📋 Requisitos de la Entrega

✅ **Tablero configurable** (3x3 a 7x7) - Implementado con selector visual  
✅ **Resalte de línea ganadora** - Verde brillante con efecto de sombra  
✅ **Botón reiniciar** - Al finalizar la partida, vuelve al lobby  
✅ **Reinicio en mitad de partida** - Botón "Salir de la partida"  
✅ **Contador de victorias** - Estadísticas globales por dispositivo  
✅ **Reiniciar estadísticas** - Se resetea al desconectar/reconectar  
✅ **Código organizado** - Componentes funcionales con props  
✅ **Comunicación padre-hijo** - Game → Board → Square  
✅ **Estado bien gestionado** - Estado centralizado en Game.jsx  

### Funcionalidad Extra (Multijugador)
✅ **Juego online** - Dos jugadores reales por partida  
✅ **Emparejamiento automático** - Por tamaño de tablero  
✅ **Sistema de turnos** - Validación en servidor  
✅ **Sincronización en tiempo real** - Polling cada 2 segundos  
✅ **Detección de inactividad** - Limpieza automática (5 min)  

## 📖 Documentación Adicional

- **[API_SETUP.md](./API_SETUP.md)** - Guía completa de configuración
- **[server/README.md](./server/README.md)** - Documentación del servidor Flask

## 🔧 Desarrollo

### Scripts disponibles

```powershell
# Instalar dependencias
npm install

# Iniciar app en desarrollo
npx expo start

# Limpiar caché de Expo
npx expo start -c

# Iniciar servidor Flask
cd server
python server.py
```

### Ver documentación Swagger

Cuando el servidor esté ejecutándose, visita:

```
http://localhost:5000/
```

## ⚠️ Notas

- **Red local necesaria**: Ambos dispositivos deben estar en la misma Wi-Fi
- **Sin persistencia**: Los datos se pierden al reiniciar el servidor
- **Timeout**: Dispositivos inactivos por 5+ minutos se desconectan
- **Para producción**: Considera WebSockets y base de datos real

## 🎯 Mejoras Futuras

- WebSockets para actualizaciones instantáneas (sin polling)
- Base de datos para persistencia permanente
- Sistema de cuentas y autenticación
- Tabla de clasificación global
- Chat entre jugadores
- Notificaciones push
- Animaciones de transición
- Modo offline vs IA

## 👨‍💻 Autor

Desarrollado como proyecto de DAM 2º - Entrega 2

## 📄 Licencia

Proyecto educativo - Libre uso para aprendizaje

