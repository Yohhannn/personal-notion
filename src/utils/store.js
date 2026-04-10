export const getInitialData = () => {
  const saved = localStorage.getItem('mini-notion-data');
  if (saved) {
    try {
      const parsedData = JSON.parse(saved);
      // Data migration for old format (which was an array of categories directly)
      if (Array.isArray(parsedData) && (parsedData.length === 0 || parsedData[0].cards !== undefined)) {
        // Return a default workspace containing the old categories
        return [{
          id: 'ws-default',
          title: 'Main Workspace',
          categories: parsedData
        }];
      }
      return parsedData;
    } catch (e) {
      console.error('Failed to parse saved data', e);
    }
  }
  
  // Default Initial Data (New Workspace Structure)
  return [
    {
      id: generateId(),
      title: 'Main Workspace',
      categories: [
        {
          id: 'cat-1',
          title: 'To Do',
          cards: [
            {
              id: 'c-1',
              title: 'Design UI mockup',
              description: 'Create a clean, Notion-like UI for the new dashboard section.',
              items: [
                { 
                  id: 'i-1', 
                  text: 'Choose color scheme', 
                  description: 'Stick to dark grays and teals.',
                  completed: true,
                  subTasks: []
                },
                { 
                  id: 'i-2', 
                  text: 'Design card layout', 
                  description: '',
                  completed: false,
                  subTasks: [
                    { id: 'st-1', text: 'Add dragging shadow', description: '', completed: false }
                  ]
                }
              ]
            }
          ]
        },
        { id: 'cat-2', title: 'In Progress', cards: [] },
        { id: 'cat-3', title: 'Done', cards: [] }
      ]
    }
  ];
};

export const saveData = (data) => {
  localStorage.setItem('mini-notion-data', JSON.stringify(data));
};

export const getActiveWorkspaceId = () => {
  return localStorage.getItem('mini-notion-active-ws') || null;
};

export const saveActiveWorkspaceId = (id) => {
  if (id) {
    localStorage.setItem('mini-notion-active-ws', id);
  } else {
    localStorage.removeItem('mini-notion-active-ws');
  }
};

export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};
