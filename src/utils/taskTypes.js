const TASK_TYPES_KEY = 'taskManagerTypes';

// Default task types
export const DEFAULT_TYPES = [
  {
    id: 'general',
    name: 'General',
    emoji: '📋',
    color: '#6366f1', // Indigo
  },
];

// Load task types from localStorage
export const loadTaskTypes = () => {
  try {
    const stored = localStorage.getItem(TASK_TYPES_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // Return default types if none exist
    saveTaskTypes(DEFAULT_TYPES);
    return DEFAULT_TYPES;
  } catch (error) {
    console.error('Error loading task types:', error);
    return DEFAULT_TYPES;
  }
};

// Save task types to localStorage
export const saveTaskTypes = (types) => {
  try {
    localStorage.setItem(TASK_TYPES_KEY, JSON.stringify(types));
  } catch (error) {
    console.error('Error saving task types:', error);
  }
};

// Generate unique ID for task type
export const generateTypeId = () => {
  return `type-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Add a new task type
export const addTaskType = (types, newType) => {
  const typeWithId = {
    ...newType,
    id: generateTypeId(),
  };
  const updatedTypes = [...types, typeWithId];
  saveTaskTypes(updatedTypes);
  return updatedTypes;
};

// Get task type by ID
export const getTaskTypeById = (types, typeId) => {
  return types.find(type => type.id === typeId);
};
