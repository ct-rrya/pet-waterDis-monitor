# Tasks: Dog Water Dispenser IoT Project

## Phase 1: Hardware Setup & Basic Sensor Testing

- [ ] 1. Setup ESP32 Development Environment
  - [ ] 1.1 Install Arduino IDE or PlatformIO
  - [ ] 1.2 Install ESP32 board support
  - [ ] 1.3 Test basic LED blink program on ESP32
  - [ ] 1.4 Verify USB connection and serial monitor

- [ ] 2. Ultrasonic Sensor Integration (Dog Detection)
  - [ ] 2.1 Wire HC-SR04 to ESP32 (Trig: GPIO2, Echo: GPIO3 with voltage divider)
  - [ ] 2.2 Implement distance measurement function
  - [ ] 2.3 Test and calibrate detection range (5-30cm threshold)
  - [ ] 2.4 Add filtering to reduce false positives

- [ ] 3. Water Level Sensor Integration
  - [ ] 3.1 Wire water level sensor to ESP32 (Analog pin GPIO4)
  - [ ] 3.2 Implement water level reading function
  - [ ] 3.3 Calibrate sensor (empty, low, adequate thresholds)
  - [ ] 3.4 Test with actual water container

- [ ] 4. Pump Control Setup
  - [ ] 4.1 Wire relay module to ESP32 (Control: GPIO5)
  - [ ] 4.2 Connect water pump to relay
  - [ ] 4.3 Implement pump on/off control functions
  - [ ] 4.4 Test pump operation and flow rate

- [ ] 5. OLED Display Integration
  - [ ] 5.1 Wire 0.96" OLED display to ESP32 (I2C: SDA=GPIO21, SCL=GPIO22)
  - [ ] 5.2 Install Adafruit SSD1306 library
  - [ ] 5.3 Implement DisplayController class with basic text display
  - [ ] 5.4 Test display with status messages and water level bar

- [ ] 6. Status LED Setup
  - [ ] 6.1 Wire RGB LED to ESP32 (R=GPIO13, G=GPIO12, B=GPIO14)
  - [ ] 6.2 Implement LED control functions for different states
  - [ ] 6.3 Test LED color changes for each system state
  - [ ] 6.4 Add LED blinking for dispensing state

## Phase 2: Core Software Implementation

- [ ] 7. Create Sensor Classes
  - [ ] 7.1 Implement DogDetector class with distance reading and presence detection
  - [ ] 7.2 Implement WaterLevelSensor class with level reading and state determination
  - [ ] 7.3 Implement PumpController class with start/stop and runtime tracking
  - [ ] 7.4 Add unit tests for each class

- [ ] 8. Implement State Machine
  - [ ] 8.1 Define system states (IDLE, DETECTING, DISPENSING)
  - [ ] 8.2 Implement DispenserController class
  - [ ] 8.3 Implement state transition logic
  - [ ] 8.4 Add state change logging for debugging

- [ ] 9. Implement Main Control Loop
  - [ ] 9.1 Initialize all sensors and controllers in setup()
  - [ ] 9.2 Implement main loop with sensor reading
  - [ ] 9.3 Integrate state machine updates
  - [ ] 9.4 Add serial output for monitoring

- [ ] 10. Integrate Display Updates
  - [ ] 10.1 Update OLED display with current state in main loop
  - [ ] 10.2 Show water level percentage and bar graph
  - [ ] 10.3 Display daily dispense counter
  - [ ] 10.4 Add error message display functionality

## Phase 3: WiFi & Web Dashboard

- [ ] 11. WiFi Connectivity Setup
  - [ ] 11.1 Implement WiFi connection with credentials
  - [ ] 11.2 Add WiFi status display on OLED (IP address)
  - [ ] 11.3 Implement reconnection logic
  - [ ] 11.4 Test connection stability

- [ ] 12. Web Server Implementation
  - [ ] 12.1 Install and configure ESP32 WebServer library
  - [ ] 12.2 Implement basic web server with root handler
  - [ ] 12.3 Create HTML/CSS dashboard interface
  - [ ] 12.4 Add JavaScript for auto-refresh functionality

- [ ] 13. Web Dashboard API Endpoints
  - [ ] 13.1 Implement /api/status endpoint (JSON status data)
  - [ ] 13.2 Implement /api/sensors endpoint (real-time readings)
  - [ ] 13.3 Implement /api/stats endpoint (daily statistics)
  - [ ] 13.4 Add CORS headers for API access

- [ ] 14. Manual Control Features
  - [ ] 14.1 Implement /api/dispense POST endpoint for manual trigger
  - [ ] 14.2 Implement /api/config POST endpoint for settings
  - [ ] 14.3 Add safety checks for manual dispense
  - [ ] 14.4 Test manual controls from web dashboard

## Phase 4: Safety & Reliability Features

- [ ] 15. Add Safety Protections
  - [ ] 15.1 Implement maximum pump runtime limit (10 seconds)
  - [ ] 15.2 Add minimum time between dispense cycles (5 seconds)
  - [ ] 15.3 Implement sensor validation and error handling
  - [ ] 15.4 Add emergency stop functionality

- [ ] 16. Implement Error Handling
  - [ ] 16.1 Handle ultrasonic sensor timeout/invalid readings
  - [ ] 16.2 Handle water level sensor failures
  - [ ] 16.3 Implement safe fallback state on errors
  - [ ] 16.4 Display errors on OLED and web dashboard

- [ ] 17. Testing & Calibration
  - [ ] 17.1 Test complete dispense cycle with actual dog
  - [ ] 17.2 Test edge cases (dog leaves during dispensing, etc.)
  - [ ] 17.3 Verify timeout protections work correctly
  - [ ] 17.4 Fine-tune sensor thresholds based on testing

## Phase 5: Optional Advanced Features

- [ ]* 18. MQTT Integration
  - [ ]* 18.1 Install and configure MQTT library
  - [ ]* 18.2 Implement MQTT client connection
  - [ ]* 18.3 Publish system status to topics
  - [ ]* 18.4 Publish sensor readings and events

- [ ]* 19. Advanced Data Logging
  - [ ]* 19.1 Implement SPIFFS or SD card storage
  - [ ]* 19.2 Log dispense events with timestamps
  - [ ]* 19.3 Track daily/weekly water consumption statistics
  - [ ]* 19.4 Add log viewing interface on web dashboard

- [ ]* 20. Configuration Persistence
  - [ ]* 20.1 Save configuration to EEPROM/SPIFFS
  - [ ]* 20.2 Load configuration on startup
  - [ ]* 20.3 Add factory reset functionality
  - [ ]* 20.4 Implement WiFi credential management

## Phase 6: Physical Assembly & Deployment

- [ ] 21. Physical Assembly
  - [ ] 21.1 Design and build enclosure for electronics
  - [ ] 21.2 Mount sensors in appropriate positions
  - [ ] 21.3 Install pump and water reservoir
  - [ ] 21.4 Ensure waterproofing of electrical components

- [ ] 22. Final Testing & Deployment
  - [ ] 22.1 Test complete system in target location
  - [ ] 22.2 Monitor for 24 hours and adjust as needed
  - [ ] 22.3 Document any issues and fixes
  - [ ] 22.4 Create user manual for maintenance

## Notes
- Tasks marked with * are optional advanced features
- Phases 1-4 provide a fully functional system with local display and web dashboard
- Phase 5 adds optional MQTT and advanced logging
- Phase 6 is the physical build and deployment
- WiFi and web dashboard are now core features (not optional)
