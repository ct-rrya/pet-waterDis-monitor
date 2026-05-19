# Firebase Setup Instructions

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `pet-water-dispenser`
4. Disable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Realtime Database

1. In Firebase Console, click "Realtime Database" in the left menu
2. Click "Create Database"
3. Choose location (closest to you)
4. Start in **Test mode** (for development)
5. Click "Enable"

## Step 3: Get Firebase Configuration

1. Click the gear icon ⚙️ > "Project settings"
2. Scroll down to "Your apps"
3. Click the web icon `</>`
4. Register app name: `pet-water-dispenser-web`
5. Copy the `firebaseConfig` object

## Step 4: Update Frontend Configuration

Open `frontend/src/firebase.js` and replace with your config:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "pet-water-dispenser.firebaseapp.com",
  databaseURL: "https://pet-water-dispenser-default-rtdb.firebaseio.com",
  projectId: "pet-water-dispenser",
  storageBucket: "pet-water-dispenser.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

## Step 5: Setup ESP32 Firebase Library

1. Open Arduino IDE
2. Go to **Sketch** > **Include Library** > **Manage Libraries**
3. Search for "Firebase ESP Client"
4. Install **Firebase Arduino Client Library for ESP8266 and ESP32** by Mobizt
5. Restart Arduino IDE

## Step 6: Update ESP32 Code

Open `esp32/esp32_firebase.ino` and update:

```cpp
#define WIFI_SSID "Your_WiFi_Name"
#define WIFI_PASSWORD "Your_WiFi_Password"
#define API_KEY "Your_Firebase_API_Key"
#define DATABASE_URL "https://your-project-default-rtdb.firebaseio.com"
```

## Step 7: Firebase Database Structure

Your database will have this structure:

```
pet-water-dispenser/
├── device/
│   ├── tankLevel: 75
│   ├── bowlLevel: 50
│   ├── petDetected: false
│   ├── isOnline: true
│   ├── lastUpdate: "2025-01-20T10:30:00"
│   └── dispensing: false
├── control/
│   └── command: "start" or "stop"
└── history/
    ├── 1234567890/
    │   ├── timestamp: "2025-01-20T10:30:00"
    │   └── tankLevel: 75
    └── 1234567891/
        ├── timestamp: "2025-01-20T10:32:00"
        └── tankLevel: 73
```

## Step 8: Set Firebase Security Rules (Important!)

In Firebase Console > Realtime Database > Rules, set:

**For Development (Open Access):**
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

**For Production (Recommended):**
```json
{
  "rules": {
    "device": {
      ".read": true,
      ".write": true
    },
    "control": {
      ".read": true,
      ".write": true
    },
    "history": {
      ".read": true,
      ".write": true
    }
  }
}
```

## Step 9: Deploy Frontend to Firebase Hosting

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase in your project:
```bash
cd frontend
firebase init hosting
```

4. Select your Firebase project
5. Set public directory: `dist`
6. Configure as single-page app: `Yes`
7. Don't overwrite index.html: `No`

8. Build and deploy:
```bash
npm run build
firebase deploy
```

## Step 10: Test the System

1. Upload code to ESP32
2. Open Serial Monitor (115200 baud)
3. ESP32 should connect to WiFi and Firebase
4. Open your Firebase Hosting URL
5. You should see real-time data updating!

## Troubleshooting

### ESP32 won't connect to Firebase
- Check WiFi credentials
- Verify Firebase API key and Database URL
- Make sure Firebase library is installed correctly

### Frontend shows no data
- Check Firebase configuration in `firebase.js`
- Open browser console for errors
- Verify Firebase Realtime Database rules allow read access

### Data not updating
- Check ESP32 Serial Monitor for errors
- Verify Firebase Database URL is correct
- Check internet connection

## Cost

Firebase Free Tier includes:
- **Realtime Database:** 1GB storage, 10GB/month download
- **Hosting:** 10GB storage, 360MB/day transfer
- **More than enough for this IoT project!**

---

**Next Steps:**
1. Complete Firebase setup
2. Update configuration files
3. Upload ESP32 code
4. Deploy frontend
5. Test the system!
