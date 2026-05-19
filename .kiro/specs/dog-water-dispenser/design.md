# Design: Dog Water Dispenser IoT Project

## 1. System Architecture

### 1.1 Hardware Architecture
```
┌─────────────────────────────────────────────┐
│              ESP32 Controller               │
│  ┌────────────────────────────────────────┐ │
│  │  GPIO Pins                             │ │
│  │  - D2, D3: Ultrasonic (Trig, Echo)     │ │
│  │  - D4: Water Level Sensor (Analog)     │ │
│  │  - D5: Pump Relay Control              │ │
│  │  - D13: Status LED (RGB)               │ │
│  │  - D21, D22: I2C (OLED Display)        │ │
│  │  WiFi: Web Dashboard Server            │ │
│  └────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
         │           │            │           │
         ▼           ▼            ▼           ▼
   ┌─────────┐ ┌──────────┐ ┌─────────┐ ┌─────────┐
   │Ultrasonic│ │  Water   │ │  Relay  │ │  OLED   │
   │ Sensor  │ │  Level   │ │ Module  │ │ Display │
   │(HC-SR04)│ │  Sensor  │ │         │ │(SSD1306)│
   └─────────┘ └──────────┘ └─────────┘ └─────────┘
                                  │
                                  ▼
                            ┌──────────┐
                            │Water Pump│
                            └──────────┘
```

### 1.2 Software Architecture
```
┌──────────────────────────────────────┐
│         Main Control Loop            │
│  - Sensor Reading                    │
│  - State Management                  │
│  - Pump Control                      │
│  - Display Update                    │
└──────────────────────────────────────┘
         │
         ├──────────────┬──────────────┬──────────────┬──────────────┬──────────────┐
         ▼              ▼              ▼              ▼              ▼              ▼
┌──────────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ Dog Detection│ │  Water   │ │   Pump   │ │   OLED   │ │   WiFi   │ │   Web    │
│   Module     │ │  Level   │ │  Control │ │  Display │ │  Manager │ │  Server  │
│              │ │  Module  │ │  Module  │ │  Module  │ │          │ │  Module  │
└──────────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘
```

## 2. Component Specifications

### 2.1 ESP32 Development Board
- Model: ESP32-DevKitC or NodeMCU-32S
- Features: WiFi, Bluetooth, 18 ADC channels, 34 GPIO pins
- Operating Voltage: 3.3V logic, 5V input via USB

### 2.2 Ultrasonic Sensor (HC-SR04)
- Detection Range: 2cm - 400cm
- Accuracy: ±3mm
- Trigger Pin: Sends 10μs pulse
- Echo Pin: Returns pulse width proportional to distance
- Operating Voltage: 5V (use voltage divider for Echo pin to ESP32)

### 2.3 Water Level Sensor Options

#### Option A: Capacitive Water Level Sensor
- Non-contact sensing through container wall
- Analog output (0-3.3V)
- Waterproof and corrosion-resistant

#### Option B: Ultrasonic Water Level Sensor (JSN-SR04T)
- Waterproof ultrasonic sensor
- Measures distance to water surface
- Range: 25cm - 450cm

### 2.4 Water Pump
- Type: 5V DC submersible water pump
- Flow Rate: 80-120 L/hour
- Power: 2-3W
- Control: Via relay module (pump draws more current than ESP32 can provide)

### 2.5 Relay Module
- Type: 5V single-channel relay
- Control: 3.3V logic compatible
- Load: 10A @ 250VAC / 10A @ 30VDC
- Isolation: Optocoupler isolation for safety

### 2.6 OLED Display (SSD1306)
- Size: 0.96" diagonal
- Resolution: 128x64 pixels
- Interface: I2C (2 wires: SDA, SCL)
- Operating Voltage: 3.3V-5V
- Library: Adafruit SSD1306 or U8g2

### 2.7 Status LED
- Type: RGB LED or multi-color LED
- Colors:
  - Green: System ready (IDLE)
  - Blue: Dog detected / Dispensing
  - Red: Error or low water
  - Yellow: WiFi connecting

## 3. State Machine Design

### 3.1 System States
```
┌─────────────┐
│    IDLE     │ ◄─────────────────────┐
└─────────────┘                       │
      │                               │
      │ Dog Detected                  │
      ▼                               │
┌─────────────┐                       │
│  DETECTING  │                       │
└─────────────┘                       │
      │                               │
      │ Water Low                     │
      ▼                               │
┌─────────────┐                       │
│ DISPENSING  │                       │
└─────────────┘                       │
      │                               │
      │ Water Adequate OR             │
      │ Dog Left OR Timeout           │
      └───────────────────────────────┘
```

