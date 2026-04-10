export const getInitialData = () => {
  const saved = localStorage.getItem('mini-notion-data');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved data', e);
    }
  }
  
  // Default Initial Data
  return [
    {
      id: 'cat-1',
      title: 'To Do',
      cards: [
        {
          id: 'c-1',
          title: 'Design UI mockup',
          items: [
            { id: 'i-1', text: 'Choose color scheme', completed: true },
            { id: 'i-2', text: 'Design card layout', completed: false }
          ]
        }
      ]
    },
    {
      id: 'cat-2',
      title: 'In Progress',
      cards: []
    },
    {
      id: 'cat-3',
      title: 'Done',
      cards: []
    }
  ];
};

export const saveData = (data) => {
  localStorage.setItem('mini-notion-data', JSON.stringify(data));
};

export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};
