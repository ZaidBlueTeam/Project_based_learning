const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const Joi = require('joi');

const app = express();

// Security: Restrict CORS to localhost only
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5500'],
    methods: ['GET', 'POST'],
    credentials: true
}));

app.use(express.json({ limit: '10mb' })); // Limit payload size

// Security: Rate limiting to prevent abuse
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter);

// SQL Server configuration (SECURE: using environment variables)
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER || 'localhost',
    database: process.env.DB_NAME || 'sonic_game',
    options: {
        encrypt: false, // Set to true for Azure SQL Database
        trustServerCertificate: true,
        enableArithAbort: true,
        connectionTimeout: 30000,
        requestTimeout: 30000,
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

// Input validation schemas
const progressSchema = Joi.object({
    level_name: Joi.string().valid('Test Zone Act 1', 'Test Zone Act 2', 'Test Zone Act 3').required(),
    lives: Joi.number().integer().min(0).max(99).required(),
    score: Joi.number().integer().min(0).required()
});

const levelParamSchema = Joi.object({
    level: Joi.string().valid('Test Zone Act 1', 'Test Zone Act 2', 'Test Zone Act 3').required()
});

// Connect to database
let poolPromise;

(async () => {
    try {
        poolPromise = new sql.ConnectionPool(config);
        await poolPromise.connect();
        console.log('✅ Connected to SQL Server');
    } catch (err) {
        console.error('❌ Database connection failed:', err.message);
        console.log('💡 Make sure:');
        console.log('   - SQL Server is running');
        console.log('   - Database credentials in .env are correct');
        console.log('   - Database exists (run setup_database.sql)');
        process.exit(1);
    }
})();

// API Routes with validation
app.get('/api/progress/:level', async (req, res) => {
    try {
        // Validate input
        const { error, value } = levelParamSchema.validate({ level: req.params.level });
        if (error) {
            return res.status(400).json({ error: 'Invalid level name' });
        }

        const pool = await poolPromise;
        const result = await pool.request()
            .input('levelName', sql.VarChar, value.level)
            .query('SELECT lives, score FROM player_progress WHERE level_name = @levelName');

        if (result.recordset.length > 0) {
            res.json(result.recordset[0]);
        } else {
            // Return default values if no progress exists
            res.json({ lives: 3, score: 0 });
        }
    } catch (error) {
        console.error('❌ Error loading progress:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/progress', async (req, res) => {
    try {
        // Validate input
        const { error, value } = progressSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: 'Invalid data: ' + error.details[0].message });
        }

        const { level_name, lives, score } = value;
        const pool = await poolPromise;

        // Use parameterized query to prevent SQL injection
        await pool.request()
            .input('levelName', sql.VarChar, level_name)
            .input('lives', sql.Int, lives)
            .input('score', sql.Int, score)
            .query(`
                MERGE player_progress AS target
                USING (SELECT @levelName as level_name, @lives as lives, @score as score) AS source
                ON target.level_name = source.level_name
                WHEN MATCHED THEN
                    UPDATE SET lives = source.lives, score = source.score, last_updated = GETDATE()
                WHEN NOT MATCHED THEN
                    INSERT (level_name, lives, score) VALUES (source.level_name, source.lives, source.score);
            `);

        res.json({ success: true, message: 'Progress saved successfully' });
    } catch (error) {
        console.error('❌ Error saving progress:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('🛑 Shutting down server...');
    if (poolPromise) {
        await poolPromise.close();
    }
    process.exit(0);
});

app.listen(3000, () => {
    console.log('🚀 Sonic Backend Server running on http://localhost:3000');
    console.log('📊 API Endpoints:');
    console.log('  GET  /api/progress/:level - Load progress');
    console.log('  POST /api/progress - Save progress');
});