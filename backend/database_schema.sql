-- Report Buddy Network Database Schema
-- Use this with PostgreSQL for production deployment

-- Reports table
CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    lat DECIMAL(10, 8) NOT NULL,
    lon DECIMAL(11, 8) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    location VARCHAR(255),
    details TEXT,
    spotter_id VARCHAR(100) DEFAULT 'Anonymous',
    confidence INTEGER DEFAULT 5 CHECK (confidence >= 1 AND confidence <= 10),
    image_url VARCHAR(500),
    verified BOOLEAN DEFAULT FALSE,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Spotters table (for future spotter registration)
CREATE TABLE spotters (
    id SERIAL PRIMARY KEY,
    spotter_id VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    training_level VARCHAR(50), -- Basic, Intermediate, Advanced, NWS Certified
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE
);

-- Admin users table
CREATE TABLE admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    role VARCHAR(20) DEFAULT 'admin', -- admin, moderator
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE
);

-- Report verification log
CREATE TABLE verification_log (
    id SERIAL PRIMARY KEY,
    report_id INTEGER REFERENCES reports(id) ON DELETE CASCADE,
    admin_user_id INTEGER REFERENCES admin_users(id),
    action VARCHAR(20), -- verified, deleted, flagged
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_reports_timestamp ON reports(submitted_at);
CREATE INDEX idx_reports_location ON reports(lat, lon);
CREATE INDEX idx_reports_type ON reports(type);
CREATE INDEX idx_reports_verified ON reports(verified);
CREATE INDEX idx_reports_recent ON reports(submitted_at) WHERE submitted_at > (NOW() - INTERVAL '24 hours');

-- Spatial index for geographic queries (requires PostGIS)
-- CREATE INDEX idx_reports_geom ON reports USING GIST(ST_Point(lon, lat));

-- Views for common queries
CREATE VIEW recent_reports AS
SELECT * FROM reports 
WHERE submitted_at > (NOW() - INTERVAL '24 hours')
ORDER BY submitted_at DESC;

CREATE VIEW verified_reports AS
SELECT * FROM reports 
WHERE verified = TRUE
ORDER BY submitted_at DESC;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample data for testing
INSERT INTO admin_users (username, password_hash, email) VALUES 
('admin', '$2a$10$8K1p/a3jK4YUF5VVhxzQ8.VrKJ3/4rXNk5dW9h8R2q6X4F5n6m7c8', 'admin@hhwx.me');

-- Sample spotter data
INSERT INTO spotters (spotter_id, name, training_level) VALUES 
('WX001', 'Test Spotter', 'NWS Certified'),
('CHASE123', 'Storm Chaser', 'Advanced');

-- Sample report data
INSERT INTO reports (type, lat, lon, location, details, spotter_id, confidence, verified) VALUES 
('Tornado', 35.2070, -97.4458, 'Norman, OK', 'EF2 tornado on ground', 'WX001', 9, TRUE),
('Hail', 35.2251, -97.4395, 'Norman, OK', 'Quarter size (1.00″)', 'CHASE123', 8, FALSE),
('Wind', 35.1823, -97.4401, 'Moore, OK', 'Trees down on Highway 9', 'Anonymous', 7, FALSE);