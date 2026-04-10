import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, CheckCircle, Circle } from 'lucide-react';
import { generateId } from '../utils/store';

const CardModal = ({ categoryId, card, onClose, onUpdateCard, onDeleteCard }) => {
  const [title, setTitle] = useState(card.title);
  const [items, setItems] = useState(card.items || []);
  const [newItemText, setNewItemText] = useState('');

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleSave = () => {
    onUpdateCard(categoryId, { ...card, title, items });
  };

  // Auto-save when items change (excluding uncommitted new items)
  useEffect(() => {
    handleSave();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, items]);

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    const newItem = { id: generateId(), text: newItemText.trim(), completed: false };
    setItems([...items, newItem]);
    setNewItemText('');
  };

  const toggleItem = (itemId) => {
    setItems(items.map(item => 
      item.id === itemId ? { ...item, completed: !item.completed } : item
    ));
  };

  const deleteItem = (itemId) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <input 
            type="text" 
            className="modal-title-input" 
            value={title} 
            onChange={e => setTitle(e.target.value)}
            placeholder="Card Title"
          />
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <X size={24} />
          </button>
        </div>
        
        <div className="modal-body">
          <div className="list-items-container">
            <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
               <CheckCircle size={18} className="text-muted" /> Tasks
            </h4>
            
            {items.length === 0 ? (
              <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>No tasks yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {items.map(item => (
                  <div key={item.id} className="list-item">
                    <input 
                      type="checkbox" 
                      className="list-item-checkbox" 
                      checked={item.completed} 
                      onChange={() => toggleItem(item.id)} 
                    />
                    <span className={`list-item-text ${item.completed ? 'completed' : ''}`}>
                      {item.text}
                    </span>
                    <button className="icon-btn danger" onClick={() => deleteItem(item.id)} style={{ padding: 0 }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <form onSubmit={handleAddItem} className="add-list-item-form">
              <input 
                type="text" 
                placeholder="Add a new task..." 
                value={newItemText}
                onChange={e => setNewItemText(e.target.value)}
              />
              <button type="submit" disabled={!newItemText.trim()}>
                <Plus size={18} /> Add
              </button>
            </form>
          </div>
          
          <div style={{ marginTop: '3rem', borderTop: '1px solid var(--card-border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
             <button className="danger" onClick={() => {
               if(window.confirm('Delete this card?')) {
                 onDeleteCard(categoryId, card.id);
                 onClose();
               }
             }}>
               <Trash2 size={18} /> Delete Card
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardModal;
