# 🔒 Sonic Game Backend - SECURE Setup

## 🚨 SECURITY NOTICE

**This backend contains sensitive database credentials. NEVER commit the `.env` file or expose credentials in your code!**

If you've accidentally committed sensitive data to git, you MUST remove it from history immediately.

## 📋 Prerequisites

- Node.js (v16 or higher)
- SQL Server (Express, Developer, or Enterprise edition)
- Database: `sonic_game` (created via `setup_database.sql`)

## 🔐 Secure Setup

### 1. Environment Variables

Copy the example file and configure your credentials:

```bash
cp .env.example .env
```

Edit `.env` with your actual database credentials:

```env
DB_USER=sa
DB_PASSWORD=YourActualSecurePassword!
DB_SERVER=localhost
DB_NAME=sonic_game
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

Run `setup_database.sql` in SQL Server Management Studio to create the database and tables.

### 4. Create Secure Database User (Recommended)

Instead of using 'sa', create a dedicated user with minimal permissions:

```sql
-- In SQL Server Management Studio
CREATE LOGIN sonic_app WITH PASSWORD = 'StrongPassword123!';
CREATE USER sonic_app FOR LOGIN sonic_app;
GRANT SELECT, INSERT, UPDATE ON player_progress TO sonic_app;
```

Then update your `.env`:
```env
DB_USER=sonic_app
DB_PASSWORD=StrongPassword123!
```

## 🚀 Running the Server

```bash
# Development
npm start

# Production (with PM2)
npm install -g pm2
pm2 start server.js --name "sonic-backend"
```

## 🔒 Security Features

- ✅ **Environment Variables**: No hardcoded credentials
- ✅ **Input Validation**: Joi schema validation prevents malicious data
- ✅ **Rate Limiting**: Prevents abuse (100 requests per 15 minutes per IP)
- ✅ **CORS Protection**: Only allows localhost origins
- ✅ **SQL Injection Prevention**: Parameterized queries
- ✅ **Connection Pooling**: Efficient database connections
- ✅ **Error Handling**: No sensitive data leaked in errors

## 📡 API Endpoints

```
GET  /api/health           - Health check
GET  /api/progress/:level  - Load progress for a level
POST /api/progress         - Save progress
```

### Request/Response Examples

**Load Progress:**
```bash
GET /api/progress/Test%20Zone%20Act%201
Response: {"lives": 3, "score": 12500}
```

**Save Progress:**
```bash
POST /api/progress
Content-Type: application/json

{
  "level_name": "Test Zone Act 1",
  "lives": 2,
  "score": 15000
}
```

## 🛡️ Production Deployment

For production deployment:

1. **Use HTTPS** (SSL/TLS certificates)
2. **Set up a reverse proxy** (nginx)
3. **Configure firewall** rules
4. **Use environment-specific configs**
5. **Enable SQL Server encryption** (`encrypt: true`)
6. **Regular security updates**

## 🚨 Emergency: Remove Exposed Credentials

If you've accidentally committed credentials to git:

```bash
# Option 1: Remove from history (nuclear option)
git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch sonic-backend/server.js' --prune-empty --tag-name-filter cat -- --all

# Option 2: Use BFG Repo-Cleaner
# Download: https://rtyley.github.io/bfg-repo-cleaner/
java -jar bfg.jar --delete-files server.js your-repo.git

# Force push (⚠️  THIS REWRITES HISTORY)
git push origin --force --all
```

## 📞 Troubleshooting

- **"Database connection failed"**: Check `.env` credentials and SQL Server status
- **"Module not found"**: Run `npm install`
- **"CORS error"**: Make sure your frontend is running on localhost:3000 or 5500
- **Rate limited**: Wait 15 minutes or check server logs

## 🔍 Monitoring

Check server health:
```bash
curl http://localhost:3000/api/health
```