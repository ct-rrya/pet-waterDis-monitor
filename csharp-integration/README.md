# Pet Water Dispenser - C# Integration

This C# application provides a middleware layer for integrating hardware (ESP32) and software (Web App) through Firebase Realtime Database.

## 🎯 Purpose

- **Monitor** real-time sensor data from ESP32
- **Control** water dispensing from desktop application
- **Validate** sensor readings and detect anomalies
- **Simulate** hardware data for testing without physical device
- **Log** and analyze historical water usage data

## 📋 Prerequisites

- **.NET 6.0 SDK** or higher
- **Firebase project** (already configured: water-dispenser-7e6e9)
- **Internet connection** for Firebase communication

## 🚀 Installation

### 1. Install .NET SDK

Download and install from: https://dotnet.microsoft.com/download

Verify installation:
```bash
dotnet --version
```

### 2. Restore NuGet Packages

Navigate to the `csharp-integration` folder and run:
```bash
cd csharp-integration
dotnet restore
```

This will install:
- `FirebaseDatabase.net` - Firebase Realtime Database client
- `FirebaseAdmin` - Firebase Admin SDK
- `Newtonsoft.Json` - JSON serialization

### 3. Build the Project

```bash
dotnet build
```

## 🎮 Usage

### Run the Application

```bash
dotnet run
```

### Menu Options

```
1. Read current device data
   - Fetches latest sensor readings from Firebase
   - Displays tank level, bowl level, pet detection status
   - Validates data and shows alerts

2. Start dispensing water
   - Sends "start" command to ESP32 via Firebase
   - Pump will auto-stop after 5 seconds

3. Stop dispensing water
   - Sends "stop" command to ESP32 via Firebase
   - Manually stops the pump

4. View history
   - Displays last 10 water level readings
   - Shows timestamps and tank levels

5. Simulate hardware data (for testing)
   - Sends fake sensor data to Firebase
   - Useful for testing without physical ESP32
   - Allows you to input custom values

6. Check device connectivity
   - Verifies if ESP32 is online
   - Checks Firebase connection status

7. Exit
   - Closes the application
```

## 📊 Real-Time Monitoring

The application automatically subscribes to Firebase changes and displays:
- **Device data updates** (every 2 seconds from ESP32)
- **Control commands** (when web app sends commands)
- **Validation alerts** (low water levels, invalid readings)

Example output:
```
[REAL-TIME UPDATE]
  Tank Level: 75%
  Bowl Level: 50%
  Pet Detected: True
  Dispensing: False
  Online: True

[ALERT] Bowl level low: 25%
```

## 🔧 Architecture

### Data Flow

```
ESP32 Hardware → Firebase → C# Application
                    ↓
                Web Application
```

### Firebase Database Structure

```json
{
  "device": {
    "tankLevel": 75,
    "bowlLevel": 50,
    "petDetected": true,
    "isOnline": true,
    "lastUpdate": "1234567890",
    "dispensing": false
  },
  "control": {
    "command": "start" | "stop" | ""
  },
  "history": {
    "1234567890": {
      "timestamp": "1234567890",
      "tankLevel": 75
    }
  }
}
```

## 🧪 Testing Without Hardware

Use **Option 5** (Simulate hardware data) to test the system without ESP32:

1. Run the C# application
2. Select option `5`
3. Enter test values:
   - Tank level: `80`
   - Bowl level: `60`
   - Pet detected: `y`
4. Open web app: https://water-dispenser-7e6e9.web.app
5. See the simulated data appear in real-time!

## 📝 Code Structure

### `FirebaseIntegration.cs`
Main integration class with methods for:
- Reading device data
- Sending control commands
- Subscribing to real-time updates
- Simulating hardware data
- Validating sensor readings

### `Program.cs`
Console application with interactive menu for:
- User interaction
- Command execution
- Real-time monitoring display

### `PetWaterMonitor.csproj`
Project configuration with NuGet dependencies

## 🔐 Security Notes

- Firebase URL is public (read/write enabled for development)
- For production, implement Firebase Security Rules
- Consider adding authentication for control commands

## 🐛 Troubleshooting

### "Firebase connection failed"
- Check internet connection
- Verify Firebase URL in `FirebaseIntegration.cs`
- Ensure Firebase project is active

### "Package restore failed"
- Update NuGet: `dotnet nuget locals all --clear`
- Retry: `dotnet restore`

### "Device is offline"
- Check if ESP32 is powered on
- Verify ESP32 WiFi connection
- Check Firebase credentials in ESP32 code

## 📚 Use Cases

1. **Desktop Monitoring Dashboard**
   - Run on Windows/Mac/Linux
   - Monitor multiple devices
   - Log data to local database

2. **Automated Testing**
   - Simulate various sensor scenarios
   - Test web app without hardware
   - Validate system behavior

3. **Data Analysis**
   - Export history to CSV
   - Generate usage reports
   - Detect patterns in pet behavior

4. **Remote Control**
   - Control dispenser from desktop
   - Schedule automatic dispensing
   - Set up alerts and notifications

## 🔄 Integration with Existing System

This C# application works alongside:
- **ESP32** (sends sensor data every 2 seconds)
- **Web App** (React PWA for mobile/desktop browsers)
- **Firebase** (central data hub)

All three components can run simultaneously and communicate through Firebase!

## 📦 Building for Distribution

Create standalone executable:
```bash
dotnet publish -c Release -r win-x64 --self-contained
```

Output location: `bin/Release/net6.0/win-x64/publish/`

## 🎓 Learning Resources

- [Firebase .NET SDK Documentation](https://firebase.google.com/docs/admin/setup)
- [FirebaseDatabase.net GitHub](https://github.com/step-up-labs/firebase-database-dotnet)
- [.NET 6 Documentation](https://docs.microsoft.com/en-us/dotnet/)

## 📄 License

Part of Pet Water Dispenser project by GROUP 1, BSIT 3A (2025-2026)
