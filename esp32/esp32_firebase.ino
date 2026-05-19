#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"

// WiFi credentials
#define WIFI_SSID "YOUR_WIFI_SSID"
#define WIFI_PASSWORD "YOUR_WIFI_PASSWORD"

// Firebase credentials
#define API_KEY "YOUR_FIREBASE_API_KEY"
#define DATABASE_URL "YOUR_FIREBASE_DATABASE_URL"

// Sensor pins
#define TRIG_PIN_TANK 5
#define ECHO_PIN_TANK 18
#define TRIG_PIN_BOWL 19
#define ECHO_PIN_BOWL 21
#define IR_SENSOR_PIN 22
#define PUMP_PIN 23

// Firebase objects
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

unsigned long sendDataPrevMillis = 0;
bool signupOK = false;

void setup() {
  Serial.begin(115200);
  
  // Initialize pins
  pinMode(TRIG_PIN_TANK, OUTPUT);
  pinMode(ECHO_PIN_TANK, INPUT);
  pinMode(TRIG_PIN_BOWL, OUTPUT);
  pinMode(ECHO_PIN_BOWL, INPUT);
  pinMode(IR_SENSOR_PIN, INPUT);
  pinMode(PUMP_PIN, OUTPUT);
  digitalWrite(PUMP_PIN, LOW);
  
  // Connect to WiFi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  
  // Configure Firebase
  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;
  
  // Sign up (anonymous)
  if (Firebase.signUp(&config, &auth, "", "")) {
    Serial.println("Firebase signup OK");
    signupOK = true;
  } else {
    Serial.printf("Firebase signup failed: %s\n", config.signer.signupError.message.c_str());
  }
  
  config.token_status_callback = tokenStatusCallback;
  
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
}

int readUltrasonic(int trigPin, int echoPin) {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  
  long duration = pulseIn(echoPin, HIGH);
  int distance = duration * 0.034 / 2;
  
  return distance;
}

int calculateWaterLevel(int distance, int maxDistance) {
  int level = map(distance, 0, maxDistance, 100, 0);
  return constrain(level, 0, 100);
}

void loop() {
  if (Firebase.ready() && signupOK && (millis() - sendDataPrevMillis > 2000 || sendDataPrevMillis == 0)) {
    sendDataPrevMillis = millis();
    
    // Read sensors
    int tankDistance = readUltrasonic(TRIG_PIN_TANK, ECHO_PIN_TANK);
    int tankLevel = calculateWaterLevel(tankDistance, 30);
    
    int bowlDistance = readUltrasonic(TRIG_PIN_BOWL, ECHO_PIN_BOWL);
    int bowlLevel = calculateWaterLevel(bowlDistance, 10);
    
    int petDetected = digitalRead(IR_SENSOR_PIN) == LOW;
    
    // Update device data in Firebase
    if (Firebase.RTDB.setInt(&fbdo, "device/tankLevel", tankLevel)) {
      Serial.println("Tank level updated");
    } else {
      Serial.println("Failed to update tank level: " + fbdo.errorReason());
    }
    
    if (Firebase.RTDB.setInt(&fbdo, "device/bowlLevel", bowlLevel)) {
      Serial.println("Bowl level updated");
    }
    
    if (Firebase.RTDB.setBool(&fbdo, "device/petDetected", petDetected)) {
      Serial.println("Pet detection updated");
    }
    
    if (Firebase.RTDB.setBool(&fbdo, "device/isOnline", true)) {
      Serial.println("Online status updated");
    }
    
    if (Firebase.RTDB.setString(&fbdo, "device/lastUpdate", String(millis()))) {
      Serial.println("Last update timestamp set");
    }
    
    // Add to history
    String historyPath = "history/" + String(millis());
    FirebaseJson json;
    json.set("timestamp", String(millis()));
    json.set("tankLevel", tankLevel);
    
    if (Firebase.RTDB.setJSON(&fbdo, historyPath.c_str(), &json)) {
      Serial.println("History updated");
    }
    
    // Check for control commands
    if (Firebase.RTDB.getString(&fbdo, "control/command")) {
      String command = fbdo.stringData();
      
      if (command == "start") {
        digitalWrite(PUMP_PIN, HIGH);
        Firebase.RTDB.setBool(&fbdo, "device/dispensing", true);
        Serial.println("Pump started");
        
        // Auto-stop after 5 seconds
        delay(5000);
        digitalWrite(PUMP_PIN, LOW);
        Firebase.RTDB.setBool(&fbdo, "device/dispensing", false);
        Firebase.RTDB.setString(&fbdo, "control/command", "");
        Serial.println("Pump stopped");
      } else if (command == "stop") {
        digitalWrite(PUMP_PIN, LOW);
        Firebase.RTDB.setBool(&fbdo, "device/dispensing", false);
        Firebase.RTDB.setString(&fbdo, "control/command", "");
        Serial.println("Pump stopped manually");
      }
    }
  }
}
