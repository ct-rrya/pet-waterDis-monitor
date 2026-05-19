# 🐾 Smart Pet Water Dispenser - Materials & Specifications

## 📋 Bill of Materials (BOM)

### 🔌 Electronics & Microcontroller

| Component | Specification | Quantity | Purpose |
|-----------|--------------|----------|---------|
| **ESP32 Microcontroller** | Wi-Fi enabled, dual-core | 1 | Main control unit, handles sensors, actuators, and MQTT communication |
| **Power Supply** | 5V/2A adapter | 1 | Powers the entire system |
| **Servo Motor** | SG90 or similar (5V) | 1 | Controls water valve to dispense water to bowl |
| **Water Valve** | 12V solenoid valve (optional) | 1 | Alternative to servo for water flow control |
| **LCD Display** | 16x2 I2C LCD (1602) | 1 | Shows system status, water levels, and pet detection |
| **Status LEDs** | Red & Green LEDs | 2 | Visual indicators for system status |
| **Buzzer** | 5V piezo buzzer (optional) | 1 | Audio alerts for low water or errors |

### 📡 Sensors

| Component | Specification | Quantity | Purpose |
|-----------|--------------|----------|---------|
| **Ultrasonic Sensor (Tank)** | HC-SR04 | 1 | Measures water level in main reservoir tank |
| **Ultrasonic Sensor (Bowl)** | HC-SR04 | 1 | Detects water level in pet's drinking bowl |
| **PIR Motion Sensor** | HC-SR501 | 1 | Detects pet presence near the dispenser |

### 🔩 Mechanical & Structural

| Component | Specification | Quantity | Purpose |
|-----------|--------------|----------|---------|
| **Water Reservoir Tank** | Food-grade plastic, 2-5L capacity | 1 | Stores main water supply |
| **Pet Bowl** | Stainless steel or ceramic, 500ml-1L | 1 | Pet's drinking bowl |
| **Enclosure/Housing** | ABS plastic or 3D printed case | 1 | Protects electronics and provides structure |
| **Water Tubing** | Food-grade silicone, 6mm diameter | 1m | Connects tank to bowl via valve |
| **Mounting Brackets** | Plastic or metal | As needed | Secures sensors and components |

### 🔧 Wiring & Connectors

| Component | Specification | Quantity | Purpose |
|-----------|--------------|----------|---------|
| **Jumper Wires** | Male-to-male, male-to-female | 20+ | Connects components to ESP32 |
| **Breadboard** | 830 points (optional for prototyping) | 1 | Testing and prototyping |
| **PCB** | Custom or perfboard | 1 | Permanent circuit assembly |
| **Power Jack** | DC barrel jack | 1 | Power input connector |

---

## 🎯 Product Definition

### What is the Smart Pet Water Dispenser?

The **Smart Pet Water Dispenser** is an IoT-enabled automatic water management system designed to ensure pets always have access to fresh water. It combines real-time monitoring, automatic dispensing, and remote control capabilities through a web/mobile dashboard.

### Key Features:
- **Automated Water Dispensing** - Refills bowl automatically when water is low
- **Real-Time Monitoring** - Tracks tank and bowl water levels continuously
- **Pet Detection** - Knows when your pet is drinking
- **Remote Control** - Start/stop dispensing from anywhere via web app
- **Smart Alerts** - Notifications for low water, refill needed, or system errors
- **Usage Analytics** - Historical data and trends of water consumption
- **Offline Capable** - PWA works without internet connection

---

## 🔧 Product Functions & Use Cases

### 1. **Real-Time Water Level Monitoring**
**Function:** Continuously measures water levels in both tank and bowl using ultrasonic sensors.

**How it works:**
- Ultrasonic sensors emit sound waves that bounce off water surface
- ESP32 calculates distance and converts to percentage (0-100%)
- Data sent to backend via MQTT every 2 seconds
- Dashboard displays live updates

**Use Case:** Owner can check water levels remotely before leaving home or while at work.

---

### 2. **Bowl Water Level Monitoring**
**Function:** Ensures the pet's bowl always has sufficient water.

**How it works:**
- Dedicated sensor monitors bowl water level
- When level drops below threshold (e.g., 30%), system can auto-refill
- Prevents bowl from running dry

**Use Case:** Pet drinks water throughout the day; system automatically refills bowl without owner intervention.

---

### 3. **Pet Detection System**
**Function:** Detects when pet approaches the dispenser using PIR motion sensor.

**How it works:**
- PIR sensor detects infrared radiation (body heat) from pet
- Triggers "Pet Detected" status on dashboard
- Can log drinking patterns and frequency

**Use Case:** Owner monitors pet's drinking habits to ensure adequate hydration, especially for health monitoring.

---

