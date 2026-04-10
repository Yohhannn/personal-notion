import React, { useState, useEffect, useRef } from 'react';
import { Trash2, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { generateId } from '../utils/store';

const AutoResizeTextarea = ({ value, onChange, placeholder, className }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      className={className}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={1}
      style={{ overflow: 'hidden', resize: 'none' }}
    />
  );
};

const TaskItem = ({ 
  item, 
  onToggle, 
  onDelete, 
  onUpdateText, 
  onUpdateDesc, 
  onAddSubTask,
  onToggleSubTask,
  onDeleteSubTask,
  onUpdateSubTaskText,
  onUpdateSubTaskDesc
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAddingSubTask, setIsAddingSubTask] = useState(false);
  const [newSubTaskText, setNewSubTaskText] = useState('');

  const handleAddSubTask = (e) => {
    e.preventDefault();
    if (!newSubTaskText.trim()) return;
    onAddSubTask(item.id, { id: generateId(), text: newSubTaskText.trim(), description: '', completed: false });
    setNewSubTaskText('');
    setIsAddingSubTask(false);
    setIsExpanded(true);
  };

  const hasSubTasks = item.subTasks && item.subTasks.length > 0;

  return (
    <div className="task-container">
      <div className="task-main-row">
        {hasSubTasks ? (
          <button className="icon-btn collapse-btn" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        ) : (
          <div style={{ width: '28px' }}></div>
        )}

        <input 
          type="checkbox" 
          className="list-item-checkbox" 
          checked={item.completed} 
          onChange={() => onToggle(item.id)} 
        />
        
        <div className="task-content">
          <input 
            type="text"
            className={`task-text-input ${item.completed ? 'completed' : ''}`}
            value={item.text}
            onChange={(e) => onUpdateText(item.id, e.target.value)}
            placeholder="Task name"
          />
          <AutoResizeTextarea
            className="task-desc-input"
            value={item.description || ''}
            onChange={(e) => onUpdateDesc(item.id, e.target.value)}
            placeholder="Add quick description..."
          />
        </div>

        <div className="task-actions">
          <button className="icon-btn" onClick={() => setIsAddingSubTask(true)} title="Add sub-task">
            <Plus size={16} />
          </button>
          <button className="icon-btn danger" onClick={() => onDelete(item.id)} title="Delete task">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {(isExpanded || isAddingSubTask) && (
        <div className="subtasks-container">
          {item.subTasks?.map(subTask => (
            <div key={subTask.id} className="task-main-row sub-task-row">
              <input 
                type="checkbox" 
                className="list-item-checkbox" 
                checked={subTask.completed} 
                onChange={() => onToggleSubTask(item.id, subTask.id)} 
              />
              
              <div className="task-content">
                <input 
                  type="text"
                  className={`task-text-input ${subTask.completed ? 'completed' : ''}`}
                  value={subTask.text}
                  onChange={(e) => onUpdateSubTaskText(item.id, subTask.id, e.target.value)}
                  placeholder="Sub-task name"
                />
                <AutoResizeTextarea
                  className="task-desc-input"
                  value={subTask.description || ''}
                  onChange={(e) => onUpdateSubTaskDesc(item.id, subTask.id, e.target.value)}
                  placeholder="Add quick description..."
                />
              </div>

              <div className="task-actions">
                <button className="icon-btn danger" onClick={() => onDeleteSubTask(item.id, subTask.id)} title="Delete sub-task">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          {isAddingSubTask && (
            <form onSubmit={handleAddSubTask} className="task-main-row add-subtask-form">
              <input 
                type="text"
                autoFocus
                placeholder="Sub-task name..." 
                value={newSubTaskText}
                onChange={e => setNewSubTaskText(e.target.value)}
                onBlur={() => !newSubTaskText.trim() && setIsAddingSubTask(false)}
                className="task-text-input"
              />
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskItem;
