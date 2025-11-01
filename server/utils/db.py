import hashlib
import json
import sqlite3
from pathlib import Path
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent.parent / "users.sqlite3"


def get_connection():
    return sqlite3.connect(DB_PATH)


def init_db():
    conn = get_connection()
    cur = conn.cursor()

    # Таблица пользователей
    cur.execute(
        """
    CREATE TABLE IF NOT EXISTS users (
        user_uuid TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        science_clicks INTEGER DEFAULT 2
    )
    """
    )

    # Таблица истории игр
    cur.execute(
        """
    CREATE TABLE IF NOT EXISTS game_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_uuid TEXT,
        matrix_name TEXT,
        timestamp TEXT,
        final_score REAL,
        turns TEXT,
        FOREIGN KEY(user_uuid) REFERENCES users(user_uuid)
    )
    """
    )

    # Таблица пользовательских настроек графов
    cur.execute(
        """
    CREATE TABLE IF NOT EXISTS user_graph_settings (
        user_uuid TEXT,
        matrix_name TEXT,
        settings_json TEXT,
        PRIMARY KEY(user_uuid, matrix_name),
        FOREIGN KEY(user_uuid) REFERENCES users(user_uuid)
    )
    """
    )
    
    # Таблица токенов для сброса пароля
    cur.execute(
        """
    CREATE TABLE IF NOT EXISTS password_resets (
        token TEXT PRIMARY KEY,
        user_uuid TEXT NOT NULL,
        expires_at TEXT NOT NULL,
        FOREIGN KEY(user_uuid) REFERENCES users(user_uuid)
    )
    """
    )
    
    conn.commit()
    conn.close()

# ========== Дополнительные функции для CRUD-операций ==========
def insert_user(user_uuid, username, email, password_hash):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """
        INSERT INTO users (user_uuid, username, email, password)
        VALUES (?, ?, ?, ?)
    """, 
    (user_uuid, username, email, password_hash))
    conn.commit()
    conn.close()


def find_user_by(field, value):
    conn = get_connection()
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    cur.execute(f"SELECT * FROM users WHERE {field} = ?", (value,))
    row = cur.fetchone()
    conn.close()
    return dict(row) if row else None


def update_science_clicks(user_uuid, new_clicks):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "UPDATE users SET science_clicks = ? WHERE user_uuid = ?",
        (new_clicks, user_uuid)
    )
    conn.commit()
    conn.close()


def get_science_clicks(user_uuid):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT science_clicks FROM users WHERE user_uuid = ?", (user_uuid,))
    result = cur.fetchone()
    conn.close()
    return result[0] if result else 0


def insert_game_history(user_uuid, matrix_name, timestamp, final_score, turns):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """
        INSERT INTO game_history (user_uuid, matrix_name, timestamp, final_score, turns)
        VALUES (?, ?, ?, ?, ?)
    """,
        (
            user_uuid,
            matrix_name,
            timestamp,
            final_score,
            json.dumps(turns, ensure_ascii=False),
        ),
    )
    conn.commit()
    conn.close()


def get_game_history(user_uuid, matrix_name):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """
        SELECT timestamp, final_score, turns FROM game_history
        WHERE user_uuid = ? AND matrix_name = ?
        ORDER BY timestamp ASC
    """, 
        (user_uuid, matrix_name)
    )
    rows = cur.fetchall()
    conn.close()
    return [
        {"timestamp": ts, "final_score": fs, "turns": json.loads(turns)} 
        for ts, fs, turns in rows
    ]


def save_user_graph_settings(user_uuid, matrix_name, settings_json):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """
        INSERT INTO user_graph_settings (user_uuid, matrix_name, settings_json)
        VALUES (?, ?, ?)
        ON CONFLICT(user_uuid, matrix_name) DO UPDATE SET settings_json=excluded.settings_json
    """, 
        (user_uuid, matrix_name, json.dumps(settings_json, ensure_ascii=False))
    )
    conn.commit()
    conn.close()


def load_user_graph_settings(user_uuid, matrix_name):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """
        SELECT settings_json FROM user_graph_settings
        WHERE user_uuid = ? AND matrix_name = ?
    """, 
        (user_uuid, matrix_name)
    )
    row = cur.fetchone()
    conn.close()
    return json.loads(row[0]) if row else None


def update_user_password(user_uuid, password_hash):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "UPDATE users SET password = ? WHERE user_uuid = ?",
        (password_hash, user_uuid),
    )
    conn.commit()
    conn.close()


def _hash_reset_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def create_password_reset_token(token, user_uuid, expires_at):
    hashed_token = _hash_reset_token(token)
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "DELETE FROM password_resets WHERE user_uuid = ?",
        (user_uuid,),
    )
    cur.execute(
        """
        INSERT OR REPLACE INTO password_resets (token, user_uuid, expires_at)
        VALUES (?, ?, ?)
        """,
        (hashed_token, user_uuid, expires_at),
    )
    conn.commit()
    conn.close()


def get_password_reset_token(token):
    hashed_token = _hash_reset_token(token)
    conn = get_connection()
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    cur.execute(
        "SELECT token, user_uuid, expires_at FROM password_resets WHERE token = ?",
        (hashed_token,),
    )
    row = cur.fetchone()
    if row:
        conn.close()
        return dict(row)

    # Попытка найти и «обновить» токены, созданные до хеширования
    cur.execute(
        "SELECT token, user_uuid, expires_at FROM password_resets WHERE token = ?",
        (token,),
    )
    row = cur.fetchone()
    if not row:
        conn.close()
        return None

    cur.execute(
        "UPDATE password_resets SET token = ? WHERE token = ?",
        (hashed_token, token),
    )
    conn.commit()
    upgraded_row = dict(row)
    upgraded_row["token"] = hashed_token
    conn.close()
    return upgraded_row


def delete_password_reset_token(token):
    hashed_token = _hash_reset_token(token)
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "DELETE FROM password_resets WHERE token IN (?, ?)",
        (hashed_token, token),
    )    
    conn.commit()
    conn.close()