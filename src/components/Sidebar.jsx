import React from 'react';
import { LayoutGrid, Plus, FolderKanban } from 'lucide-react';
import { generateId } from '../utils/store';

const Sidebar = ({ workspaces, activeWorkspaceId, setActiveWorkspaceId, onAddWorkspace }) => {
  const handleAddNew = () => {
    const newWs = {
      id: generateId(),
      title: 'New Set',
      categories: [
        { id: generateId(), title: 'To Do', cards: [] },
        { id: generateId(), title: 'In Progress', cards: [] },
        { id: generateId(), title: 'Done', cards: [] }
      ]
    };
    onAddWorkspace(newWs);
  };

  return (
    <aside className="app-sidebar">
      <div className="sidebar-header">
        <div className="logo-icon">
          <LayoutGrid size={20} />
        </div>
        <h2 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 600 }}>YH Lab Notion</h2>
      </div>

      <div className="sidebar-content">
        <h3 className="sidebar-section-title">YOUR SETS</h3>
        <nav className="workspace-nav">
          {workspaces.map(ws => (
            <button
              key={ws.id}
              className={`workspace-btn ${ws.id === activeWorkspaceId ? 'active' : ''}`}
              onClick={() => setActiveWorkspaceId(ws.id)}
            >
              <FolderKanban size={16} />
              <span className="workspace-title">{ws.title}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="sidebar-footer">
        <button className="add-workspace-btn" onClick={handleAddNew}>
          <Plus size={16} />
          <span>New Set</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
