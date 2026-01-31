"""
Migration: Create tasks table
Version: 002
Description: Creates the tasks table with status and priority constraints, plus seed data
"""

import sqlite3
import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import DATABASE_PATH


def upgrade():
    """Apply the migration."""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()

    # Create migrations tracking table if it doesn't exist
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS _migrations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Check if this migration has already been applied
    cursor.execute("SELECT 1 FROM _migrations WHERE name = ?", ("002_create_tasks_table",))
    if cursor.fetchone():
        print("Migration 002_create_tasks_table already applied. Skipping.")
        conn.close()
        return

    # Create tasks table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            status TEXT NOT NULL CHECK(status IN ('pending', 'in_progress', 'completed', 'launched')),
            priority TEXT NOT NULL CHECK(priority IN ('normal', 'high')) DEFAULT 'normal',
            due_date TEXT,
            assignees TEXT,
            created_at TEXT DEFAULT (datetime('now')),
            updated_at TEXT DEFAULT (datetime('now'))
        )
    """)

    # Insert seed data matching the design
    seed_data = [
        ('Solutions Pages', 'pending', 'normal', '2026-03-17T09:00:00', '["user1", "user2"]'),
        ('Company Pages', 'pending', 'normal', '2026-03-17T09:00:00', '[]'),
        ('Help Center Pages', 'pending', 'normal', None, '[]'),
        ('Icon Custom', 'pending', 'normal', None, '[]'),
        ('Illustration', 'pending', 'normal', None, '["user1", "user2"]'),
        ('Order Flow', 'in_progress', 'high', '2026-03-17T09:00:00', '["user1", "user2"]'),
        ('New Work Flow', 'in_progress', 'high', '2026-03-17T09:00:00', '["user3"]'),
        ('About Us Illustration', 'completed', 'normal', '2026-03-17T09:00:00', '["user1", "user2"]'),
        ('Hero Illustration', 'completed', 'normal', '2026-03-17T09:00:00', '["user3"]'),
        ('Moodboarding', 'completed', 'high', '2026-03-17T09:00:00', '["user3"]'),
        ('Research', 'completed', 'high', '2026-03-17T09:00:00', '["user3"]'),
        ('Features Pages', 'launched', 'normal', '2026-03-17T09:00:00', '["user1", "user2"]'),
    ]

    cursor.executemany(
        "INSERT INTO tasks (title, status, priority, due_date, assignees) VALUES (?, ?, ?, ?, ?)",
        seed_data
    )

    # Record this migration
    cursor.execute("INSERT INTO _migrations (name) VALUES (?)", ("002_create_tasks_table",))

    conn.commit()
    conn.close()
    print("Migration 002_create_tasks_table applied successfully.")


def downgrade():
    """Revert the migration."""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()

    # Drop tasks table
    cursor.execute("DROP TABLE IF EXISTS tasks")

    # Remove migration record
    cursor.execute("DELETE FROM _migrations WHERE name = ?", ("002_create_tasks_table",))

    conn.commit()
    conn.close()
    print("Migration 002_create_tasks_table reverted successfully.")


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Run database migration")
    parser.add_argument(
        "action",
        choices=["upgrade", "downgrade"],
        help="Migration action to perform"
    )

    args = parser.parse_args()

    if args.action == "upgrade":
        upgrade()
    elif args.action == "downgrade":
        downgrade()
