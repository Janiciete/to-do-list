import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TaskInput from './components/TaskInput';
import CalendarView from './components/CalendarView';
import TaskList from './components/TaskList';
import { loadTasks, saveTasks } from './utils/storage';
import { createRecurringInstance } from './utils/recurrence';
import { loadTaskTypes, saveTaskTypes, addTaskType } from './utils/taskTypes';

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskTypes, setTaskTypes] = useState([]);
  const [calendarView, setCalendarView] = useState('month'); // 'week' or 'month'
  const [selectedTypeFilter, setSelectedTypeFilter] = useState(null); // null = show all

  // Load tasks and types on mount
  useEffect(() => {
    const loadedTasks = loadTasks();
    const loadedTypes = loadTaskTypes();
    setTasks(loadedTasks);
    setTaskTypes(loadedTypes);
  }, []);

  // Add new task
  const addTask = (newTask) => {
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  // Remove task
  const removeTask = (taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  // Toggle task completion
  const toggleTaskComplete = (taskId) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const updatedTask = {
          ...task,
          completed: !task.completed,
          lastCompleted: !task.completed ? new Date() : null,
        };

        // If completing a recurring task, create a new instance
        if (!task.completed && task.recurrence && task.recurrence.enabled) {
          const newInstance = createRecurringInstance(updatedTask);
          if (newInstance) {
            // Add the new instance to tasks
            setTimeout(() => {
              setTasks(prev => {
                const newTasks = [...prev, newInstance];
                saveTasks(newTasks);
                return newTasks;
              });
            }, 0);
          }
        }

        return updatedTask;
      }
      return task;
    });
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  // Toggle important status
  const toggleImportant = (taskId) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, important: !task.important } : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  // Add new task type
  const handleAddTaskType = (newType) => {
    const updatedTypes = addTaskType(taskTypes, newType);
    setTaskTypes(updatedTypes);
    return updatedTypes[updatedTypes.length - 1]; // Return the newly added type
  };

  // Filter tasks by type
  const filteredTasks = selectedTypeFilter
    ? tasks.filter(task => task.typeId === selectedTypeFilter)
    : tasks;

  return (
    <div className="gradient-bg w-screen h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full h-full max-w-[1600px] glass-panel p-6 flex gap-6"
      >
        {/* Left Panel - Task Input */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-80 flex-shrink-0"
        >
          <TaskInput
            onAddTask={addTask}
            taskTypes={taskTypes}
            onAddTaskType={handleAddTaskType}
          />
        </motion.div>

        {/* Middle Panel - Calendar View */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex-1 flex flex-col min-w-0"
        >
          <CalendarView
            tasks={filteredTasks}
            taskTypes={taskTypes}
            view={calendarView}
            onViewChange={setCalendarView}
            onToggleComplete={toggleTaskComplete}
          />
        </motion.div>

        {/* Right Panel - Task List */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="w-96 flex-shrink-0"
        >
          <TaskList
            tasks={filteredTasks}
            taskTypes={taskTypes}
            onToggleComplete={toggleTaskComplete}
            onToggleImportant={toggleImportant}
            onRemoveTask={removeTask}
            selectedTypeFilter={selectedTypeFilter}
            onTypeFilterChange={setSelectedTypeFilter}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default App;
