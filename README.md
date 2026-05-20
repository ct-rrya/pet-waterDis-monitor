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
- React + Vite
- Tailwind CSS
- Firebase Realtime Database
- PWA (Service Worker + Manifest)
- Recharts

### Backend/Integration
- Firebase Realtime Database (Cloud)
- C# .NET 6.0 (Desktop Integration)
- FirebaseDatabase.net

### IoT Hardware
- ESP32 (Arduino/C++)
- Ultrasonic sensors (water level)
- IR sensor (pet detection)
- Water pump control
- Firebase ESP Client

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+) - for frontend development
- .NET 6.0 SDK - for C# integration (optional)
- Firebase account (free tier)
- ESP32 board
- Arduino IDE

### Installation

#### 1. Frontend Setup

```bash
cd frontend
npm install
```

#### 2. Firebase Configuration

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Realtime Database
3. Copy your Firebase config to `frontend/src/firebase.js`
4. Set database rules to public (for development):
   ```json
   {
     "rules": {
       ".read": true,
       ".write": true
     }
   }
   ```

#### 3. Run Frontend

```bash
npm run dev
```

Frontend will start on `http://localhost:5173`

**Or visit the live deployment:** https://water-dispenser-7e6e9.web.app

#### 4. ESP32 Setup

1. Open `esp32/esp32_firebase.ino` in Arduino IDE
2. Install required libraries:
   - Firebase ESP Client
   - WiFi
3. Update credentials:
   ```cpp
   #define WIFI_SSID "your_wifi_name"
   #define WIFI_PASSWORD "your_wifi_password"
   #define API_KEY "your_firebase_api_key"
   #define DATABASE_URL "your_firebase_database_url"
   ```
4. Connect your sensors:
   - Tank ultrasonic: TRIG=5, ECHO=18
   - Bowl ultrasonic: TRIG=19, ECHO=21
   - IR sensor: PIN=22
   - Water pump: PIN=23
5. Upload to ESP32

#### 5. C# Integration (Optional)

For desktop monitoring and control:

```bash
cd csharp-integration
dotnet restore
dotnet run
```

See `CSHARP_INTEGRATION_GUIDE.md` for detailed instructions.

## 📦 Production Deployment

### Frontend (Firebase Hosting)

```bash
cd frontend
npm run build
firebase deploy
```

Live URL: https://water-dispenser-7e6e9.web.app

### C# Desktop Application

```bash
cd csharp-integration
dotnet publish -c Release -r win-x64 --self-contained
```

Executable will be in `bin/Release/net6.0/win-x64/publish/`

## 🔧 Configuration

### Firebase (firebase.js)
```javascript
const firebaseConfig = {
  apiKey: "your_api_key",
  authDomain: "your_project.firebaseapp.com",
  databaseURL: "https://your_project.firebaseio.com",
  projectId: "your_project",
  storageBucket: "your_project.appspot.com",
  messagingSenderId: "your_sender_id",
  appId: "your_app_id"
};
```

### ESP32 (esp32_firebase.ino)
```cpp
#define WIFI_SSID "your_wifi_name"
#define WIFI_PASSWORD "your_wifi_password"
#define API_KEY "your_firebase_api_key"
#define DATABASE_URL "your_firebase_database_url"
```

### C# Integration (FirebaseIntegration.cs)
```csharp
private const string FIREBASE_URL = "https://your_project.firebaseio.com/";
```

## 📱 PWA Installation

The dashboard can be installed as a Progressive Web App:

### Android
1. Open https://water-dispenser-7e6e9.web.app in Chrome
2. Tap the menu (⋮) → "Add to Home screen"
3. Tap "Add" to install

### iOS
1. Open https://water-dispenser-7e6e9.web.app in Safari
2. Tap the Share button (□↑)
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add"

See `frontend/PWA_SETUP.md` for detailed instructions.

## 🛠️ Development

### Frontend Development
```bash
cd frontend
npm run dev  # Start Vite dev server
```

### C# Integration Development
```bash
cd csharp-integration
dotnet run   # Run console application
```

### Testing Without Hardware
Use the C# application to simulate sensor data:
1. Run `dotnet run` in csharp-integration folder
2. Select option 5 (Simulate hardware data)
3. Enter test values
4. View updates in web app in real-time

## 📊 Firebase Database Structure

```json
{
  "device": {
    "tankLevel": 75,          // Main tank water level (0-100%)
    "bowlLevel": 50,          // Bowl water level (0-100%)
    "petDetected": true,      // Pet presence detection
    "isOnline": true,         // Device connectivity status
    "lastUpdate": "1234567890", // Unix timestamp (ms)
    "dispensing": false       // Pump status
  },
  "control": {
    "command": "start"        // Control commands: "start" | "stop" | ""
  },
  "history": {
    "1234567890": {
      "timestamp": "1234567890",
      "tankLevel": 75
    }
  }
}
```

### Data Flow
```
ESP32 → Firebase ← Web App
              ↕
         C# Desktop App
```

All components communicate through Firebase Realtime Database in real-time.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📚 Documentation

- **[CODE_DOCUMENTATION.md](CODE_DOCUMENTATION.md)** - Core code explanations
- **[CSHARP_INTEGRATION_GUIDE.md](CSHARP_INTEGRATION_GUIDE.md)** - C# integration guide
- **[SYSTEM_FLOWCHART.md](SYSTEM_FLOWCHART.md)** - System architecture
- **[frontend/PWA_SETUP.md](frontend/PWA_SETUP.md)** - PWA installation guide
- **[csharp-integration/README.md](csharp-integration/README.md)** - C# quick start

## 👥 Team

**GROUP 1 - BSIT 3A (Academic Year 2025-2026)**

- **Lord Jason Riveral** - Main Hardware Developer
- **Jerome Magdadaro** - Assistant Hardware Developer  
- **Merry Apple Edaño** - Software Developer
- **Vence Peter Doble** - Documentation and Hardware Assistant

**Subject:** Application of Internet of Things (AP 5)

## 📄 License

MIT License
