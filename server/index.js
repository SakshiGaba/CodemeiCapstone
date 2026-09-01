const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database(path.join(__dirname, 'db', 'app.db'));

db.run(`CREATE TABLE IF NOT EXISTS items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
)`);

function sendError(res, status, message, details) {
  const payload = { error: { message } };
  if (details !== undefined) payload.error.details = details;
  return res.status(status).json(payload);
}

function validateItemName(rawName) {
  if (typeof rawName !== 'string') {
    return { valid: false, message: 'Name is required' };
  }
  const name = rawName.trim();
  if (!name) {
    return { valid: false, message: 'Name is required' };
  }
  // Conservative constraints; does not require schema changes.
  if (name.length < 1 || name.length > 255) {
    return { valid: false, message: 'Name must be between 1 and 255 characters' };
  }
  return { valid: true, name };
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Get all items
app.get('/api/items', (req, res) => {
  db.all('SELECT * FROM items ORDER BY id DESC', [], (err, rows) => {
    if (err) return sendError(res, 500, 'Database error', err.message);
    res.json(rows);
  });
});

// Add a new item
app.post('/api/items', (req, res) => {
  const validation = validateItemName(req.body?.name);
  if (!validation.valid) {
    return sendError(res, 400, validation.message);
  }

  db.run('INSERT INTO items (name) VALUES (?)', [validation.name], function (err) {
    if (err) return sendError(res, 500, 'Database error', err.message);
    res.status(201).json({ id: this.lastID, name: validation.name });
  });
});

// Update an item name
app.put('/api/items/:id', (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  if (!Number.isInteger(id) || id <= 0) {
    return sendError(res, 400, 'Invalid id');
  }

  const validation = validateItemName(req.body?.name);
  if (!validation.valid) {
    return sendError(res, 400, validation.message);
  }

  db.run('UPDATE items SET name = ? WHERE id = ?', [validation.name, id], function (err) {
    if (err) return sendError(res, 500, 'Database error', err.message);

    if (this.changes === 0) {
      return sendError(res, 404, 'Item not found');
    }

    // Return updated item JSON
    db.get('SELECT id, name FROM items WHERE id = ?', [id], (err2, row) => {
      if (err2) return sendError(res, 500, 'Database error', err2.message);
      if (!row) return sendError(res, 404, 'Item not found');
      res.json(row);
    });
  });
});

// Delete an item
app.delete('/api/items/:id', (req, res) => {
  db.run('DELETE FROM items WHERE id = ?', [req.params.id], function (err) {
    if (err) return sendError(res, 500, 'Database error', err.message);
    res.json({ deleted: this.changes });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));