### 3.2 State Transitions

**IDLE → DETECTING**
- Condition: Ultrasonic sensor detects object within threshold distance (5-30cm)
- Action: Start monitoring water level

**DETECTING → DISPENSING**
- Condition: Water level below adequate threshold AND dog still present
- Action: Activate pump relay

**DISPENSING → IDLE**
- Conditions (any):
  - Water level reaches adequate threshold
  - Dog no longer detected
  - Timeout (10 seconds max)
  - Reservoir empty
- Action: Deactivate pump relay

## 4. Pin Configuration

```cpp
// Ultrasonic Sensor (Dog Detection)
#define TRIG_PIN 2
#define ECHO_PIN 3

// Water Level Sensor
#define WATER_LEVEL_PIN 4  // Analog input (ADC1_CH0)

// Pump Control
#define PUMP_RELAY_PIN 5

// Status LED (RGB)
#define LED_RED_PIN 13
#define LED_GREEN_PIN 12
#define LED_BLUE_PIN 14

// I2C OLED Display (SSD1306)
#define SDA_PIN 21  // Default I2C SDA
#define SCL_PIN 22  // Default I2C SCL
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1  // Reset pin (or -1 if sharing ESP32 reset)
```

## 5. Software Modules

### 5.1 Dog Detection Module
```cpp
class DogDetector {
  - readDistance(): float
  - isDogPresent(): bool
  - updateState(): void
  - DETECTION_THRESHOLD: 30cm
  - DETECTION_TIMEOUT: 2000ms
}
```

### 5.2 Water Level Module
```cpp
class WaterLevelSensor {
  - readLevel(): int (0-100%)
  - getState(): WaterState (EMPTY, LOW, ADEQUATE)
  - calibrate(): void
  - EMPTY_THRESHOLD: 20%
  - LOW_THRESHOLD: 50%
}
```

### 5.3 Pump Controller
```cpp
class PumpController {
  - start(): void
  - stop(): void
  - isRunning(): bool
  - getRuntime(): unsigned long
  - MAX_RUNTIME: 10000ms
}
```

### 5.4 Main Controller
```cpp
class DispenserController {
  - update(): void
  - setState(State): void
  - getState(): State
  - handleIdle(): void
  - handleDetecting(): void
  - handleDispensing(): void
}
```

### 5.5 Display Controller
```cpp
class DisplayController {
  - init(): void
  - update(): void
  - showStatus(state, waterLevel, dispenseCount): void
  - showError(errorMessage): void
  - showWiFiStatus(connected, ipAddress): void
  - clear(): void
}
```

### 5.6 Web Server Module
```cpp
class WebServer {
  - init(): void
  - handleRoot(): void
  - handleAPI(): void
  - handleManualDispense(): void
  - handleConfig(): void
  - serveJSON(data): void
}
```

## 6. Control Logic

### 6.1 Main Loop Pseudocode
```
void loop() {
  // Read sensors
  dogDistance = dogDetector.readDistance()
  waterLevel = waterLevelSensor.readLevel()
  
  // Update state machine
  switch (currentState) {
    case IDLE:
      if (dogDistance < DETECTION_THRESHOLD) {
        currentState = DETECTING
        detectionStartTime = millis()
      }
      break
      
    case DETECTING:
      if (dogDistance >= DETECTION_THRESHOLD) {
        currentState = IDLE
      } else if (waterLevel < LOW_THRESHOLD) {
        currentState = DISPENSING
        pumpController.start()
        dispensingStartTime = millis()
      }
      break
      
    case DISPENSING:
      if (waterLevel >= ADEQUATE_THRESHOLD ||
          dogDistance >= DETECTION_THRESHOLD ||
          (millis() - dispensingStartTime) > MAX_DISPENSE_TIME) {
        pumpController.stop()
        currentState = IDLE
      }
      break
  }
  
  delay(100)  // 100ms loop cycle
}
```

## 7. Safety Features

### 7.1 Timeout Protection
- Maximum pump runtime: 10 seconds per cycle
- Minimum time between dispense cycles: 5 seconds
- Emergency stop if continuous operation detected

### 7.2 Sensor Validation
- Ultrasonic reading validation (reject out-of-range values)
- Water level sensor sanity checks
- Fallback to safe state on sensor failure

### 7.3 Power Management
- Graceful shutdown on power loss (if battery backup available)
- State persistence using EEPROM for statistics

