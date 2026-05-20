using System;
using System.Threading.Tasks;
using FirebaseAdmin;
using FirebaseAdmin.Auth;
using Google.Apis.Auth.OAuth2;
using Firebase.Database;
using Firebase.Database.Query;
using Newtonsoft.Json;

namespace PetWaterMonitor
{
    /// <summary>
    /// C# Integration layer for Pet Water Dispenser
    /// Provides bidirectional communication between hardware (ESP32) and software (Web App)
    /// via Firebase Realtime Database
    /// </summary>
    public class FirebaseIntegration
    {
        private readonly FirebaseClient _firebaseClient;
        private const string FIREBASE_URL = "https://water-dispenser-7e6e9-default-rtdb.firebaseio.com/";
        
        // Data models
        public class DeviceData
        {
            [JsonProperty("tankLevel")]
            public int TankLevel { get; set; }
            
            [JsonProperty("bowlLevel")]
            public int BowlLevel { get; set; }
            
            [JsonProperty("petDetected")]
            public bool PetDetected { get; set; }
            
            [JsonProperty("isOnline")]
            public bool IsOnline { get; set; }
            
            [JsonProperty("lastUpdate")]
            public string LastUpdate { get; set; }
            
            [JsonProperty("dispensing")]
            public bool Dispensing { get; set; }
        }
        
        public class HistoryEntry
        {
            [JsonProperty("timestamp")]
            public string Timestamp { get; set; }
            
            [JsonProperty("tankLevel")]
            public int TankLevel { get; set; }
        }
        
        public class ControlCommand
        {
            [JsonProperty("command")]
            public string Command { get; set; }
        }
        
        // Events for real-time updates
        public event EventHandler<DeviceData> OnDeviceDataChanged;
        public event EventHandler<HistoryEntry> OnHistoryAdded;
        public event EventHandler<string> OnControlCommandReceived;
        
        public FirebaseIntegration()
        {
            _firebaseClient = new FirebaseClient(FIREBASE_URL);
        }
        
        #region Read Operations (Hardware → Software)
        
        /// <summary>
        /// Get current device data from Firebase
        /// </summary>
        public async Task<DeviceData> GetDeviceDataAsync()
        {
            try
            {
                var deviceData = await _firebaseClient
                    .Child("device")
                    .OnceSingleAsync<DeviceData>();
                    
                return deviceData;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error reading device data: {ex.Message}");
                return null;
            }
        }
        
        /// <summary>
        /// Subscribe to real-time device data updates
        /// </summary>
        public void SubscribeToDeviceData()
        {
            _firebaseClient
                .Child("device")
                .AsObservable<DeviceData>()
                .Subscribe(data =>
                {
                    if (data.Object != null)
                    {
                        Console.WriteLine($"[Device Update] Tank: {data.Object.TankLevel}%, Bowl: {data.Object.BowlLevel}%, Pet: {data.Object.PetDetected}");
                        OnDeviceDataChanged?.Invoke(this, data.Object);
                    }
                });
        }
        
        /// <summary>
        /// Get all history entries
        /// </summary>
        public async Task<List<HistoryEntry>> GetHistoryAsync()
        {
            try
            {
                var history = await _firebaseClient
                    .Child("history")
                    .OnceAsync<HistoryEntry>();
                    
                return history.Select(h => h.Object).ToList();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error reading history: {ex.Message}");
                return new List<HistoryEntry>();
            }
        }
        
        /// <summary>
        /// Subscribe to real-time history updates
        /// </summary>
        public void SubscribeToHistory()
        {
            _firebaseClient
                .Child("history")
                .AsObservable<HistoryEntry>()
                .Subscribe(entry =>
                {
                    if (entry.Object != null)
                    {
                        Console.WriteLine($"[History Added] Time: {entry.Object.Timestamp}, Level: {entry.Object.TankLevel}%");
                        OnHistoryAdded?.Invoke(this, entry.Object);
                    }
                });
        }
        
        #endregion
        
        #region Write Operations (Software → Hardware)
        
        /// <summary>
        /// Send command to start water dispensing
        /// </summary>
        public async Task<bool> StartDispensingAsync()
        {
            try
            {
                await _firebaseClient
                    .Child("control")
                    .Child("command")
                    .PutAsync("\"start\"");
                    
                Console.WriteLine("[Command Sent] Start dispensing");
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending start command: {ex.Message}");
                return false;
            }
        }
        
