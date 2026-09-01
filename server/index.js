const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { z } = require('zod');

const envSchema = z.object({
  dbPath: z.string().min(1).default(path.join('db', 'app.db')),
  corsOrigin: z.string().min(1).optional(),
  port: z.coerce.number().int().positive().optional(),
});

const env = envSchema.parse({
  dbPath: process.env.DB_PATH,
  corsOrigin: process.env.CORS_ORIGIN,
  port: process.env.PORT,
});

function validate({ body, params, query }) {
  return (req, res, next) => {
    try {
      if (body) req.body = body.parse(req.body);
      if (params) req.params = params.parse(req.params);
      if (query) req.query = query.parse(req.query);
      next();
    } catch (err) {
      if (err && err.name === 'ZodError') {
        return res.status(400).json({
          error: 'Validation error',
          details: err.issues?.map((i) => ({
            path: i.path.join('.'),
            message: i.message,
          })),
        });
      }
      next(err);
    }
  };
}

const createItemBodySchema = z.object({
  name: z.string().transform((s) => s.trim()).pipe(z.string().min(1, 'Name is required')),
});

const deleteItemParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const app = express();

const corsOptions = env.corsOrigin
  ? { origin: env.corsOrigin }
  : { origin: true }; // permissive by default (dev-friendly)

app.use(cors(corsOptions));
app.use(express.json());

const db = new sqlite3.Database(path.join(__dirname, env.dbPath));

db.run(`CREATE TABLE IF NOT EXISTS items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
)`);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Get all items
app.get('/api/items', (req, res) => {
  db.all('SELECT * FROM items ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Add a new item
app.post('/api/items', validate({ body: createItemBodySchema }), (req, res) => {
  const { name } = req.body;
  db.run('INSERT INTO items (name) VALUES (?)', [name], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, name });
  });
});

// Delete an item
app.delete('/api/items/:id', validate({ params: deleteItemParamsSchema }), (req, res) => {
  db.run('DELETE FROM items WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

const PORT = env.port || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
