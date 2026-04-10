import React, { useState, useEffect } from 'react';
import { getInitialData, saveData } from './utils/store';
import Board from './components/Board';
import { LayoutGrid } from 'lucide-react';
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors 
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';
import CategoryColumn from './components/CategoryColumn';
import KanbanCard from './components/KanbanCard';
import './index.css';

function App() {
  const [categories, setCategories] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [activeData, setActiveData] = useState(null);

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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
    setActiveData(active.data.current);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveACard = active.data.current?.type === 'Card';
    const isOverACard = over.data.current?.type === 'Card';
    const isOverAColumn = over.data.current?.type === 'Column';

    if (!isActiveACard) return;

    // Dragging a Card
    setCategories(prev => {
      let activeCategoryIndex = -1;
      let overCategoryIndex = -1;
      let activeCardIndex = -1;
      let overCardIndex = -1;

      // Find the active card's category
      for (let i = 0; i < prev.length; i++) {
        const itemIdx = prev[i].cards?.findIndex(c => c.id === activeId);
        if (itemIdx !== -1 && itemIdx !== undefined) {
          activeCategoryIndex = i;
          activeCardIndex = itemIdx;
          break;
        }
      }

      if (isOverACard) {
        for (let i = 0; i < prev.length; i++) {
          const itemIdx = prev[i].cards?.findIndex(c => c.id === overId);
          if (itemIdx !== -1 && itemIdx !== undefined) {
            overCategoryIndex = i;
            overCardIndex = itemIdx;
            break;
          }
        }
      } else if (isOverAColumn) {
        overCategoryIndex = prev.findIndex(c => c.id === overId);
        overCardIndex = prev[overCategoryIndex]?.cards?.length || 0;
      }

      if (activeCategoryIndex === -1 || overCategoryIndex === -1) return prev;

      const updatedCategories = [...prev];
      const activeCategory = { ...updatedCategories[activeCategoryIndex] };
      const overCategory = activeCategoryIndex === overCategoryIndex ? activeCategory : { ...updatedCategories[overCategoryIndex] };
      
      activeCategory.cards = [...(activeCategory.cards || [])];
      overCategory.cards = [...(overCategory.cards || [])];

      if (activeCategoryIndex === overCategoryIndex) {
        // Same column
        activeCategory.cards = arrayMove(activeCategory.cards, activeCardIndex, overCardIndex);
        updatedCategories[activeCategoryIndex] = activeCategory;
      } else {
        // Different column
        const [movedCard] = activeCategory.cards.splice(activeCardIndex, 1);
        overCategory.cards.splice(overCardIndex, 0, movedCard);
        
        updatedCategories[activeCategoryIndex] = activeCategory;
        updatedCategories[overCategoryIndex] = overCategory;
      }

      return updatedCategories;
    });
  };

  const handleDragEnd = (event) => {
    setActiveId(null);
    setActiveData(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveAColumn = active.data.current?.type === 'Column';

    if (isActiveAColumn) {
      setCategories(prev => {
        const activeCategoryIndex = prev.findIndex(c => c.id === activeId);
        const overCategoryIndex = prev.findIndex(c => c.id === overId);
        if (activeCategoryIndex !== -1 && overCategoryIndex !== -1) {
          return arrayMove(prev, activeCategoryIndex, overCategoryIndex);
        }
        return prev;
      });
    }
  };

  if (!isLoaded) return null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
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

      <DragOverlay>
        {activeId && activeData?.type === 'Column' ? (
          <CategoryColumn category={activeData.category} isOverlay />
        ) : null}
        {activeId && activeData?.type === 'Card' ? (
          <KanbanCard card={activeData.card} isOverlay />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default App;
