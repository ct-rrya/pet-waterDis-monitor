const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mqtt = require('mqtt');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

// MQTT Configuration
const MQTT_BROKER = process.env.MQTT_BROKER || 'mqtt://localhost:1883';
const mqttClient = mqtt.connect(MQTT_BROKER);

// Data storage
let deviceData = {
  tankLevel: 0,
  bowlLevel: 0,
  petDetected: false,
  isOnline: false,
  lastUpdate: null,
  dispensing: false
};

let waterHistory = [];

// MQTT Connection
mqttClient.on('connect', () => {
  console.log('Connected to MQTT broker');
  mqttClient.subscribe('dispenser/tank');
  mqttClient.subscribe('dispenser/bowl');
  mqttClient.subscribe('dispenser/pet');
  mqttClient.subscribe('dispenser/status');
});

mqttClient.on('message', (topic, message) => {
  const data = message.toString();
  const timestamp = new Date().toISOString();
  
  switch(topic) {
    case 'dispenser/tank':
      deviceData.tankLevel = parseInt(data);
      deviceData.lastUpdate = timestamp;
      waterHistory.push({ timestamp, tankLevel: deviceData.tankLevel });
      if (waterHistory.length > 100) waterHistory.shift();
      break;
    case 'dispenser/bowl':
      deviceData.bowlLevel = parseInt(data);
      break;
    case 'dispenser/pet':
      deviceData.petDetected = data === '1';
      break;
    case 'dispenser/status':
      deviceData.isOnline = data === 'online';
      break;
  }
  
  io.emit('deviceUpdate', deviceData);
});

// Socket.IO
io.on('connection', (socket) => {
  console.log('Client connected');
  socket.emit('deviceUpdate', deviceData);
  socket.emit('historyUpdate', waterHistory);
  
  socket.on('startDispensing', () => {
    mqttClient.publish('dispenser/control', 'start');
    deviceData.dispensing = true;
    io.emit('deviceUpdate', deviceData);
  });
  
  socket.on('stopDispensing', () => {
    mqttClient.publish('dispenser/control', 'stop');
    deviceData.dispensing = false;
    io.emit('deviceUpdate', deviceData);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// REST API
app.get('/api/status', (req, res) => {
  res.json(deviceData);
});

app.get('/api/history', (req, res) => {
  res.json(waterHistory);
});

app.post('/api/control', (req, res) => {
  const { action } = req.body;
  mqttClient.publish('dispenser/control', action);
  res.json({ success: true });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
