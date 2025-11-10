@echo off
echo 🚀 Sonic Game Database Setup
echo.

echo 📦 Installing backend dependencies...
cd sonic-backend
npm install
cd ..

echo.
echo 🗄️ Setting up database...
echo Please run the following SQL in SQL Server Management Studio:
echo.
type sonic-backend\setup_database.sql
echo.
echo Press any key after running the SQL script...
pause > nul

echo.
echo ⚙️ Configuring database connection...
echo Edit sonic-backend\server.js and update the SQL Server credentials if needed.
echo.
echo 🏃‍♂️ Starting backend server...
cd sonic-backend
start cmd /k "node server.js"
cd ..

echo.
echo 🎮 Opening game...
start index.html

echo.
echo ✅ Setup complete! The game should open in your browser.
echo 💡 Make sure SQL Server is running and the backend server started successfully.
pause