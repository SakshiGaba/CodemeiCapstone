import { useEffect, useState } from 'react';

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [editError, setEditError] = useState('');

  const loadItems = () => {
    setLoading(true);
    fetch('/api/items')
      .then((r) => r.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadItems();
  }, []);

  const addItem = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const res = await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (res.ok) {
      setName('');
      loadItems();
    }
  };

  const deleteItem = async (id) => {
    await fetch(`/api/items/${id}`, { method: 'DELETE' });
    if (editingId === id) {
      setEditingId(null);
      setEditingName('');
      setEditError('');
    }
    loadItems();
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditingName(item.name ?? '');
    setEditError('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName('');
    setEditError('');
  };

  const saveEdit = async (id) => {
    const nextName = editingName.trim();
    if (!nextName) {
      setEditError('Name is required.');
      return;
    }

    setEditError('');
    try {
      const res = await fetch(`/api/items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nextName }),
      });

      if (!res.ok) {
        let message = 'Failed to save changes.';
        try {
          const data = await res.json();
          if (typeof data?.error === 'string') message = data.error;
          else if (typeof data?.message === 'string') message = data.message;
        } catch {
          // ignore parsing errors
        }
        setEditError(message);
        return;
      }

      // Update UI without full reload if possible
      setItems((prev) =>
        prev.map((it) => (it.id === id ? { ...it, name: nextName } : it))
      );

      setEditingId(null);
      setEditingName('');
      setEditError('');
    } catch {
      setEditError('Network error. Please try again.');
    }
  };

  return (
    <div className="container">
      <h1>Items</h1>
      <form onSubmit={addItem} className="add-form">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New item name"
        />
        <button type="submit">Add</button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : items.length === 0 ? (
        <p>No items yet. Add one above.</p>
      ) : (
        <ul className="item-list">
          {items.map((item) => {
            const isEditing = editingId === item.id;

            return (
              <li key={item.id}>
                {isEditing ? (
                  <>
                    <input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      aria-label={`Edit name for ${item.name}`}
                    />
                    <button type="button" onClick={() => saveEdit(item.id)}>
                      Save
                    </button>
                    <button type="button" onClick={cancelEdit}>
                      Cancel
                    </button>
                    {editError ? (
                      <span
                        style={{ marginLeft: 8, color: 'crimson' }}
                        role="alert"
                      >
                        {editError}
                      </span>
                    ) : null}
                  </>
                ) : (
                  <>
                    <span>{item.name}</span>
                    <button type="button" onClick={() => startEdit(item)}>
                      Edit
                    </button>
                    <button type="button" onClick={() => deleteItem(item.id)}>
                      Delete
                    </button>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default App;