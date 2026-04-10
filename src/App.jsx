import React, { useState, useEffect, useMemo } from 'react';
import { getInitialData, saveData, getActiveWorkspaceId, saveActiveWorkspaceId } from './utils/store';
import Board from './components/Board';
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
import Sidebar from './components/Sidebar';
import './index.css';

function App() {
  const [workspaces, setWorkspaces] = useState([]);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [activeData, setActiveData] = useState(null);

  useEffect(() => {
    const data = getInitialData();
    setWorkspaces(data);
    const savedActive = getActiveWorkspaceId();
    if (savedActive && data.find(w => w.id === savedActive)) {
      setActiveWorkspaceId(savedActive);
    } else if (data.length > 0) {
      setActiveWorkspaceId(data[0].id);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveData(workspaces);
      saveActiveWorkspaceId(activeWorkspaceId);
    }
  }, [workspaces, activeWorkspaceId, isLoaded]);

  const activeWorkspace = useMemo(() => {
    return workspaces.find(w => w.id === activeWorkspaceId) || workspaces[0];
  }, [workspaces, activeWorkspaceId]);

  const handleAddWorkspace = (newWs) => {
    setWorkspaces([...workspaces, newWs]);
    setActiveWorkspaceId(newWs.id);
  };

  const updateActiveWorkspaceCategories = (updater) => {
    setWorkspaces(prevWorkspaces => prevWorkspaces.map(ws => {
      if (ws.id === activeWorkspaceId) {
        const currentCats = ws.categories || [];
        const newCategories = typeof updater === 'function' ? updater(currentCats) : updater;
        return { ...ws, categories: newCategories };
      }
      return ws;
    }));
  };

  const handleAddCategory = (newCategory) => {
    updateActiveWorkspaceCategories(cats => [...cats, newCategory]);
  };

  const handleDeleteCategory = (categoryId) => {
    updateActiveWorkspaceCategories(cats => cats.filter(c => c.id !== categoryId));
  };

  const handleUpdateCategory = (categoryId, newTitle) => {
    updateActiveWorkspaceCategories(cats => cats.map(c => 
      c.id === categoryId ? { ...c, title: newTitle } : c
    ));
  };

  const handleAddCard = (categoryId, newCard) => {
    updateActiveWorkspaceCategories(cats => cats.map(c => 
      c.id === categoryId 
        ? { ...c, cards: [...(c.cards || []), newCard] } 
        : c
    ));
  };

  const handleUpdateCard = (categoryId, updatedCard) => {
    updateActiveWorkspaceCategories(cats => cats.map(c => {
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
    updateActiveWorkspaceCategories(cats => cats.map(c => {
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

    updateActiveWorkspaceCategories(prev => {
      let activeCategoryIndex = -1;
      let overCategoryIndex = -1;
      let activeCardIndex = -1;
      let overCardIndex = -1;

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
        activeCategory.cards = arrayMove(activeCategory.cards, activeCardIndex, overCardIndex);
        updatedCategories[activeCategoryIndex] = activeCategory;
      } else {
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
      updateActiveWorkspaceCategories(prev => {
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
    <div className="layout-container">
      <Sidebar 
        workspaces={workspaces}
        activeWorkspaceId={activeWorkspaceId}
        setActiveWorkspaceId={setActiveWorkspaceId}
        onAddWorkspace={handleAddWorkspace}
      />
      
      <main className="main-content">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          {activeWorkspace && (
            <Board 
              categories={activeWorkspace.categories || []}
              onAddCategory={handleAddCategory}
              onDeleteCategory={handleDeleteCategory}
              onUpdateCategory={handleUpdateCategory}
              onAddCard={handleAddCard}
              onUpdateCard={handleUpdateCard}
              onDeleteCard={handleDeleteCard}
            />
          )}

          <DragOverlay>
            {activeId && activeData?.type === 'Column' ? (
              <CategoryColumn category={activeData.category} isOverlay />
            ) : null}
            {activeId && activeData?.type === 'Card' ? (
              <KanbanCard card={activeData.card} isOverlay />
            ) : null}
          </DragOverlay>
        </DndContext>
      </main>
    </div>
  );
}

export default App;
