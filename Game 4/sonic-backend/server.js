const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// SQL Server configuration (using local SQL Server)
const config = {
    user: 'sa',  // Default SQL Server user
    password: 'YourPassword123!',  // Change this to your actual password
    server: 'localhost',
    database: 'sonic_game',
    options: {
        encrypt: false,  // Set to true if using Azure SQL
        trustServerCertificate: true
    }
};

// Connect to database
sql.connect(config).then(() => {
    console.log('✅ Connected to SQL Server');
}).catch(err => {
    console.error('❌ Database connection failed:', err);
    console.log('💡 Make sure SQL Server is running and the database exists');
});

// API Routes
app.get('/api/progress/:level', async (req, res) => {
    try {
        const { level } = req.params;
        const result = await sql.query`SELECT * FROM player_progress WHERE level_name = ${level}`;

        if (result.recordset.length > 0) {
            res.json(result.recordset[0]);
        } else {
            // Return default values if no progress exists
            res.json({ lives: 3, score: 0 });
        }
    } catch (error) {
        console.error('Error loading progress:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/progress', async (req, res) => {
    try {
        const { level_name, lives, score } = req.body;

        await sql.query`
            MERGE player_progress AS target
            USING (SELECT ${level_name} as level_name, ${lives} as lives, ${score} as score) AS source
            ON target.level_name = source.level_name
            WHEN MATCHED THEN
                UPDATE SET lives = source.lives, score = source.score, last_updated = GETDATE()
            WHEN NOT MATCHED THEN
                INSERT (level_name, lives, score) VALUES (source.level_name, source.lives, source.score);
        `;

        res.json({ success: true });
    } catch (error) {
        console.error('Error saving progress:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log('🚀 Sonic Backend Server running on http://localhost:3000');
    console.log('📊 API Endpoints:');
    console.log('  GET  /api/progress/:level - Load progress');
    console.log('  POST /api/progress - Save progress');
});