## 8. User Interface Design

### 8.1 OLED Display Layout
```
┌──────────────────────┐
│ Dog Water Dispenser  │  <- Title (line 1)
│ Status: IDLE         │  <- System state (line 2)
│ Water: 75%  [████▓▓] │  <- Water level bar (line 3-4)
│ Today: 12 dispenses  │  <- Daily count (line 5)
│ WiFi: 192.168.1.100  │  <- Network info (line 6)
│ ⏱ 14:32:15           │  <- Time/uptime (line 7)
└──────────────────────┘
```

**Display States:**
- IDLE: Green LED, "Status: IDLE"
- DETECTING: Blue LED, "Status: DOG DETECTED"
- DISPENSING: Blue LED blinking, "Status: DISPENSING..."
- ERROR: Red LED, "ERROR: [message]"

### 8.2 Web Dashboard Design

**Main Dashboard Page (/):**
```html
┌─────────────────────────────────────┐
│  🐕 Dog Water Dispenser Dashboard   │
├─────────────────────────────────────┤
│  Status: IDLE                       │
│  ● System Ready                     │
├─────────────────────────────────────┤
│  Real-Time Sensors                  │
│  Dog Distance: 45 cm                │
│  Water Level: 75% [████████▓▓]     │
├─────────────────────────────────────┤
│  Statistics (Today)                 │
│  Total Dispenses: 12                │
│  Last Dispense: 2:15 PM             │
│  Total Water: ~360ml                │
├─────────────────────────────────────┤
│  Manual Controls                    │
│  [Dispense Water] [Stop]            │
├─────────────────────────────────────┤
│  Configuration                      │
│  Detection Distance: [30] cm        │
│  Low Water Threshold: [50] %        │
│  [Save Settings]                    │
└─────────────────────────────────────┘
```

**API Endpoints:**
- `GET /` - Main dashboard HTML
- `GET /api/status` - JSON status data
- `GET /api/sensors` - Real-time sensor readings
- `POST /api/dispense` - Manual dispense trigger
- `POST /api/config` - Update configuration
- `GET /api/stats` - Daily/weekly statistics

## 9. Optional Features

### 9.1 MQTT Integration
- Connect to home WiFi network
- MQTT broker for status publishing
- Topics:
  - `dispenser/status` - System state
  - `dispenser/water_level` - Current water level
  - `dispenser/dog_detected` - Detection events
  - `dispenser/dispense_count` - Daily dispense counter

### 9.2 Advanced Data Logging
- Log dispense events with timestamps
- Track daily water consumption
- Store in SPIFFS or SD card

## 10. Testing Strategy

### 10.1 Unit Tests
- Test each sensor reading function independently
- Verify state transitions with mock sensor data
- Test pump control timing and safety limits

### 10.2 Integration Tests
- Test complete dispense cycle
- Verify sensor coordination
- Test edge cases (dog leaves during dispensing, etc.)

### 10.3 Hardware Tests
- Calibrate sensors with actual setup
- Test pump flow rate and timing
- Verify relay switching and isolation
- Test power consumption

## 11. Bill of Materials (BOM)

| Component | Quantity | Estimated Cost |
|-----------|----------|----------------|
| ESP32 DevKit | 1 | $8-12 |
| HC-SR04 Ultrasonic | 1 | $2-3 |
| Water Level Sensor | 1 | $3-5 |
| 5V Water Pump | 1 | $3-5 |
| 5V Relay Module | 1 | $2-3 |
| 0.96" OLED Display (I2C) | 1 | $4-6 |
| RGB LED | 1 | $1-2 |
| Resistors (220Ω for LED) | 3 | $1 |
| Power Supply (5V 2A) | 1 | $5-8 |
| Jumper Wires | Set | $3-5 |
| Breadboard/PCB | 1 | $3-10 |
| Water Container | 1 | $5-10 |
| Enclosure | 1 | $10-15 |
| **Total** | | **$50-87** |

## 12. Implementation Phases

### Phase 1: Basic Functionality
- Dog detection with ultrasonic sensor
- Water level monitoring
- Basic pump control
- State machine implementation
- OLED display integration

### Phase 2: User Interface
- WiFi connectivity setup
- Web server implementation
- Dashboard HTML/CSS/JavaScript
- Real-time data API endpoints

### Phase 3: Safety & Reliability
- Timeout protection
- Sensor validation
- Error handling
- Display error messages

### Phase 4: Enhancements (Optional)
- MQTT integration for home automation
- Advanced data logging
- Statistics tracking
- Configuration persistence
