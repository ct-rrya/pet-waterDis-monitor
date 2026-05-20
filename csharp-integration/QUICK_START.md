# C# Integration - Quick Start Guide

## ⚡ 5-Minute Setup

### Step 1: Install .NET SDK
Download from: https://dotnet.microsoft.com/download/dotnet/6.0

Verify installation:
```bash
dotnet --version
```

### Step 2: Run the Application

**Windows:**
```bash
cd csharp-integration
run.bat
```

**Mac/Linux:**
```bash
cd csharp-integration
dotnet run
```

### Step 3: Choose an Option

```
1. Read current device data       ← See live sensor readings
2. Start dispensing water         ← Control the pump
3. Stop dispensing water          ← Stop the pump
4. View history                   ← See past data
5. Simulate hardware data         ← Test without ESP32
6. Check device connectivity      ← Verify ESP32 is online
7. Exit
```

## 🎯 Common Use Cases

### Test Without Hardware
1. Run the application
2. Select option `5`
3. Enter test values:
   - Tank level: `80`
   - Bowl level: `60`
   - Pet detected: `y`
4. Open web app: https://water-dispenser-7e6e9.web.app
5. See your test data appear!

### Monitor Real Hardware
1. Power on your ESP32
2. Run the application
3. Select option `1`
4. Watch real-time updates in console

### Remote Control
1. Run the application
2. Select option `2` to start pump
3. ESP32 will dispense water for 5 seconds
4. Web app shows "Dispensing" status

## 📊 What You'll See

```
[REAL-TIME UPDATE]
  Tank Level: 75%
  Bowl Level: 50%
  Pet Detected: True
  Dispensing: False
  Online: True

[ALERT] Bowl level low: 25%
```

## 🔧 Troubleshooting

**"dotnet: command not found"**
→ Install .NET SDK from link above

**"Firebase connection failed"**
→ Check your internet connection

**"Device is offline"**
→ Make sure ESP32 is powered on and connected to WiFi

## 📚 Learn More

- Full documentation: `README.md`
- Integration guide: `../CSHARP_INTEGRATION_GUIDE.md`
- Project repository: https://github.com/ct-rrya/pet-waterDis-monitor

## 💡 Pro Tips

- Leave the app running to see real-time updates
- Use option 5 to demo the system without hardware
- Check option 6 if ESP32 seems disconnected
- View history (option 4) to analyze water usage patterns

---

**Need help?** Check the full README.md or CSHARP_INTEGRATION_GUIDE.md
