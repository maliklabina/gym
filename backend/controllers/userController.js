import { db } from '../server.js';

// GET /api/users
export const getAllUsers = (req, res) => {
  const sql = 'SELECT * FROM users';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.status(200).json(results);
  });
};

// GET /api/users/:id
export const getUserById = (req, res) => {
  const userId = req.params.id;
  const sql = 'SELECT * FROM users WHERE id = ?';

  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(results[0]);
  });
};

// POST /api/users
export const createUser = (req, res) => {
  const { name, email, role } = req.body;

  if (!name || !email || !role) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const sql = 'INSERT INTO users (name, email, role) VALUES (?, ?, ?)';
  db.query(sql, [name, email, role], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(500).json({ error: 'Email already exists.' });
      }
      return res.status(500).json({ error: 'Database error.' });
    }

    res.status(200).json({ message: 'User added', id: result.insertId });
  });
};

// PUT /api/users/:id
export const updateUser = (req, res) => {
  const userId = req.params.id;
  const { name, email, role } = req.body;

  if (!name || !email || !role) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const sql = 'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?';
  db.query(sql, [name, email, role, userId], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(500).json({ error: 'Email already exists.' });
      }
      return res.status(500).json({ error: 'Database error.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully' });
  });
};

// DELETE /api/users/:id
export const deleteUser = (req, res) => {
  const userId = req.params.id;
  const sql = 'DELETE FROM users WHERE id = ?';

  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  });
};
