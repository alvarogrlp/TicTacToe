# Configuración de la API para Tic Tac Toe Multijugador

## 📝 Descripción

La aplicación ahora es un juego **multijugador online** que se conecta a una API REST (Flask) para:
- Registrar dispositivos/jugadores
- Emparejar jugadores que buscan partidas del mismo tamaño
- Sincronizar el tablero y turnos en tiempo real
- Validar movimientos y detectar ganadores
- Mantener estadísticas de victorias y derrotas por dispositivo

## 🔧 Configuración

### 1. Instalar Python y dependencias

Necesitas Python 3.7 o superior. Luego instala las dependencias:

```powershell
cd server
pip install -r requirements.txt
```

### 2. Obtener tu dirección IP local

En PowerShell, ejecuta:
```powershell
ipconfig
```

Busca la línea `IPv4 Address` de tu adaptador de red activo (Wi-Fi o Ethernet). Por ejemplo:
```
IPv4 Address. . . . . . . . . . . : 192.168.1.16
```

### 3. Actualizar la configuración de la API

Edita el archivo `config/api.js` y reemplaza la IP con la tuya:

```javascript
// Reemplaza con tu IP local
const API_URL = 'http://192.168.1.16:5000';

export default API_URL;
```

### 4. Iniciar el servidor Flask

En la carpeta `server`:

```powershell
python server.py
```

Verás:
```
🎮 Servidor Tic Tac Toe API
📡 Ejecutándose en http://0.0.0.0:5000

💡 Obtén tu IP con: ipconfig
   Actualiza config/api.js con tu IP
```

### 5. Iniciar la aplicación React Native

En la carpeta raíz del proyecto:

```powershell
npx expo start
```

## 🎮 Cómo Jugar

### Pantalla Principal (Lobby)
- Verás tus **estadísticas globales**: victorias, derrotas y ratio
- Selecciona el **tamaño del tablero** (3x3 hasta 7x7)
- Presiona **"🎯 Buscar Partida"**

### Esperando Oponente
- La app buscará otro jugador que quiera jugar con el mismo tamaño de tablero
- Si no hay nadie disponible, te quedas en **"⏳ Buscando oponente..."**
- Cuando otro jugador se una, la partida comenzará automáticamente

### Durante la Partida
- **Indicadores visuales**:
  - Badges de colores muestran tu símbolo (X u O)
  - **"🎯 Tu turno"** aparece cuando puedes jugar
  - **"⏳ Turno del oponente"** cuando debes esperar
- Solo puedes hacer clic en casillas vacías durante tu turno
- El tablero se sincroniza automáticamente cada 2 segundos
- La **línea ganadora se resalta en verde** con efecto de brillo

### Final de la Partida
- **🎉 ¡Ganaste!** / **😔 ¡Perdiste!** / **🤝 ¡Empate!**
- Las estadísticas se actualizan automáticamente
- Presiona **"🔄 Nueva Partida"** para volver al lobby
- O presiona **"Salir de la partida"** para abandonar

## 🚀 Endpoints del Servidor

El servidor Flask proporciona estos endpoints:

### Dispositivos
- `POST /devices` - Registra un nuevo dispositivo (automático al abrir la app)
- `GET /devices/<device_id>/info` - Obtiene estadísticas (victorias, derrotas, ratio)

### Partidas
- `POST /matches` - Crea/busca una partida
  - Si hay alguien esperando con el mismo tamaño → crea partida (201)
  - Si no hay nadie → te pone en espera (202)
- `GET /matches/waiting-status?device_id=<id>` - Verifica si ya te emparejaron
- `POST /matches/<match_id>/moves` - Realiza un movimiento (x, y)
- `GET /matches/<match_id>` - Sincroniza el estado actual del tablero

## 🎨 Diseño Mejorado

La app ahora tiene un diseño moderno con:
- **Tema oscuro** (#0f172a fondo, tarjetas #1e293b)
- **Colores vibrantes**: violeta (#6366f1) para botones, naranja (#f59e0b) para X, verde (#10b981) para O
- **Badges circulares** para los símbolos de jugadores
- **Efectos de sombra y brillo** en botones y línea ganadora
- **Animaciones sutiles** con ActivityIndicator
- **Selector visual de tamaño** con botones en lugar de input numérico

## 📱 Características Implementadas

✅ **Multijugador en tiempo real** (polling cada 2 segundos)  
✅ **Sistema de turnos** con validación del servidor  
✅ **Emparejamiento automático** por tamaño de tablero  
✅ **Detección de ganador** (líneas completas)  
✅ **Resalte de línea ganadora** en verde con sombra  
✅ **Estadísticas globales** por dispositivo  
✅ **Limpieza automática** de dispositivos inactivos (5 min)  
✅ **Soporte tableros 3x3 a 7x7**  
✅ **Diseño responsive** y moderno  

## ⚠️ Solución de Problemas

### Error al conectar
- Verifica que el servidor Python esté ejecutándose: `python server.py`
- Comprueba que la IP en `config/api.js` sea correcta
- Asegúrate de que ambos dispositivos estén en la **misma red Wi-Fi**

### No encuentra oponente
- Abre la app en **dos dispositivos/emuladores diferentes**
- Ambos deben seleccionar el **mismo tamaño de tablero**
- El primer jugador quedará en espera, el segundo iniciará la partida automáticamente

### El tablero no se actualiza
- Verifica la consola de Expo para ver errores de red
- El servidor sincroniza cada 2 segundos automáticamente
- Si hay error, revisa que el servidor Flask siga ejecutándose

### Firewall bloquea la conexión
- En Windows, permite Python a través del firewall
- En algunos routers, verifica que no haya aislamiento de clientes Wi-Fi

## 💡 Notas

- **Los datos son temporales**: se pierden al reiniciar el servidor (memoria RAM)
- **Timeout de inactividad**: 5 minutos sin actividad desconecta el dispositivo
- **Para producción**: considera usar WebSockets en lugar de polling, y una base de datos real
- **Documentación Swagger**: visita `http://TU_IP:5000/` en el navegador para ver la API interactiva

## 🎯 Próximas Mejoras (Opcionales)

- 🔌 Usar WebSockets para actualizaciones en tiempo real sin polling
- 💾 Base de datos (SQLite/PostgreSQL) para persistencia
- 🎨 Animaciones de transición entre turnos
- 💬 Chat entre jugadores
- 🏆 Tabla de clasificación global
- 🔔 Notificaciones push cuando es tu turno
