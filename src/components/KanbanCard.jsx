import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CheckSquare } from 'lucide-react';

const KanbanCard = ({ card, categoryId, onCardClick, isOverlay }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: {
      type: 'Card',
      card,
      categoryId
    }
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  const totalItems = card.items?.length || 0;
  const completedItems = card.items?.filter(i => i.completed)?.length || 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`kanban-card glass-panel ${isDragging ? 'is-dragging' : ''} ${isOverlay ? 'is-overlay' : ''}`}
      onClick={() => onCardClick(categoryId, card)}
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
};

export default KanbanCard;
