-- AutoFeedback Database Schema
-- Version: 1.0
-- Created: 2026-02-09

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  google_id TEXT UNIQUE, -- For Google OAuth
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_google_id ON users(google_id);

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  brand_id TEXT NOT NULL,
  model_id TEXT NOT NULL,
  year INTEGER NOT NULL,
  fuel_type TEXT NOT NULL,
  transmission TEXT NOT NULL,
  ownership_status TEXT NOT NULL CHECK(ownership_status IN ('current', 'former')),
  ownership_from TEXT NOT NULL,
  ownership_to TEXT,
  
  -- Ratings (1-10 scale)
  rating_reliability INTEGER NOT NULL CHECK(rating_reliability BETWEEN 1 AND 10),
  rating_maintenance INTEGER NOT NULL CHECK(rating_maintenance BETWEEN 1 AND 10),
  rating_comfort INTEGER NOT NULL CHECK(rating_comfort BETWEEN 1 AND 10),
  rating_performance INTEGER NOT NULL CHECK(rating_performance BETWEEN 1 AND 10),
  rating_fuel INTEGER NOT NULL CHECK(rating_fuel BETWEEN 1 AND 10),
  
  -- Text fields
  recommendation TEXT NOT NULL,
  pros TEXT NOT NULL,
  cons TEXT NOT NULL,
  summary_line TEXT,
  
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, brand_id, model_id) -- One review per user per model
);

CREATE INDEX idx_reviews_model ON reviews(brand_id, model_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_created ON reviews(created_at DESC);

-- Aggregates Cache Table
CREATE TABLE IF NOT EXISTS aggregates_cache (
  brand_id TEXT NOT NULL,
  model_id TEXT NOT NULL,
  review_count INTEGER DEFAULT 0,
  avg_reliability REAL,
  avg_maintenance REAL,
  avg_comfort REAL,
  avg_performance REAL,
  avg_fuel REAL,
  avg_overall REAL,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (brand_id, model_id)
);

-- Sessions Table
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_expires ON sessions(expires_at);
