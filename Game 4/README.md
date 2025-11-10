# 🎮 Sonic Platformer with Database Persistence

A complete Sonic-themed 2D platformer game with **SQL Server database** for saving progress across levels!

## 🚀 Quick Start

### 1. Set Up SQL Server Database
```sql
-- Run this in SQL Server Management Studio
CREATE DATABASE sonic_game;
USE sonic_game;

CREATE TABLE player_progress (
    id INT IDENTITY(1,1) PRIMARY KEY,
    level_name VARCHAR(50) UNIQUE NOT NULL,
    lives INT DEFAULT 3,
    score INT DEFAULT 0,
    last_updated DATETIME DEFAULT GETDATE()
);

INSERT INTO player_progress (level_name, lives, score) VALUES
('Test Zone Act 1', 3, 0),
('Test Zone Act 2', 3, 0),
('Test Zone Act 3', 3, 0);
```

### 2. Configure Database Connection
Edit `sonic-backend/server.js`:
```javascript
const config = {
    user: 'sa',  // Your SQL Server username
    password: 'YourPassword123!',  // Your SQL Server password
    server: 'localhost',
    database: 'sonic_game',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};
```

### 3. Start the Backend
```bash
cd sonic-backend
npm install
node server.js
```

### 4. Play the Game
Open `index.html` in your browser!

## 🛠️ Automated Setup (Windows)

For Windows users, run the automated setup script:

```bash
setup.bat
```

This script will:
- Install backend dependencies
- Display the database setup SQL
- Start the backend server
- Open the game in your browser

## 📋 Manual Setup Steps

## 📊 Database Features

### **What Gets Saved:**
- ✅ **Lives** - Carry over between sessions
- ✅ **Score** - Persistent high scores
- ❌ **Rings** - Reset each level (as requested)

### **API Endpoints:**
- `GET /api/progress/:level` - Load progress
- `POST /api/progress` - Save progress

### **Database Schema:**
```sql
player_progress table:
- id (auto-increment)
- level_name (unique)
- lives (int, default 3)
- score (int, default 0)
- last_updated (datetime)
```

## 🎯 Game Features

### **Complete Sonic Experience:**
- 🏃‍♂️ **Full Movement**: Walk, run, jump, spindash
- 🎵 **Audio**: Background music, sound effects
- 🎨 **Animations**: Idle, walk, run, jump, hurt, death
- 💍 **Collectibles**: Rings with invincibility
- 👾 **Enemies**: AI patrol with collision detection
- 🏆 **Scoring**: Time bonus + ring bonus system
- 💾 **Persistence**: Lives & score saved to database

### **Technical Highlights:**
- 🎮 **60 FPS** smooth gameplay
- 📱 **Responsive** design
- 🔒 **No browser scrolling** interference
- 🎨 **Looped background** tiles
- 📊 **Real-time HUD** display

## 🛠️ Development Setup

### **Prerequisites:**
- SQL Server (Express or Developer Edition)
- Node.js & npm
- Modern web browser

### **Project Structure:**
```
Game 4/
├── index.html              # Main game page
├── css/styles.css          # Game styling
├── js/
│   ├── game.js            # Core game logic
│   └── utils.js           # Helper functions
├── sonic-backend/          # Database API
│   ├── server.js          # Express server
│   ├── setup_database.sql # DB schema
│   └── package.json       # Dependencies
└── images/                # Game assets
    ├── sonic_*.gif        # Character sprites
    ├── green_hill.gif     # Background
    └── TitleScreen.png    # Title screen
```

## 🎮 How to Play

### **Controls:**
- `A` - Move left
- `D` - Move right
- `SPACE` - Jump
- `S` - Crouch (hold for spindash charge)

### **Objective:**
- Collect rings for points and invincibility
- Avoid or defeat enemies
- Reach the goal post to complete the level
- Fast completion = higher score!

### **Scoring System:**
- **Time Bonus**: 50,000 - (frames × 10)
- **Ring Bonus**: Rings collected × 100
- **Total Score**: Displayed on HUD and saved

## 🔧 Customization

### **Add New Levels:**
1. Add entry to database: `INSERT INTO player_progress (level_name) VALUES ('New Level');`
2. Update game.js level loading logic
3. Modify enemy/platform placement

### **Adjust Scoring:**
Edit the scoring calculation in `game.js`:
```javascript
const timeBonus = Math.max(0, 50000 - this.timer * 10);
const ringBonus = this.player.rings * 100;
```

### **Database Connection:**
Update connection string in `sonic-backend/server.js` for different SQL Server instances.

## 🚀 Future Enhancements

- [ ] **Multiple Levels**: Test Zone Act 2 & Act 3
- [ ] **User Accounts**: Login system
- [ ] **Leaderboards**: Global high scores
- [ ] **Power-ups**: Shields, speed shoes
- [ ] **Boss Battles**: Final level encounters

## 📝 Learning Outcomes

This project demonstrates:
- **Full-Stack Development**: Frontend + Backend + Database
- **Game Development**: Physics, collision, animation systems
- **Database Integration**: CRUD operations with SQL Server
- **RESTful APIs**: Express.js server design
- **Modern JavaScript**: ES6+ features, async/await
- **Web Standards**: HTML5 Canvas, CSS Grid/Flexbox

## 🐛 Troubleshooting

### **Backend Won't Start:**
- Check SQL Server is running
- Verify connection credentials
- Ensure database exists

### **Progress Won't Save:**
- Check browser console for errors
- Verify backend is running on port 3000
- Check network tab for failed requests

### **Game Performance Issues:**
- Close other browser tabs
- Check browser developer tools for memory usage
- Ensure graphics drivers are up to date

---

**Enjoy your Sonic platformer adventure! 🦔⚡**