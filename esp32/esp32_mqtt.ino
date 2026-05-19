#include <WiFi.h>
#include <PubSubClient.h>

// WiFi credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// MQTT Broker
const char* mqtt_server = "YOUR_MQTT_BROKER_IP";
const int mqtt_port = 1883;

// Pins
const int TRIG_PIN_TANK = 5;
const int ECHO_PIN_TANK = 18;
const int TRIG_PIN_BOWL = 19;
const int ECHO_PIN_BOWL = 21;
const int PIR_PIN = 22;
const int PUMP_PIN = 23;

WiFiClient espClient;
PubSubClient client(espClient);

long lastMsg = 0;
bool dispensing = false;

void setup() {
  Serial.begin(115200);
  
  pinMode(TRIG_PIN_TANK, OUTPUT);
  pinMode(ECHO_PIN_TANK, INPUT);
  pinMode(TRIG_PIN_BOWL, OUTPUT);
  pinMode(ECHO_PIN_BOWL, INPUT);
  pinMode(PIR_PIN, INPUT);
  pinMode(PUMP_PIN, OUTPUT);
  
  digitalWrite(PUMP_PIN, LOW);
  
  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
}

void setup_wifi() {
  delay(10);
  Serial.println("Connecting to WiFi...");
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("\nWiFi connected");
  Serial.println(WiFi.localIP());
}

void callback(char* topic, byte* payload, unsigned int length) {
  String message;
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  
  if (String(topic) == "dispenser/control") {
    if (message == "start") {
      dispensing = true;
      digitalWrite(PUMP_PIN, HIGH);
      Serial.println("Dispensing started");
    } else if (message == "stop") {
      dispensing = false;
      digitalWrite(PUMP_PIN, LOW);
      Serial.println("Dispensing stopped");
    }
  }
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect("ESP32Client")) {
      Serial.println("connected");
      client.subscribe("dispenser/control");
      client.publish("dispenser/status", "online");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" retrying in 5 seconds");
      delay(5000);
    }
  }
}

int getWaterLevel(int trigPin, int echoPin) {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  
  long duration = pulseIn(echoPin, HIGH);
  int distance = duration * 0.034 / 2;
  
  // Convert distance to percentage (adjust based on your tank height)
  int maxDistance = 30; // cm
  int level = map(distance, 0, maxDistance, 100, 0);
  level = constrain(level, 0, 100);
  
  return level;
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  
  long now = millis();
  if (now - lastMsg > 2000) {
    lastMsg = now;
    
    // Read tank level
    int tankLevel = getWaterLevel(TRIG_PIN_TANK, ECHO_PIN_TANK);
    client.publish("dispenser/tank", String(tankLevel).c_str());
    
    // Read bowl level
    int bowlLevel = getWaterLevel(TRIG_PIN_BOWL, ECHO_PIN_BOWL);
    client.publish("dispenser/bowl", String(bowlLevel).c_str());
    
    // Read pet detection
    int petDetected = digitalRead(PIR_PIN);
    client.publish("dispenser/pet", petDetected ? "1" : "0");
    
    Serial.printf("Tank: %d%%, Bowl: %d%%, Pet: %s\n", 
                  tankLevel, bowlLevel, petDetected ? "Yes" : "No");
  }
}