        /// <summary>
        /// Send command to stop water dispensing
        /// </summary>
        public async Task<bool> StopDispensingAsync()
        {
            try
            {
                await _firebaseClient
                    .Child("control")
                    .Child("command")
                    .PutAsync("\"stop\"");
                    
                Console.WriteLine("[Command Sent] Stop dispensing");
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending stop command: {ex.Message}");
                return false;
            }
        }
        
        /// <summary>
        /// Subscribe to control command changes (monitor what web app sends)
        /// </summary>
        public void SubscribeToControlCommands()
        {
            _firebaseClient
                .Child("control")
                .Child("command")
                .AsObservable<string>()
                .Subscribe(command =>
                {
                    if (!string.IsNullOrEmpty(command.Object))
                    {
                        Console.WriteLine($"[Control Command] {command.Object}");
                        OnControlCommandReceived?.Invoke(this, command.Object);
                    }
                });
        }
        
        #endregion
        
        #region Simulated Hardware Operations (For Testing)
        
        /// <summary>
        /// Simulate ESP32 sending sensor data to Firebase
        /// Useful for testing without physical hardware
        /// </summary>
        public async Task SimulateHardwareDataAsync(int tankLevel, int bowlLevel, bool petDetected)
        {
            try
            {
                var deviceData = new DeviceData
                {
                    TankLevel = tankLevel,
                    BowlLevel = bowlLevel,
                    PetDetected = petDetected,
                    IsOnline = true,
                    LastUpdate = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds().ToString(),
                    Dispensing = false
                };
                
                await _firebaseClient
                    .Child("device")
                    .PutAsync(deviceData);
                    
                // Add to history
                var historyEntry = new HistoryEntry
                {
                    Timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds().ToString(),
                    TankLevel = tankLevel
                };
                
                await _firebaseClient
                    .Child("history")
                    .Child(DateTimeOffset.UtcNow.ToUnixTimeMilliseconds().ToString())
                    .PutAsync(historyEntry);
                    
                Console.WriteLine($"[Simulated Data] Tank: {tankLevel}%, Bowl: {bowlLevel}%, Pet: {petDetected}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error simulating hardware data: {ex.Message}");
            }
        }
        
        /// <summary>
        /// Simulate hardware going offline
        /// </summary>
        public async Task SimulateHardwareOfflineAsync()
        {
            try
            {
                await _firebaseClient
                    .Child("device")
                    .Child("isOnline")
                    .PutAsync(false);
                    
                Console.WriteLine("[Simulated] Hardware offline");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error simulating offline: {ex.Message}");
            }
        }
        
        #endregion
        
        #region Data Validation & Monitoring
        
        /// <summary>
        /// Validate sensor readings and alert if anomalies detected
        /// </summary>
        public bool ValidateSensorData(DeviceData data)
        {
            bool isValid = true;
            
            // Check if tank level is in valid range
            if (data.TankLevel < 0 || data.TankLevel > 100)
            {
                Console.WriteLine($"[WARNING] Invalid tank level: {data.TankLevel}%");
                isValid = false;
            }
            
            // Check if bowl level is in valid range
            if (data.BowlLevel < 0 || data.BowlLevel > 100)
            {
                Console.WriteLine($"[WARNING] Invalid bowl level: {data.BowlLevel}%");
                isValid = false;
            }
            
            // Alert if tank is low
            if (data.TankLevel < 20)
            {
                Console.WriteLine($"[ALERT] Tank level low: {data.TankLevel}%");
            }
            
            // Alert if bowl is low
            if (data.BowlLevel < 30)
            {
                Console.WriteLine($"[ALERT] Bowl level low: {data.BowlLevel}%");
            }
            
            return isValid;
        }
        
        /// <summary>
        /// Monitor device connectivity
        /// </summary>
        public async Task MonitorDeviceConnectivityAsync()
        {
            var data = await GetDeviceDataAsync();
            
            if (data == null || !data.IsOnline)
            {
                Console.WriteLine("[ERROR] Device is offline or unreachable!");
            }
            else
            {
                Console.WriteLine("[OK] Device is online");
            }
        }
        
        #endregion
    }
}
