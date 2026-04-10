import React, { useState } from 'react';
import { MoreHorizontal, Plus, AlignLeft, CheckSquare } from 'lucide-react';
import { generateId } from '../utils/store';

const CategoryColumn = ({ category, onAddCard, onCardClick, onDeleteCategory }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');

  const handleAddCard = (e) => {
    e.preventDefault();
    if (!newCardTitle.trim()) return;
    
    const newCard = {
      id: generateId(),
      title: newCardTitle.trim(),
      items: []
    };
    
    onAddCard(category.id, newCard);
    setNewCardTitle('');
    setIsAdding(false);
  };

  return (
    <div className="category-column">
      <div className="category-header">
        <h3 className="category-title">{category.title} <span className="text-muted" style={{ fontWeight: 'normal', fontSize: '0.85rem' }}>({category.cards?.length || 0})</span></h3>
        <button className="icon-btn" onClick={() => {
          if(window.confirm(`Delete category "${category.title}"?`)) onDeleteCategory(category.id);
        }}>
          <MoreHorizontal size={20} />
        </button>
      </div>
      
      <div className="category-cards">
        {category.cards?.map(card => {
          const totalItems = card.items?.length || 0;
          const completedItems = card.items?.filter(i => i.completed)?.length || 0;
          
          return (
            <div 
              key={card.id} 
              className="kanban-card glass-panel"
              onClick={() => onCardClick(category.id, card)}
            >
              <h4 className="card-title">{card.title}</h4>
              {totalItems > 0 && (
                <div className="card-meta">
                  <div className="card-meta-item">
                    <CheckSquare size={14} />
                    <span>{completedItems}/{totalItems}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        
        {isAdding ? (
          <form onSubmit={handleAddCard} className="glass-panel" style={{ padding: '0.75rem', marginTop: '0.75rem' }}>
            <input 
              type="text" 
              placeholder="Card title..." 
              value={newCardTitle}
              onChange={e => setNewCardTitle(e.target.value)}
              autoFocus
              style={{ marginBottom: '0.5rem' }}
            />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" style={{ flex: 1 }}>Add</button>
              <button type="button" className="danger" onClick={() => setIsAdding(false)} style={{ padding: '0.5rem' }}>Cancel</button>
            </div>
          </form>
        ) : (
          <button className="add-card-btn" onClick={() => setIsAdding(true)}>
            <Plus size={18} /> Add a card
          </button>
        )}
      </div>
    </div>
  );
};

export default CategoryColumn;
