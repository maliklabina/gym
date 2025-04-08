import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [error, setError] = useState('');
  const [editId, setEditId] = useState(null);

  const API = "http://localhost:5000/api/users";

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(API);
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !role) {
      setError("All fields are required.");
      return;
    }

    try {
      if (editId) {
        await axios.put(`${API}/${editId}`, { name, email, role });
        setEditId(null);
      } else {
        await axios.post(API, { name, email, role });
      }
      setName('');
      setEmail('');
      setRole('user');
      fetchUsers();
    } catch (err) {
      console.error(err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Something went wrong.");
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const handleEdit = (user) => {
    setEditId(user.id);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
  };

  const lowerSearch = search.toLowerCase();
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(lowerSearch) ||
      user.email.toLowerCase().includes(lowerSearch) ||
      user.role.toLowerCase().includes(lowerSearch);
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="container">
      <h1>Gym Management</h1>

      {error && <div className="error-msg">{error}</div>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="user">User</option>
          <option value="trainer">Trainer</option>
        </select>
        <button type="submit">{editId ? 'Update' : 'Add'}</button>
      </form>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '0.5rem', flex: 1, border: '1px solid #ccc' }}
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          style={{ padding: '0.5rem' }}
        >
          <option value="all">All Roles</option>
          <option value="user">User</option>
          <option value="trainer">Trainer</option>
        </select>
      </div>

      <h2>Users</h2>
      {filteredUsers.length === 0 && <p>No users found.</p>}
      {filteredUsers.map((user) => (
        <div key={user.id} className="user-card">
          <div className="user-info">
            <strong>{user.name}</strong> ({user.email})
            <span className="user-role">{user.role}</span>
          </div>
          <div className="action-buttons">
            <button onClick={() => handleEdit(user)}>Update</button>
            <button onClick={() => handleDelete(user.id)} style={{ backgroundColor: '#e74c3c' }}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;