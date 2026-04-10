import React, { useState } from 'react';
import CategoryColumn from './CategoryColumn';
import CardModal from './CardModal';
import { Plus } from 'lucide-react';
import { generateId } from '../utils/store';

const Board = ({ 
  categories, 
  onAddCategory, 
  onDeleteCategory,
  onAddCard, 
  onUpdateCard,
  onDeleteCard
}) => {
  const [selectedCardInfo, setSelectedCardInfo] = useState(null); // { categoryId, card }
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryTitle, setNewCategoryTitle] = useState('');

  const handleCardClick = (categoryId, card) => {
    setSelectedCardInfo({ categoryId, card });
  };

  const handleCloseModal = () => {
    setSelectedCardInfo(null);
  };

  const handleAddCategorySubmit = (e) => {
    e.preventDefault();
    if (!newCategoryTitle.trim()) return;
    
    onAddCategory({
      id: generateId(),
      title: newCategoryTitle.trim(),
      cards: []
    });
    
    setNewCategoryTitle('');
    setIsAddingCategory(false);
  };

  return (
    <div className="kanban-board">
      {categories.map(category => (
        <CategoryColumn 
          key={category.id} 
          category={category} 
          onAddCard={onAddCard}
          onCardClick={handleCardClick}
          onDeleteCategory={onDeleteCategory}
        />
      ))}

      <div className="add-category-column">
        {isAddingCategory ? (
          <form onSubmit={handleAddCategorySubmit} className="glass-panel" style={{ padding: '1rem' }}>
            <input 
              type="text" 
              placeholder="Category name..." 
              value={newCategoryTitle}
              onChange={e => setNewCategoryTitle(e.target.value)}
              autoFocus
              style={{ marginBottom: '0.75rem' }}
            />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" style={{ flex: 1 }}>Save</button>
              <button type="button" className="danger" onClick={() => setIsAddingCategory(false)} style={{ padding: '0.5rem' }}>Cancel</button>
            </div>
          </form>
        ) : (
          <button className="add-category-btn" onClick={() => setIsAddingCategory(true)}>
            <Plus size={20} className="text-muted" style={{ marginRight: '0.5rem' }} /> Add another list
          </button>
        )}
      </div>

      {selectedCardInfo && (
        <CardModal 
          categoryId={selectedCardInfo.categoryId}
          card={selectedCardInfo.card}
          onClose={handleCloseModal}
          onUpdateCard={onUpdateCard}
          onDeleteCard={onDeleteCard}
        />
      )}
    </div>
  );
};

export default Board;
