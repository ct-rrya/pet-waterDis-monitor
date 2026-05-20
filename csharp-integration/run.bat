@echo off
echo ============================================
echo   Pet Water Dispenser - C# Integration
echo ============================================
echo.

REM Check if .NET is installed
dotnet --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: .NET SDK is not installed!
    echo.
    echo Please download and install .NET 6.0 or higher from:
    echo https://dotnet.microsoft.com/download
    echo.
    pause
    exit /b 1
)

echo .NET SDK detected: 
dotnet --version
echo.

REM Restore packages if needed
if not exist "bin\" (
    echo Restoring NuGet packages...
    dotnet restore
    echo.
)

REM Build and run
echo Building and running application...
echo.
dotnet run

pause
