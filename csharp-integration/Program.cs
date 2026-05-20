using System;
using System.Threading.Tasks;

namespace PetWaterMonitor
{
    /// <summary>
    /// Main program demonstrating C# integration with Pet Water Dispenser system
    /// </summary>
    class Program
    {
        static async Task Main(string[] args)
        {
            Console.WriteLine("===========================================");
            Console.WriteLine("  Pet Water Dispenser - C# Integration");
            Console.WriteLine("===========================================\n");
            
            var firebase = new FirebaseIntegration();
            
            // Subscribe to real-time updates
            Console.WriteLine("Subscribing to real-time updates...\n");
            
            firebase.OnDeviceDataChanged += (sender, data) =>
            {
                Console.WriteLine($"\n[REAL-TIME UPDATE]");
                Console.WriteLine($"  Tank Level: {data.TankLevel}%");
                Console.WriteLine($"  Bowl Level: {data.BowlLevel}%");
                Console.WriteLine($"  Pet Detected: {data.PetDetected}");
                Console.WriteLine($"  Dispensing: {data.Dispensing}");
                Console.WriteLine($"  Online: {data.IsOnline}");
                
                // Validate data
                firebase.ValidateSensorData(data);
            };
            
            firebase.OnControlCommandReceived += (sender, command) =>
            {
                Console.WriteLine($"\n[CONTROL COMMAND DETECTED] {command}");
            };
            
            firebase.SubscribeToDeviceData();
            firebase.SubscribeToControlCommands();
            
            // Main menu loop
            bool running = true;
            while (running)
            {
                Console.WriteLine("\n===========================================");
                Console.WriteLine("Select an option:");
                Console.WriteLine("1. Read current device data");
                Console.WriteLine("2. Start dispensing water");
                Console.WriteLine("3. Stop dispensing water");
                Console.WriteLine("4. View history");
                Console.WriteLine("5. Simulate hardware data (for testing)");
                Console.WriteLine("6. Check device connectivity");
                Console.WriteLine("7. Exit");
                Console.WriteLine("===========================================");
                Console.Write("Enter choice: ");
                
                var choice = Console.ReadLine();
                
                switch (choice)
                {
                    case "1":
                        await ReadDeviceData(firebase);
                        break;
                        
                    case "2":
                        await StartDispensing(firebase);
                        break;
                        
                    case "3":
                        await StopDispensing(firebase);
                        break;
                        
                    case "4":
                        await ViewHistory(firebase);
                        break;
                        
                    case "5":
                        await SimulateHardwareData(firebase);
                        break;
                        
                    case "6":
                        await CheckConnectivity(firebase);
                        break;
                        
                    case "7":
                        running = false;
                        Console.WriteLine("\nExiting...");
                        break;
                        
                    default:
                        Console.WriteLine("\nInvalid choice. Please try again.");
                        break;
                }
                
                if (running)
                {
                    Console.WriteLine("\nPress any key to continue...");
                    Console.ReadKey();
                }
            }
        }
        
        static async Task ReadDeviceData(FirebaseIntegration firebase)
        {
            Console.WriteLine("\n[Reading Device Data...]");
            var data = await firebase.GetDeviceDataAsync();
            
            if (data != null)
            {
                Console.WriteLine($"\nTank Level: {data.TankLevel}%");
                Console.WriteLine($"Bowl Level: {data.BowlLevel}%");
                Console.WriteLine($"Pet Detected: {data.PetDetected}");
                Console.WriteLine($"Dispensing: {data.Dispensing}");
                Console.WriteLine($"Online: {data.IsOnline}");
                Console.WriteLine($"Last Update: {data.LastUpdate}");
                
                firebase.ValidateSensorData(data);
            }
            else
            {
                Console.WriteLine("Failed to read device data.");
            }
        }
        
        static async Task StartDispensing(FirebaseIntegration firebase)
        {
            Console.WriteLine("\n[Sending Start Command...]");
            bool success = await firebase.StartDispensingAsync();
            
            if (success)
            {
                Console.WriteLine("✓ Start command sent successfully!");
                Console.WriteLine("Note: Pump will auto-stop after 5 seconds.");
            }
            else
            {
                Console.WriteLine("✗ Failed to send start command.");
            }
        }
        
        static async Task StopDispensing(FirebaseIntegration firebase)
        {
            Console.WriteLine("\n[Sending Stop Command...]");
            bool success = await firebase.StopDispensingAsync();
            
            if (success)
            {
                Console.WriteLine("✓ Stop command sent successfully!");
            }
            else
            {
                Console.WriteLine("✗ Failed to send stop command.");
            }
        }
        
        static async Task ViewHistory(FirebaseIntegration firebase)
        {
            Console.WriteLine("\n[Loading History...]");
            var history = await firebase.GetHistoryAsync();
            
            if (history.Count > 0)
            {
                Console.WriteLine($"\nTotal entries: {history.Count}");
                Console.WriteLine("\nLast 10 entries:");
                Console.WriteLine("----------------------------------------");
                
                var recentEntries = history.OrderByDescending(h => h.Timestamp).Take(10);
                
                foreach (var entry in recentEntries)
                {
                    // Convert timestamp to readable date
                    if (long.TryParse(entry.Timestamp, out long timestamp))
                    {
                        var date = DateTimeOffset.FromUnixTimeMilliseconds(timestamp).LocalDateTime;
                        Console.WriteLine($"{date:yyyy-MM-dd HH:mm:ss} - Tank Level: {entry.TankLevel}%");
                    }
                    else
                    {
                        Console.WriteLine($"{entry.Timestamp} - Tank Level: {entry.TankLevel}%");
                    }
                }
            }
            else
            {
                Console.WriteLine("No history data available.");
            }
        }
        
        static async Task SimulateHardwareData(FirebaseIntegration firebase)
        {
            Console.WriteLine("\n[Simulating Hardware Data]");
            Console.WriteLine("This will send fake sensor data to Firebase for testing.\n");
            
            Console.Write("Enter tank level (0-100): ");
            if (!int.TryParse(Console.ReadLine(), out int tankLevel))
            {
                tankLevel = 75;
            }
            
            Console.Write("Enter bowl level (0-100): ");
            if (!int.TryParse(Console.ReadLine(), out int bowlLevel))
            {
                bowlLevel = 50;
            }
            
            Console.Write("Pet detected? (y/n): ");
            bool petDetected = Console.ReadLine()?.ToLower() == "y";
            
            await firebase.SimulateHardwareDataAsync(tankLevel, bowlLevel, petDetected);
            Console.WriteLine("\n✓ Simulated data sent to Firebase!");
        }
        
        static async Task CheckConnectivity(FirebaseIntegration firebase)
        {
            Console.WriteLine("\n[Checking Device Connectivity...]");
            await firebase.MonitorDeviceConnectivityAsync();
        }
    }
}
