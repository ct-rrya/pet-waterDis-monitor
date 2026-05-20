# C# Integration Guide for Pet Water Dispenser

## 📖 Overview

This guide explains how the C# middleware integrates hardware (ESP32) and software (Web App) through Firebase Realtime Database, providing a complete bidirectional communication system.

## 🏗️ System Architecture

```
┌─────────────────┐
│   ESP32 (C++)   │ ← Hardware Layer
│  - Sensors      │
│  - Pump Control │
└────────┬────────┘
         │ WiFi
         ↓
┌─────────────────────────────────────┐
│   Firebase Realtime Database        │ ← Cloud Layer
│   - device/                         │
│   - control/                        │
│   - history/                        │
└────────┬────────────────────────────┘
         │
    ┌────┴────┐
    ↓         ↓
┌─────────┐ ┌──────────────┐
│ Web App │ │ C# Desktop   │ ← Software Layer
│ (React) │ │ Application  │
└─────────┘ └──────────────┘
```

## 🔄 Data Flow

### Hardware → Software (Sensor Data)

1. **ESP32 reads sensors** (every 2 seconds)
   - Ultrasonic sensors measure water levels
   - IR sensor detects pet presence

2. **ESP32 writes to Firebase**
   ```cpp
   Firebase.RTDB.setInt(&fbdo, "device/tankLevel", tankLevel);
   Firebase.RTDB.setInt(&fbdo, "device/bowlLevel", bowlLevel);
   Firebase.RTDB.setBool(&fbdo, "device/petDetected", petDetected);
   ```

3. **C# application receives updates**
   ```csharp
   firebase.SubscribeToDeviceData();
   // Real-time event triggered automatically
   ```

4. **Web app receives updates**
   ```javascript
   onValue(deviceRef, (snapshot) => {
     setDeviceData(snapshot.val());
   });
   ```

### Software → Hardware (Control Commands)

