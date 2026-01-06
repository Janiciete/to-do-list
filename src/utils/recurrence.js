import { addDays, addWeeks, addMonths } from 'date-fns';

// Calculate the next due date for a recurring task
export const getNextDueDate = (currentDueDate, recurrence) => {
  if (!recurrence || !recurrence.enabled) {
    return null;
  }

  const { interval, unit } = recurrence;
  const current = new Date(currentDueDate);

  switch (unit) {
    case 'days':
      return addDays(current, interval);
    case 'weeks':
      return addWeeks(current, interval);
    case 'months':
      return addMonths(current, interval);
    default:
      return null;
  }
};

// Check if a task should be regenerated
export const shouldRegenerateTask = (task) => {
  if (!task.recurrence || !task.recurrence.enabled) {
    return false;
  }

  // If task is completed and has recurrence
  return task.completed;
};

// Create a new instance of a recurring task
export const createRecurringInstance = (originalTask) => {
  const nextDueDate = getNextDueDate(originalTask.dueDate, originalTask.recurrence);

  if (!nextDueDate) {
    return null;
  }

  return {
    ...originalTask,
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    dueDate: nextDueDate,
    completed: false,
    createdAt: new Date(),
    lastCompleted: null,
  };
};
