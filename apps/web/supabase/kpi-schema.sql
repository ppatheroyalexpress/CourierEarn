-- Royal Express KPI System Schema

-- KPI Grades table with branch targets
CREATE TABLE IF NOT EXISTS kpi_grades (
    id SERIAL PRIMARY KEY,
    branch_grade VARCHAR(1) NOT NULL CHECK (branch_grade IN ('A', 'B', 'C')),
    grade_level INTEGER NOT NULL CHECK (grade_level BETWEEN 1 AND 5),
    delivery_target INTEGER NOT NULL,
    pickup_target INTEGER NOT NULL,
    ec_target INTEGER NOT NULL,
    total_target INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Warnings table for penalty system
CREATE TABLE IF NOT EXISTS user_warnings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    warning_type VARCHAR(50) NOT NULL, -- e.g., 'late_delivery', 'complaint', 'violation'
    reason TEXT NOT NULL,
    points INTEGER NOT NULL DEFAULT 1, -- Warning points (typically 1)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by INTEGER REFERENCES users(id),
    is_active BOOLEAN DEFAULT TRUE,
    reset_at TIMESTAMP WITH TIME ZONE,
    reset_by INTEGER REFERENCES users(id)
);

-- Monthly KPI Scores table
CREATE TABLE IF NOT EXISTS monthly_kpi_scores (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    month VARCHAR(7) NOT NULL, -- Format: '2024-03'
    delivery_score INTEGER NOT NULL DEFAULT 0,
    pickup_score INTEGER NOT NULL DEFAULT 0,
    ec_score INTEGER NOT NULL DEFAULT 0,
    total_score INTEGER NOT NULL DEFAULT 0,
    percentage DECIMAL(5,2) NOT NULL DEFAULT 0,
    grade INTEGER NOT NULL CHECK (grade BETWEEN 1 AND 5),
    warnings_applied INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, month)
);

-- Monthly Champions table
CREATE TABLE IF NOT EXISTS monthly_champions (
    id SERIAL PRIMARY KEY,
    month VARCHAR(7) NOT NULL UNIQUE, -- Format: '2024-03'
    champion_user_id INTEGER NOT NULL REFERENCES users(id),
    runner_up_user_id INTEGER REFERENCES users(id),
    third_place_user_id INTEGER REFERENCES users(id),
    champion_grade INTEGER NOT NULL,
    champion_percentage DECIMAL(5,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert KPI grade targets
INSERT INTO kpi_grades (branch_grade, grade_level, delivery_target, pickup_target, ec_target, total_target) VALUES
('A', 5, 121, 81, 58, 46),
('A', 4, 107, 73, 46, 38),
('A', 3, 93, 65, 34, 30),
('A', 2, 79, 57, 22, 22),
('A', 1, 65, 49, 10, 14),
('B', 5, 107, 73, 46, 38),
('B', 4, 93, 65, 34, 30),
('B', 3, 79, 57, 22, 22),
('B', 2, 65, 49, 10, 14),
('B', 1, 51, 41, 0, 6),
('C', 5, 93, 65, 34, 30),
('C', 4, 79, 57, 22, 22),
('C', 3, 65, 49, 10, 14),
('C', 2, 51, 41, 0, 6),
('C', 1, 37, 33, 0, 0)
ON CONFLICT DO NOTHING;

-- Add branch_grade to users table if not exists
ALTER TABLE users ADD COLUMN IF NOT EXISTS branch_grade VARCHAR(1) DEFAULT 'C' CHECK (branch_grade IN ('A', 'B', 'C'));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_warnings_user_id ON user_warnings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_warnings_active ON user_warnings(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_monthly_kpi_scores_user_month ON monthly_kpi_scores(user_id, month);
CREATE INDEX IF NOT EXISTS idx_monthly_champions_month ON monthly_champions(month);
