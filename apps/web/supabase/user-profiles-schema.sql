-- User Profiles and Settings Schema for CourierEarn

-- Update users table with additional fields
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS total_earnings DECIMAL(12,2) DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS total_kpi_points DECIMAL(8,2) DEFAULT 0;

-- User notification preferences
CREATE TABLE IF NOT EXISTS user_notification_preferences (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    daily_reminder_enabled BOOLEAN DEFAULT true,
    daily_reminder_time TIME DEFAULT '20:00:00', -- 8:00 PM default
    day_off_enabled BOOLEAN DEFAULT false,
    day_off_day INTEGER DEFAULT NULL, -- 0=Sunday, 1=Monday, ..., 6=Saturday
    sound_enabled BOOLEAN DEFAULT true,
    vibration_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- User data backups
CREATE TABLE IF NOT EXISTS user_data_backups (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    backup_name VARCHAR(100) NOT NULL,
    backup_data JSONB NOT NULL, -- Contains all user data
    backup_type VARCHAR(20) NOT NULL CHECK (backup_type IN ('manual', 'auto')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    file_size INTEGER NOT NULL -- Size in bytes
);

-- User sessions for mobile devices
CREATE TABLE IF NOT EXISTS user_mobile_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_token TEXT NOT NULL UNIQUE,
    device_type VARCHAR(50) NOT NULL, -- 'ios', 'android'
    app_version VARCHAR(20) NOT NULL,
    push_enabled BOOLEAN DEFAULT true,
    last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default notification preferences for existing users
INSERT INTO user_notification_preferences (user_id, daily_reminder_time)
SELECT id, '20:00:00'::TIME FROM users 
WHERE id NOT IN (SELECT user_id FROM user_notification_preferences)
ON CONFLICT (user_id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_notification_preferences_user_id ON user_notification_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_data_backups_user_id ON user_data_backups(user_id);
CREATE INDEX IF NOT EXISTS idx_user_data_backups_created_at ON user_data_backups(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_mobile_sessions_user_id ON user_mobile_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_mobile_sessions_device_token ON user_mobile_sessions(device_token);