### 4. **Manual Water Refill Control**
**Function:** Allows owner to manually start/stop water dispensing remotely.

**How it works:**
- User clicks "Start Dispensing" button on web app
- Command sent via Socket.IO to backend
- Backend publishes MQTT message to ESP32
- ESP32 activates servo motor/valve to dispense water
- User clicks "Stop" to halt dispensing

**Use Case:** Owner wants to refill bowl remotely while away from home, or test the system.

---

### 5. **Low Water Alert Notification**
**Function:** Alerts owner when tank water level is critically low.

**How it works:**
- ESP32 monitors tank level continuously
- When level drops below 30%, alert triggered
- Dashboard shows red warning banner
- Optional: Buzzer sounds locally, push notification sent

**Use Case:** Owner receives alert to refill tank before it runs completely empty, preventing pet from going without water.

---

### 6. **Water Usage History**
**Function:** Tracks and displays historical water consumption data.

**How it works:**
- Backend stores water level readings with timestamps
- Data stored in array (last 100 readings)
- Chart component visualizes trends over time
- Shows daily/hourly consumption patterns

**Use Case:** Owner analyzes pet's drinking habits, identifies unusual patterns (potential health issues), or optimizes refill schedule.

---

### 7. **Device Status Monitoring**
**Function:** Shows if ESP32 device is online/offline and connected.

**How it works:**
- ESP32 publishes "online" status on MQTT connection
- Backend tracks last received message timestamp
- Dashboard displays connection status with indicator dot
- If no data received for >10 seconds, marked offline

**Use Case:** Owner troubleshoots connectivity issues or confirms system is operational.

---

### 8. **Last Update Indicator**
**Function:** Displays timestamp of most recent sensor data.

**How it works:**
- Backend records timestamp when data received from ESP32
- Dashboard shows formatted time (e.g., "2:45:30 PM")
- Updates in real-time

**Use Case:** Owner verifies data freshness and system responsiveness.

---

### 9. **Installable PWA Dashboard**
**Function:** Web app can be installed on mobile devices like a native app.

**How it works:**
- Service worker caches app assets for offline use
- Manifest file defines app name, icons, theme
- Browser prompts user to "Add to Home Screen"
- Works offline with cached data

**Use Case:** Owner installs app on phone for quick access without opening browser, receives faster load times, and can view cached data even without internet.

---

## 🏗️ System Architecture

### Hardware Layer (ESP32)
- Reads sensor data (ultrasonic, PIR)
- Controls actuators (servo motor, valve)
- Displays status on LCD
- Communicates via MQTT over Wi-Fi

### Communication Layer (MQTT Broker)
- Mosquitto or cloud MQTT broker
- Bridges ESP32 and backend server
- Topics: `dispenser/tank`, `dispenser/bowl`, `dispenser/pet`, `dispenser/control`, `dispenser/status`

### Backend Layer (Node.js + Express)
- Receives MQTT messages from ESP32
- Stores data in memory (or database)
- Provides REST API endpoints
- Real-time communication via Socket.IO

### Frontend Layer (React + PWA)
- Displays dashboard with live data
- Sends control commands to backend
- Visualizes water usage history
- Installable as PWA

---

## 🔌 Pin Configuration (ESP32)

| Component | ESP32 Pin | Type |
|-----------|-----------|------|
| Tank Ultrasonic TRIG | GPIO 5 | Output |
| Tank Ultrasonic ECHO | GPIO 18 | Input |
| Bowl Ultrasonic TRIG | GPIO 19 | Output |
| Bowl Ultrasonic ECHO | GPIO 21 | Input |
| PIR Motion Sensor | GPIO 22 | Input |
| Servo Motor / Pump | GPIO 23 | Output |
| LCD SDA (I2C) | GPIO 21 | I2C Data |
| LCD SCL (I2C) | GPIO 22 | I2C Clock |
| Status LED (Green) | GPIO 2 | Output |
| Status LED (Red) | GPIO 4 | Output |
| Buzzer (Optional) | GPIO 15 | Output |

---

## 📊 Technical Specifications

### Power Requirements
- **Input Voltage:** 5V DC (via USB or adapter)
- **Current Draw:** ~500mA (idle), ~1A (dispensing)
- **Power Consumption:** ~2.5W average

### Connectivity
- **Wi-Fi:** 802.11 b/g/n (2.4GHz)
- **MQTT Protocol:** v3.1.1
- **WebSocket:** Socket.IO for real-time updates

### Sensor Specifications
- **Ultrasonic Range:** 2cm - 400cm
- **Ultrasonic Accuracy:** ±3mm
- **PIR Detection Range:** 3-7 meters
- **PIR Detection Angle:** 120°

### Water Capacity
- **Tank Capacity:** 2-5 liters (customizable)
- **Bowl Capacity:** 500ml - 1 liter
- **Dispensing Rate:** ~100ml/second (depends on valve)

