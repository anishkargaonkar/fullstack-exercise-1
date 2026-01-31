-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('pending', 'in_progress', 'completed', 'launched')),
    priority TEXT NOT NULL CHECK(priority IN ('normal', 'high')) DEFAULT 'normal',
    due_date TEXT,
    assignees TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Insert seed data matching the design
INSERT INTO tasks (title, status, priority, due_date, assignees) VALUES
('Solutions Pages', 'pending', 'normal', '2026-03-17T09:00:00', '["user1", "user2"]'),
('Company Pages', 'pending', 'normal', '2026-03-17T09:00:00', '[]'),
('Help Center Pages', 'pending', 'normal', NULL, '[]'),
('Icon Custom', 'pending', 'normal', NULL, '[]'),
('Illustration', 'pending', 'normal', NULL, '["user1", "user2"]'),
('Order Flow', 'in_progress', 'high', '2026-03-17T09:00:00', '["user1", "user2"]'),
('New Work Flow', 'in_progress', 'high', '2026-03-17T09:00:00', '["user3"]'),
('About Us Illustration', 'completed', 'normal', '2026-03-17T09:00:00', '["user1", "user2"]'),
('Hero Illustration', 'completed', 'normal', '2026-03-17T09:00:00', '["user3"]'),
('Moodboarding', 'completed', 'high', '2026-03-17T09:00:00', '["user3"]'),
('Research', 'completed', 'high', '2026-03-17T09:00:00', '["user3"]'),
('Features Pages', 'launched', 'normal', '2026-03-17T09:00:00', '["user1", "user2"]');
