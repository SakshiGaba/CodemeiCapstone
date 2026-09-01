import { useEffect, useState } from 'react';

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [editErrorById, setEditErrorById] = useState({});

  const loadItems = () => {
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
    setItems((prev) => prev.filter((it) => it.id !== id));
    setEditErrorById((prev) => {
      if (!Object.prototype.hasOwnProperty.call(prev, id)) return prev;
      const { [id]: _removed, ...rest } = prev;
      return rest;
    });
    if (editingId === id) {
      setEditingId(null);
      setEditingName('');
    }
  };

  const startEdit = (item) => {
    setEditErrorById((prev) => {
      if (!prev[item.id]) return prev;
      const { [item.id]: _removed, ...rest } = prev;
      return rest;
    });
    setEditingId(item.id);
    setEditingName(item.name ?? '');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const saveEdit = async (id) => {
    const nextName = editingName.trim();
    if (!nextName) {
      setEditErrorById((prev) => ({ ...prev, [id]: 'Name cannot be empty.' }));
      return;
    }

    setEditErrorById((prev) => {
      if (!prev[id]) return prev;
      const { [id]: _removed, ...rest } = prev;
      return rest;
    });

    try {
      const res = await fetch(`/api/items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nextName }),
      });

      if (!res.ok) {
        const msg = 'Failed to save changes. Please try again.';
        setEditErrorById((prev) => ({ ...prev, [id]: msg }));
        return;
      }

      setItems((prev) =>
        prev.map((it) => (it.id === id ? { ...it, name: nextName } : it))
      );
      setEditingId(null);
      setEditingName('');
    } catch {
      const msg = 'Failed to save changes. Please try again.';
      setEditErrorById((prev) => ({ ...prev, [id]: msg }));
      alert(msg);
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
          aria-label="New item name"
        />
        <button type="submit" aria-label="Add item">
          Add
        </button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : items.length === 0 ? (
        <p>No items yet. Add one above.</p>
      ) : (
        <ul className="item-list">
          {items.map((item) => {
            const isEditing = editingId === item.id;
            const errorMsg = editErrorById[item.id];

            return (
              <li key={item.id}>
                {isEditing ? (
                  <div>
                    <input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      aria-label={`Edit name for ${item.name}`}
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => saveEdit(item.id)}
                      aria-label={`Save ${item.name}`}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      aria-label={`Cancel editing ${item.name}`}
                    >
                      Cancel
                    </button>
                    {errorMsg ? (
                      <p role="alert" aria-live="polite">
                        {errorMsg}
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <>
                    <span>{item.name}</span>
                    <button
                      type="button"
                      onClick={() => startEdit(item)}
                      aria-label={`Edit ${item.name}`}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteItem(item.id)}
                      aria-label={`Delete ${item.name}`}
                    >
                      Delete
                    </button>
                    {errorMsg ? (
                      <p role="alert" aria-live="polite">
                        {errorMsg}
                      </p>
                    ) : null}
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