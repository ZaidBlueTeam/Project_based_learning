-- Sonic Game Database Setup
-- Run this in SQL Server Management Studio

-- Create database
CREATE DATABASE sonic_game;
GO

-- Use the database
USE sonic_game;
GO

-- Create progress table
CREATE TABLE player_progress (
    id INT IDENTITY(1,1) PRIMARY KEY,
    level_name VARCHAR(50) UNIQUE NOT NULL,
    lives INT DEFAULT 3,
    score INT DEFAULT 0,
    last_updated DATETIME DEFAULT GETDATE()
);
GO

-- Insert default level entries
INSERT INTO player_progress (level_name, lives, score) VALUES
('Test Zone Act 1', 3, 0),
('Test Zone Act 2', 3, 0),
('Test Zone Act 3', 3, 0);
GO

-- Verify data
SELECT * FROM player_progress;
GO