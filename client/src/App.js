import { useEffect, useMemo, useState } from 'react';

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [savingById, setSavingById] = useState({});
  const [errorById, setErrorById] = useState({});

  const isEditing = useMemo(() => editingId !== null, [editingId]);

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
    } else {
      alert('Failed to add item.');
    }
  };

  const deleteItem = async (id) => {
    await fetch(`/api/items/${id}`, { method: 'DELETE' });
    loadItems();
  };

  const startEdit = (item) => {
    setErrorById((prev) => ({ ...prev, [item.id]: '' }));
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
      setErrorById((prev) => ({ ...prev, [id]: 'Name cannot be empty.' }));
      return;
    }

    setSavingById((prev) => ({ ...prev, [id]: true }));
    setErrorById((prev) => ({ ...prev, [id]: '' }));

    try {
      const res = await fetch(`/api/items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nextName }),
      });

      if (!res.ok) {
        setErrorById((prev) => ({ ...prev, [id]: 'Failed to save changes.' }));
        return;
      }

      const updatedItem = await res.json();
      setItems((prevItems) =>
        prevItems.map((item) => (item.id === id ? updatedItem : item))
      );
      cancelEdit();
    } catch {
      setErrorById((prev) => ({ ...prev, [id]: 'Failed to save changes.' }));
    } finally {
      setSavingById((prev) => ({ ...prev, [id]: false }));
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
            const isRowEditing = editingId === item.id;
            const isSaving = Boolean(savingById[item.id]);
            const rowError = errorById[item.id];

            return (
              <li key={item.id}>
                {isRowEditing ? (
                  <>
                    <input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      disabled={isSaving}
                      aria-label={`Edit ${item.name}`}
                    />
                    <button
                      type="button"
                      onClick={() => saveEdit(item.id)}
                      disabled={isSaving}
                    >
                      {isSaving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      disabled={isSaving}
                    >
                      Cancel
                    </button>
                    {rowError ? <p className="inline-error">{rowError}</p> : null}
                  </>
                ) : (
                  <>
                    <span>{item.name}</span>
                    <button
                      type="button"
                      onClick={() => startEdit(item)}
                      disabled={isEditing}
                    >
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