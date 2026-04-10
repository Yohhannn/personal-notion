import React, { useState, useMemo } from 'react';
import { MoreHorizontal, Plus } from 'lucide-react';
import { generateId } from '../utils/store';
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import KanbanCard from './KanbanCard';

const CategoryColumn = ({ category, onAddCard, onCardClick, onDeleteCategory, isOverlay }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: category.id,
    data: {
      type: 'Column',
      category
    }
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    height: '100%',
  };

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

  const cardIds = useMemo(() => category.cards?.map(c => c.id) || [], [category.cards]);

  return (
    <div 
      className={`category-column ${isOverlay ? 'is-overlay' : ''}`}
      ref={setNodeRef}
      style={style}
    >
      <div className="category-header" {...attributes} {...listeners}>
        <h3 className="category-title">{category.title} <span className="text-muted" style={{ fontWeight: 'normal', fontSize: '0.85rem' }}>({category.cards?.length || 0})</span></h3>
        <button className="icon-btn" onPointerDown={(e) => {
          // Prevent drag from starting when clicking settings button
          e.stopPropagation();
        }} onClick={() => {
          if(window.confirm(`Delete category "${category.title}"?`)) onDeleteCategory(category.id);
        }}>
          <MoreHorizontal size={20} />
        </button>
      </div>
      
      <div className="category-cards">
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          {category.cards?.map(card => (
            <KanbanCard 
              key={card.id}
              card={card}
              categoryId={category.id}
              onCardClick={onCardClick}
            />
          ))}
        </SortableContext>
        
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