1. **User clicks button** (Web App or C# App)

2. **Command sent to Firebase**
   - **Web App:**
     ```javascript
     set(ref(database, 'control/command'), 'start');
     ```
   - **C# App:**
     ```csharp
     await firebase.StartDispensingAsync();
     ```

3. **ESP32 reads command**
   ```cpp
   Firebase.RTDB.getString(&fbdo, "control/command");
   if (command == "start") {
     digitalWrite(PUMP_PIN, HIGH);
   }
   ```

4. **ESP32 executes action**
   - Activates pump for 5 seconds
   - Updates dispensing status in Firebase

## 📊 Firebase Database Schema

```json
{
  "device": {
    "tankLevel": 75,          // 0-100%
    "bowlLevel": 50,          // 0-100%
    "petDetected": true,      // boolean
    "isOnline": true,         // boolean
    "lastUpdate": "1234567890", // Unix timestamp (ms)
    "dispensing": false       // boolean
  },
  "control": {
    "command": "start"        // "start" | "stop" | ""
  },
  "history": {
    "1234567890": {
      "timestamp": "1234567890",
      "tankLevel": 75
    },
    "1234567891": {
      "timestamp": "1234567891",
      "tankLevel": 74
    }
  }
}
```

## 🎯 C# Integration Features

### 1. Real-Time Monitoring

```csharp
// Subscribe to device data changes
firebase.OnDeviceDataChanged += (sender, data) =>
{
    Console.WriteLine($"Tank: {data.TankLevel}%");
    Console.WriteLine($"Bowl: {data.BowlLevel}%");
    Console.WriteLine($"Pet: {data.PetDetected}");
};

firebase.SubscribeToDeviceData();
```

**Use Cases:**
- Desktop monitoring dashboard
- Automated alerts and notifications
- Data logging to local database
- Integration with other systems

### 2. Remote Control

```csharp
// Send commands to hardware
await firebase.StartDispensingAsync();  // Start pump
await firebase.StopDispensingAsync();   // Stop pump
```

**Use Cases:**
- Desktop control application
- Scheduled automatic dispensing
- Remote management
- Emergency stop functionality

### 3. Data Validation

```csharp
bool isValid = firebase.ValidateSensorData(data);
// Checks:
// - Values in range (0-100%)
// - Low water alerts (< 20% tank, < 30% bowl)
// - Invalid readings detection
```

**Use Cases:**
- Quality assurance
- Anomaly detection
- Maintenance alerts
- System health monitoring

### 4. Hardware Simulation

```csharp
// Test without physical ESP32
await firebase.SimulateHardwareDataAsync(
    tankLevel: 80,
    bowlLevel: 60,
    petDetected: true
);
```

**Use Cases:**
- Software testing without hardware
- Demo presentations
- Development environment
- UI/UX testing

### 5. Historical Data Analysis

```csharp
var history = await firebase.GetHistoryAsync();
// Analyze water consumption patterns
// Generate usage reports
// Predict refill needs
```

**Use Cases:**
- Usage analytics
- Behavior pattern analysis
- Maintenance scheduling
- Cost optimization

## 🔧 Implementation Details

### C# Classes

#### `FirebaseIntegration.cs`
Main integration class providing:

**Read Operations:**
- `GetDeviceDataAsync()` - Fetch current sensor data
- `GetHistoryAsync()` - Retrieve historical records
- `SubscribeToDeviceData()` - Real-time updates
- `SubscribeToHistory()` - Real-time history updates

**Write Operations:**
- `StartDispensingAsync()` - Send start command
- `StopDispensingAsync()` - Send stop command
- `SimulateHardwareDataAsync()` - Send test data

**Monitoring:**
- `ValidateSensorData()` - Data validation
- `MonitorDeviceConnectivityAsync()` - Connection check

**Events:**
- `OnDeviceDataChanged` - Triggered on sensor updates
- `OnHistoryAdded` - Triggered on new history entry
- `OnControlCommandReceived` - Triggered on command

#### `Program.cs`
Console application with interactive menu:
1. Read current device data
2. Start dispensing water
3. Stop dispensing water
4. View history
5. Simulate hardware data
6. Check device connectivity
7. Exit

### Data Models

```csharp
public class DeviceData
{
    public int TankLevel { get; set; }
    public int BowlLevel { get; set; }
    public bool PetDetected { get; set; }
    public bool IsOnline { get; set; }
    public string LastUpdate { get; set; }
    public bool Dispensing { get; set; }
}

public class HistoryEntry
{
    public string Timestamp { get; set; }
    public int TankLevel { get; set; }
}

public class ControlCommand
{
    public string Command { get; set; }
}
```

## 🚀 Getting Started

### Step 1: Install .NET SDK

Download from: https://dotnet.microsoft.com/download

```bash
dotnet --version  # Verify installation
```

### Step 2: Navigate to Project

```bash
cd csharp-integration
```

### Step 3: Restore Packages

```bash
dotnet restore
```

This installs:
- `FirebaseDatabase.net` v4.2.0
- `FirebaseAdmin` v2.4.0
- `Newtonsoft.Json` v13.0.3

### Step 4: Build Project

```bash
dotnet build
```

### Step 5: Run Application

```bash
dotnet run
```

## 🧪 Testing Scenarios

### Scenario 1: Test Without Hardware

1. Run C# application
2. Select option `5` (Simulate hardware data)
3. Enter test values
4. Open web app: https://water-dispenser-7e6e9.web.app
5. Verify data appears in real-time

### Scenario 2: Monitor Real Hardware

1. Power on ESP32 with sensors
2. Run C# application
3. Select option `1` (Read device data)
4. Observe real sensor readings
5. Watch real-time updates in console

### Scenario 3: Remote Control

1. Ensure ESP32 is online
2. Run C# application
3. Select option `2` (Start dispensing)
4. Verify pump activates on hardware
5. Check web app shows "Dispensing" status

### Scenario 4: Multi-Client Communication

1. Open web app on phone
2. Run C# application on computer
3. Power on ESP32 hardware
4. All three receive same data simultaneously
5. Control from any client affects all others

## 📈 Advanced Use Cases

### 1. Automated Scheduling

```csharp
// Schedule automatic dispensing
var timer = new Timer(async _ =>
{
    await firebase.StartDispensingAsync();
}, null, TimeSpan.Zero, TimeSpan.FromHours(6));
```

### 2. Email Alerts

```csharp
firebase.OnDeviceDataChanged += async (sender, data) =>
{
    if (data.TankLevel < 10)
    {
        await SendEmailAlert("Tank almost empty!");
    }
};
```

### 3. Data Export

```csharp
var history = await firebase.GetHistoryAsync();
var csv = ConvertToCsv(history);
File.WriteAllText("water_usage.csv", csv);
```

### 4. Multi-Device Management

```csharp
// Monitor multiple dispensers
var devices = new[] { "device1", "device2", "device3" };
foreach (var device in devices)
{
    MonitorDevice(device);
}
```

## 🔐 Security Considerations

### Current Setup (Development)
- Firebase database has public read/write access
- No authentication required
- Suitable for testing and development

### Production Recommendations

1. **Enable Firebase Authentication**
   ```json
   {
     "rules": {
       ".read": "auth != null",
       ".write": "auth != null"
     }
   }
   ```

2. **Implement User Roles**
   ```json
   {
     "rules": {
       "control": {
         ".write": "auth.token.admin === true"
       }
     }
   }
   ```

3. **Add API Keys**
   - Store Firebase credentials in environment variables
   - Use .NET Secret Manager for development
   - Use Azure Key Vault for production

## 🐛 Troubleshooting

### Issue: "Firebase connection failed"
**Solution:**
- Check internet connection
- Verify Firebase URL: `https://water-dispenser-7e6e9-default-rtdb.firebaseio.com/`
- Ensure Firebase project is active

### Issue: "Device is offline"
**Solution:**
- Check ESP32 power supply
- Verify WiFi credentials in ESP32 code
- Check Firebase credentials in ESP32 code
- Monitor ESP32 serial output for errors

### Issue: "Package restore failed"
**Solution:**
```bash
dotnet nuget locals all --clear
dotnet restore --force
```

### Issue: "Real-time updates not working"
**Solution:**
- Ensure `SubscribeToDeviceData()` is called
- Check Firebase database rules allow read access
- Verify network connection is stable

## 📚 Additional Resources

- **Firebase .NET SDK:** https://firebase.google.com/docs/admin/setup
- **FirebaseDatabase.net:** https://github.com/step-up-labs/firebase-database-dotnet
- **.NET Documentation:** https://docs.microsoft.com/en-us/dotnet/
- **Project Repository:** https://github.com/ct-rrya/pet-waterDis-monitor

## 👥 Credits

**GROUP 1 - BSIT 3A (2025-2026)**
- **Lord Jason Riveral** - Main Hardware Developer
- **Jerome Magdadaro** - Assistant Hardware Developer
- **Merry Apple Edaño** - Software Developer
- **Vence Peter Doble** - Documentation and Hardware Assistant

**Subject:** Application of Internet of Things (AP 5)

---

*This C# integration provides a powerful middleware layer for monitoring, controlling, and testing the Pet Water Dispenser system. It demonstrates the flexibility of Firebase as a central communication hub for IoT applications.*