### Environmental
- **Operating Temperature:** 0°C - 50°C
- **Humidity:** 20% - 80% RH (non-condensing)
- **Water Resistance:** Splash-proof enclosure recommended

---

## 🎨 Dashboard Features

### Live Monitoring Cards
1. **Tank Level Card** - Circular progress indicator with percentage
2. **Bowl Level Card** - Gradient card with progress bar
3. **Pet Activity Card** - Shows detection status with animation
4. **Control Panel** - Start/stop buttons for manual dispensing
5. **Status Card** - Connection status and last update time
6. **History Chart** - Line graph showing water usage over time

### Visual Design
- **Neomorphic UI** - Soft shadows and 3D embossed look
- **Glassmorphism** - Frosted glass effect with backdrop blur
- **Purple/Pink Gradient Theme** - Modern, pet-friendly aesthetic
- **Responsive Layout** - Works on mobile, tablet, and desktop

---

## 🚀 Use Scenarios

### Scenario 1: Daily Automatic Operation
- Pet drinks water throughout the day
- Bowl sensor detects low level
- System automatically refills bowl from tank
- Owner receives notification when tank needs refilling

### Scenario 2: Remote Monitoring While Away
- Owner at work checks dashboard on phone
- Sees tank at 45%, bowl at 60%
- Pet detected drinking at 2:30 PM
- No action needed, system operating normally

### Scenario 3: Manual Refill Command
- Owner notices bowl is low via app
- Clicks "Start Dispensing" button
- Water flows for 5 seconds
- Owner clicks "Stop" when bowl is full

### Scenario 4: Low Water Alert
- Tank level drops to 25%
- Dashboard shows red alert banner
- Owner receives notification
- Owner refills tank within next few hours

### Scenario 5: Health Monitoring
- Owner reviews water usage history chart
- Notices pet drinking less than usual
- Identifies potential health issue early
- Consults veterinarian with data

---

## 🛠️ Assembly & Installation

### Step 1: Hardware Assembly
1. Mount ultrasonic sensors in tank and above bowl
2. Install PIR sensor near bowl area
3. Connect servo motor to water valve
4. Wire all components to ESP32 per pin configuration
5. Install LCD display on enclosure front panel

### Step 2: Software Setup
1. Flash ESP32 with Arduino code (`esp32/esp32_mqtt.ino`)
2. Configure Wi-Fi credentials and MQTT broker IP
3. Install MQTT broker (Mosquitto) on server/Raspberry Pi
4. Deploy Node.js backend server
5. Build and deploy React frontend

### Step 3: Calibration
1. Measure tank height and update code for accurate percentage
2. Test ultrasonic sensors with different water levels
3. Adjust PIR sensor sensitivity and range
4. Calibrate servo motor angle for valve control

### Step 4: Testing
1. Fill tank with water
2. Verify sensor readings on dashboard
3. Test manual dispensing control
4. Confirm pet detection works
5. Check alert notifications

---

## 📦 Package Contents

- 1x ESP32 Development Board
- 2x HC-SR04 Ultrasonic Sensors
- 1x PIR Motion Sensor (HC-SR501)
- 1x Servo Motor (SG90)
- 1x 16x2 I2C LCD Display
- 1x Water Reservoir Tank (2L)
- 1x Pet Bowl (Stainless Steel)
- 1x 5V/2A Power Adapter
- 1x Silicone Water Tubing (1m)
- 1x Enclosure/Housing
- 20x Jumper Wires
- 1x USB Cable (for programming)
- 1x Quick Start Guide
- 1x Mounting Hardware Kit

---

## 🔒 Safety & Maintenance

### Safety Precautions
- Use food-grade materials for water contact surfaces
- Ensure all electronics are protected from water splashes
- Use proper voltage ratings for all components
- Keep power adapter away from water sources

### Maintenance
- **Weekly:** Clean bowl and refill tank
- **Monthly:** Check sensor alignment and clean ultrasonic sensors
- **Quarterly:** Inspect tubing for leaks or blockages
- **Annually:** Replace water tubing and clean entire system

### Troubleshooting
- **Device Offline:** Check Wi-Fi connection and power supply
- **Inaccurate Readings:** Clean sensors, verify mounting position
- **No Dispensing:** Check valve/servo connection, verify power
- **Pet Not Detected:** Adjust PIR sensor angle and sensitivity

---

## 📄 Warranty & Support

- **Warranty Period:** 1 year from purchase date
- **Coverage:** Manufacturing defects and component failures
- **Support:** Email support, online documentation, community forum
- **Updates:** Firmware and software updates available via GitHub

---

*Document Version: 1.0*  
*Last Updated: May 12, 2026*
