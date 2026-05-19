# 🐾 Smart Pet Water Dispenser

A full-stack IoT solution for monitoring and controlling your pet's water supply in real-time.

## 🎯 Features

- **📊 Real-Time Water Level Monitoring** - Track main tank water level with live updates
- **🍽️ Bowl Water Level Monitoring** - Ensure your pet always has water available
- **🐕 Pet Detection System** - Know when your pet is near the dispenser
- **🔄 Manual Water Refill Control** - Start/stop water dispensing remotely
- **🚨 Low Water Alert Notification** - Get notified when water is running low
- **📈 Water Usage History** - View historical data with interactive charts
- **📡 Device Status Monitoring** - Check if your device is online/offline
- **🕒 Last Update Indicator** - See when data was last received
- **📱 Installable PWA Dashboard** - Works offline and installs like a native app

## 🏗️ Tech Stack

### Frontend
- React + TypeScript
- Tailwind CSS
- Vite
- PWA (Service Worker + Manifest)
- Socket.IO Client
- Recharts

### Backend
- Node.js + Express
- Socket.IO
- MQTT Bridge

### IoT
- ESP32 (Arduino/C++)
- Ultrasonic sensors (water level)
- PIR sensor (pet detection)
- Water pump control

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MQTT Broker (Mosquitto recommended)
- ESP32 board
- Arduino IDE

### Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd smart-pet-water-dispenser
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Configure environment**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your MQTT broker details
   ```

5. **Start MQTT Broker** (if using Mosquitto)
   ```bash
   mosquitto -v
   ```

6. **Run the application**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on `http://localhost:3001`
   - Frontend dev server on `http://localhost:5173`

### ESP32 Setup

1. Open `esp32/esp32_mqtt.ino` in Arduino IDE
2. Update WiFi credentials and MQTT broker IP
3. Connect your sensors:
   - Tank ultrasonic: TRIG=5, ECHO=18
   - Bowl ultrasonic: TRIG=19, ECHO=21
   - PIR sensor: PIN=22
   - Water pump: PIN=23
4. Upload to ESP32

## 📦 Production Build

```bash
npm run build
npm start
```

## 🔧 Configuration

### Backend (.env)
```
PORT=3001
CLIENT_URL=http://localhost:5173
MQTT_BROKER=mqtt://localhost:1883
```

### Frontend (.env)
```
VITE_SOCKET_URL=http://localhost:3001
```

## 📱 PWA Installation

The dashboard can be installed as a Progressive Web App:
1. Open the app in a browser
2. Click the install icon in the address bar
3. Follow the prompts to install

## 🛠️ Development

- `npm run dev` - Start both frontend and backend in development mode
- `npm run server` - Start only the backend server
- `npm run client` - Start only the frontend dev server

## 📊 MQTT Topics

- `dispenser/tank` - Tank water level (0-100%)
- `dispenser/bowl` - Bowl water level (0-100%)
- `dispenser/pet` - Pet detection (0 or 1)
- `dispenser/status` - Device status (online/offline)
- `dispenser/control` - Control commands (start/stop)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License
