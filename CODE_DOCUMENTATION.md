# Pet Water Dispenser IoT System - Core Code Documentation

## System Architecture

```
┌─────────┐         ┌──────────┐         ┌─────────┐
│  ESP32  │ ──MQTT─→│  Backend │ ──WS──→ │Frontend │
│ Sensors │         │  Server  │         │   UI    │
└─────────┘         └──────────┘         └─────────┘
     ↑                    ↑                     │
     └────────MQTT────────┘←────────WS─────────┘
```

---

## 1. Backend Server (Node.js)

**File:** `backend/server.js`

### MQTT Connection & Data Broadcasting
```javascript
const mqttClient = mqtt.connect(process.env.MQTT_BROKER || 'mqtt://localhost:1883');

mqttClient.on('connect', () => {
  mqttClient.subscribe('dispenser/tank');
  mqttClient.subscribe('dispenser/bowl');
  mqttClient.subscribe('dispenser/pet');
  mqttClient.subscribe('dispenser/status');
});

mqttClient.on('message', (topic, message) => {
  const data = message.toString();
  
  switch(topic) {
    case 'dispenser/tank':
      deviceData.tankLevel = parseInt(data);
      break;
    case 'dispenser/bowl':
      deviceData.bowlLevel = parseInt(data);
      break;
    case 'dispenser/pet':
      deviceData.petDetected = data === '1';
      break;
  }
  
  io.emit('deviceUpdate', deviceData);
});
```
**Purpose:** Receives sensor data from ESP32 via MQTT and broadcasts to frontend via Socket.IO.

### Command Handling
```javascript
io.on('connection', (socket) => {
  socket.on('startDispensing', () => {
    mqttClient.publish('dispenser/control', 'start');
  });
});
```
**Purpose:** Receives user commands from frontend and sends to ESP32.

---

## 2. ESP32 Hardware Controller

**File:** `esp32/esp32_mqtt.ino`

### Sensor Reading & Publishing
```cpp
void loop() {
  int tankLevel = calculateWaterLevel(readUltrasonic(TRIG_PIN_TANK, ECHO_PIN_TANK), 30);
  int bowlLevel = calculateWaterLevel(readUltrasonic(TRIG_PIN_BOWL, ECHO_PIN_BOWL), 10);
  int petDetected = digitalRead(IR_SENSOR_PIN);
  
  client.publish("dispenser/tank", String(tankLevel).c_str());
  client.publish("dispenser/bowl", String(bowlLevel).c_str());
  client.publish("dispenser/pet", petDetected == LOW ? "1" : "0");
}
```
**Purpose:** Reads sensors and publishes data to MQTT broker every 2 seconds.

### Command Reception
```cpp
void callback(char* topic, byte* payload, unsigned int length) {
  String message;
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  
  if (String(topic) == "dispenser/control") {
    if (message == "start") {
      digitalWrite(PUMP_PIN, HIGH);
    }
  }
}
```
**Purpose:** Receives commands and controls water pump.

---

## 3. Frontend Application (React)

**File:** `frontend/src/App.jsx`

### Real-Time Connection
```javascript
useEffect(() => {
  const newSocket = io('http://localhost:3001');
  
  newSocket.on('deviceUpdate', (data) => {
    setDeviceData(data);
  });
  
  return () => newSocket.close();
}, []);
```
**Purpose:** Establishes WebSocket connection and receives real-time updates.

### User Commands
```javascript
const handleStartDispensing = () => {
  socket?.emit('startDispensing');
};
```
**Purpose:** Sends control commands to backend.

---

## 4. Key Components

### Dashboard Layout
**File:** `frontend/src/components/Dashboard.jsx`
```javascript
<WaterLevelCard level={tankLevel} />
<BowlLevelCard level={bowlLevel} />
<PetDetectionCard detected={petDetected} />
<ControlPanel onStart={onStartDispensing} />
```

### Theme Management
**File:** `frontend/src/context/ThemeContext.jsx`
```javascript
const toggleTheme = () => setIsDark(!isDark);
```

---

## Communication Protocols

### MQTT Topics
- `dispenser/tank` - Tank water level (0-100%)
- `dispenser/bowl` - Bowl water level (0-100%)
- `dispenser/pet` - Pet detection (1/0)
- `dispenser/control` - Commands (start/stop)

### Socket.IO Events
- `deviceUpdate` - Real-time sensor data
- `historyUpdate` - Historical data
- `startDispensing` - Start pump command

---

## Technology Stack

**Backend:** Express.js, Socket.IO, MQTT.js  
**Frontend:** React, Vite, Socket.IO Client, Tailwind CSS  
**Hardware:** ESP32, Ultrasonic Sensors, IR Sensor, Water Pump

---

**Project:** Pet Water Dispenser IoT System  
**Team:** Group 1 - BSIT 3A  
**Academic Year:** 2025-2026
