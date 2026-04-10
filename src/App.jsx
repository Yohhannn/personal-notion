import React, { useState, useEffect } from 'react';
import { getInitialData, saveData } from './utils/store';
import Board from './components/Board';
import { LayoutGrid } from 'lucide-react';
import './index.css';

function App() {
  const [categories, setCategories] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setCategories(getInitialData());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveData(categories);
    }
  }, [categories, isLoaded]);

  const handleAddCategory = (newCategory) => {
    setCategories([...categories, newCategory]);
  };

  const handleDeleteCategory = (categoryId) => {
    setCategories(categories.filter(c => c.id !== categoryId));
  };

  const handleAddCard = (categoryId, newCard) => {
    setCategories(categories.map(c => 
      c.id === categoryId 
        ? { ...c, cards: [...(c.cards || []), newCard] } 
        : c
    ));
  };

  const handleUpdateCard = (categoryId, updatedCard) => {
    setCategories(categories.map(c => {
      if (c.id === categoryId) {
        return {
          ...c,
          cards: c.cards.map(card => card.id === updatedCard.id ? updatedCard : card)
        };
      }
      return c;
    }));
  };

  const handleDeleteCard = (categoryId, cardId) => {
    setCategories(categories.map(c => {
      if (c.id === categoryId) {
        return {
          ...c,
          cards: c.cards.filter(card => card.id !== cardId)
        };
      }
      return c;
    }));
  };

  if (!isLoaded) return null;

  return (
    <>
      <header className="app-header glass-panel" style={{ borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, var(--bg-accent) 0%, rgba(139, 92, 246, 1) 100%)', 
            padding: '0.5rem', 
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}>
            <LayoutGrid size={24} />
          </div>
          <h1 style={{ margin: 0, fontSize: '1.5rem' }} className="title-glow">Mini Notion</h1>
        </div>
      </header>

      <Board 
        categories={categories}
        onAddCategory={handleAddCategory}
        onDeleteCategory={handleDeleteCategory}
        onAddCard={handleAddCard}
        onUpdateCard={handleUpdateCard}
        onDeleteCard={handleDeleteCard}
      />
    </>
  );
}

export default App;
