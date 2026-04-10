import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, CheckCircle, AlignLeft } from 'lucide-react';
import { generateId } from '../utils/store';
import RichTextEditor from './RichTextEditor';
import TaskItem from './TaskItem';

const CardModal = ({ categoryId, card, onClose, onUpdateCard, onDeleteCard }) => {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || '');
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
    onUpdateCard(categoryId, { ...card, title, description, items });
  };

  // Auto-save when items change (excluding uncommitted new items)
  useEffect(() => {
    handleSave();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, items]);

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    const newItem = { id: generateId(), text: newItemText.trim(), description: '', completed: false, subTasks: [] };
    setItems([...items, newItem]);
    setNewItemText('');
  };

  const handleToggleItem = (itemId) => {
    setItems(items.map(item => 
      item.id === itemId ? { ...item, completed: !item.completed } : item
    ));
  };

  const handleDeleteItem = (itemId) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const handleUpdateItemText = (itemId, newText) => {
    setItems(items.map(item => 
      item.id === itemId ? { ...item, text: newText } : item
    ));
  };

  const handleUpdateItemDesc = (itemId, newDesc) => {
    setItems(items.map(item => 
      item.id === itemId ? { ...item, description: newDesc } : item
    ));
  };

  const handleAddSubTask = (itemId, newSubTask) => {
    setItems(items.map(item => 
      item.id === itemId ? { ...item, subTasks: [...(item.subTasks || []), newSubTask] } : item
    ));
  };

  const handleToggleSubTask = (itemId, subTaskId) => {
    setItems(items.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          subTasks: item.subTasks.map(st => st.id === subTaskId ? { ...st, completed: !st.completed } : st)
        };
      }
      return item;
    }));
  };

  const handleDeleteSubTask = (itemId, subTaskId) => {
    setItems(items.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          subTasks: item.subTasks.filter(st => st.id !== subTaskId)
        };
      }
      return item;
    }));
  };

  const handleUpdateSubTaskText = (itemId, subTaskId, newText) => {
    setItems(items.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          subTasks: item.subTasks.map(st => st.id === subTaskId ? { ...st, text: newText } : st)
        };
      }
      return item;
    }));
  };

  const handleUpdateSubTaskDesc = (itemId, subTaskId, newDesc) => {
    setItems(items.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          subTasks: item.subTasks.map(st => st.id === subTaskId ? { ...st, description: newDesc } : st)
        };
      }
      return item;
    }));
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
          <div className="card-description-section" style={{ marginBottom: '2rem' }}>
            <h4 style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
               <AlignLeft size={16} /> Description
            </h4>
            <RichTextEditor 
              content={description}
              onChange={setDescription}
            />
          </div>

          <div className="list-items-container">
            <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
               <CheckCircle size={18} className="text-muted" /> Tasks
            </h4>
            
            {items.length === 0 ? (
              <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>No tasks yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {items.map(item => (
                  <TaskItem 
                    key={item.id}
                    item={item}
                    onToggle={handleToggleItem}
                    onDelete={handleDeleteItem}
                    onUpdateText={handleUpdateItemText}
                    onUpdateDesc={handleUpdateItemDesc}
                    onAddSubTask={handleAddSubTask}
                    onToggleSubTask={handleToggleSubTask}
                    onDeleteSubTask={handleDeleteSubTask}
                    onUpdateSubTaskText={handleUpdateSubTaskText}
                    onUpdateSubTaskDesc={handleUpdateSubTaskDesc}
                  />
                ))}
              </div>
            )}
            
            <form onSubmit={handleAddItem} className="add-list-item-form" style={{ marginTop: '1rem' }}>
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
