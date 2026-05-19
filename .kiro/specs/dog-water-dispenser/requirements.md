# Requirements: Dog Water Dispenser IoT Project

## 1. Overview
An ESP32-based automatic dog water dispenser that detects when a dog approaches and ensures fresh water is available by monitoring water levels and dispensing water automatically.

## 2. User Stories

### 2.1 Dog Presence Detection
As a pet owner, I want the system to detect when my dog approaches the water dispenser so that it can prepare to dispense water automatically.

### 2.2 Water Level Monitoring
As a pet owner, I want the system to monitor the water level in the cup so that it knows when to refill and prevent overflow.

### 2.3 Automatic Water Dispensing
As a pet owner, I want the system to automatically dispense water when the dog is present and the water level is low so that my dog always has fresh water available.

### 2.4 System Status Monitoring
As a pet owner, I want to know the system status (water reservoir level, sensor readings, dispensing events) so that I can maintain the system properly.

### 2.5 Local Display Interface
As a pet owner, I want to see the current system status on a local display without needing my phone so that I can quickly check the dispenser at a glance.

### 2.6 Web Dashboard Access
As a pet owner, I want to access a web dashboard from any device on my home network so that I can view detailed statistics, configure settings, and manually control the dispenser.

## 3. Acceptance Criteria

### 3.1 Dog Detection
- The ultrasonic sensor shall detect a dog's presence within 5-30cm range
- Detection shall trigger within 500ms of the dog approaching
- False positives shall be minimized through distance threshold filtering
- The system shall maintain detection state for at least 2 seconds to avoid flickering

### 3.2 Water Level Sensing
- The system shall accurately detect water level in the cup (empty, low, adequate, full)
- Water level readings shall be taken every 1 second
- The system shall distinguish between at least 3 water level states: empty (<20%), low (20-50%), adequate (>50%)

### 3.3 Water Dispensing Logic
- Water shall be dispensed only when:
  - Dog is detected in front of the dispenser
  - Water level is below adequate threshold
  - Reservoir has sufficient water
- Dispensing shall stop when water reaches adequate level or dog moves away
- Maximum dispensing time shall be limited to 10 seconds to prevent overflow

### 3.4 Hardware Components
- ESP32 development board (ESP32-DevKitC or similar)
- HC-SR04 ultrasonic sensor or equivalent for dog detection
- Water level sensor (capacitive or ultrasonic) for cup monitoring
- Water pump (5V DC submersible pump) or solenoid valve for dispensing
- Relay module for pump control
- 0.96" OLED display (I2C, SSD1306) for local status display
- Status LED (RGB or multi-color) for quick visual feedback
- Power supply (5V/12V depending on pump requirements)

### 3.5 Safety & Reliability
- The system shall have timeout protection to prevent continuous pumping
- The system shall detect low reservoir water and stop dispensing
- All electrical components shall be isolated from water contact
- The system shall recover gracefully from sensor failures

### 3.6 Local Display Requirements
- OLED display shall show current system state (IDLE, DETECTING, DISPENSING)
- Display shall show water level percentage
- Display shall show today's dispense count
- Display shall show WiFi connection status
- Display shall update at least once per second
- Display shall show error messages when system faults occur

### 3.7 Web Dashboard Requirements
- Web dashboard shall be accessible via ESP32's local IP address
- Dashboard shall display real-time sensor readings (dog distance, water level)
- Dashboard shall show current system state and status
- Dashboard shall display statistics (total dispenses today, last dispense time)
- Dashboard shall provide manual pump control button for testing
- Dashboard shall allow configuration of thresholds (detection distance, water levels)
- Dashboard shall work on mobile phones, tablets, and computers
- Dashboard shall auto-refresh data every 2-5 seconds

### 3.8 WiFi Connectivity
- WiFi connectivity for web dashboard access
- System shall attempt to reconnect if WiFi connection is lost
- System shall function in standalone mode if WiFi is unavailable
- WiFi credentials shall be configurable via web interface or code

## 4. Technical Constraints

### 4.1 Hardware
- ESP32 microcontroller with sufficient GPIO pins for all sensors and actuators
- Operating voltage: 3.3V logic (ESP32) with 5V/12V power for pump
- Sensors must be waterproof or properly isolated

### 4.2 Software
- Arduino framework or ESP-IDF for development
- Real-time sensor reading and response
- Non-blocking code architecture for concurrent sensor monitoring

### 4.3 Power
- Continuous power supply required (wall adapter recommended)
- Optional: Battery backup for status preservation during power outages

## 5. Out of Scope (for initial version)
- Native mobile app development (web dashboard works on mobile browsers)
- MQTT integration for external home automation
- Machine learning for dog identification
- Multiple dispensing stations
- Automatic reservoir refilling from main water supply
- Food dispensing functionality
- Cloud connectivity and remote access from outside home network
