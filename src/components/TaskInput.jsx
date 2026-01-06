import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateId } from '../utils/storage';

// Helper function to get today at 11:59 PM in datetime-local format
const getTodayAt1159PM = () => {
  const now = new Date();
  now.setHours(23, 59, 0, 0);
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

function TaskInput({ onAddTask, taskTypes, onAddTaskType }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(getTodayAt1159PM());
  const [important, setImportant] = useState(false);
  const [selectedTypeId, setSelectedTypeId] = useState(taskTypes[0]?.id || '');
  const [recurrenceEnabled, setRecurrenceEnabled] = useState(false);
  const [recurrenceInterval, setRecurrenceInterval] = useState(1);
  const [recurrenceUnit, setRecurrenceUnit] = useState('days');

  // New type creation states
  const [showNewTypeForm, setShowNewTypeForm] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');
  const [newTypeEmoji, setNewTypeEmoji] = useState('📌');
  const [newTypeColor, setNewTypeColor] = useState('#6366f1');

  // Handle creating a new task type
  const handleCreateNewType = () => {
    if (!newTypeName.trim()) {
      return;
    }

    const newType = {
      name: newTypeName.trim(),
      emoji: newTypeEmoji,
      color: newTypeColor,
    };

    const createdType = onAddTaskType(newType);

    // Reset new type form and select the newly created type
    setNewTypeName('');
    setNewTypeEmoji('📌');
    setNewTypeColor('#6366f1');
    setShowNewTypeForm(false);
    setSelectedTypeId(createdType.id);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !dueDate || !selectedTypeId) {
      return;
    }

    const newTask = {
      id: generateId(),
      title: title.trim(),
      description: description.trim(),
      dueDate: new Date(dueDate),
      typeId: selectedTypeId,
      important,
      completed: false,
      createdAt: new Date(),
      recurrence: recurrenceEnabled
        ? {
            enabled: true,
            interval: parseInt(recurrenceInterval),
            unit: recurrenceUnit,
          }
        : { enabled: false },
    };

    onAddTask(newTask);

    // Reset form
    setTitle('');
    setDescription('');
    setDueDate(getTodayAt1159PM());
    setImportant(false);
    setRecurrenceEnabled(false);
    setRecurrenceInterval(1);
    setRecurrenceUnit('days');
    // Keep the same type selected for next task
  };

  return (
    <div className="h-full flex flex-col">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1">
        <div>
          <label className="block text-white/80 text-sm mb-2">Task Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-glass w-full px-4 py-3"
            placeholder="Enter task title..."
            required
          />
        </div>

        {/* Task Type Dropdown */}
        <div>
          <label className="block text-white/80 text-sm mb-2">Task Type *</label>
          <div className="space-y-2">
            <select
              value={selectedTypeId}
              onChange={(e) => {
                if (e.target.value === '__new__') {
                  setShowNewTypeForm(true);
                } else {
                  setSelectedTypeId(e.target.value);
                  setShowNewTypeForm(false);
                }
              }}
              className="input-glass w-full px-4 py-3"
              required
            >
              {taskTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.emoji} {type.name}
                </option>
              ))}
              <option value="__new__">➕ Add New Type</option>
            </select>

            {/* Inline New Type Form */}
            <AnimatePresence>
              {showNewTypeForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="glass-panel p-3 space-y-2"
                >
                  <input
                    type="text"
                    value={newTypeName}
                    onChange={(e) => setNewTypeName(e.target.value)}
                    className="input-glass w-full px-3 py-2 text-sm"
                    placeholder="Type name..."
                  />
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-white/60 text-xs mb-1">Emoji</label>
                      <input
                        type="text"
                        value={newTypeEmoji}
                        onChange={(e) => setNewTypeEmoji(e.target.value)}
                        className="input-glass w-full px-3 py-2 text-sm text-center"
                        maxLength="2"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-white/60 text-xs mb-1">Color</label>
                      <input
                        type="color"
                        value={newTypeColor}
                        onChange={(e) => setNewTypeColor(e.target.value)}
                        className="input-glass w-full h-[36px] cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCreateNewType}
                      className="flex-1 glass-button px-3 py-2 text-white text-sm"
                    >
                      Create
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setShowNewTypeForm(false);
                        setSelectedTypeId(taskTypes[0]?.id || '');
                      }}
                      className="flex-1 glass-button px-3 py-2 text-white text-sm"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div>
          <label className="block text-white/80 text-sm mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-glass w-full px-4 py-3 min-h-[100px] resize-none"
            placeholder="Add details..."
          />
        </div>

        <div>
          <label className="block text-white/80 text-sm mb-2">Due Date *</label>
          <input
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="input-glass w-full px-4 py-3"
            required
          />
        </div>

        <div className="glass-panel p-4 space-y-3">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="recurring"
              checked={recurrenceEnabled}
              onChange={(e) => setRecurrenceEnabled(e.target.checked)}
              className="w-5 h-5 rounded cursor-pointer"
            />
            <label htmlFor="recurring" className="text-white/80 cursor-pointer">
              Make Recurring
            </label>
          </div>

          {recurrenceEnabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-3"
            >
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-white/60 text-xs mb-1">Every</label>
                  <input
                    type="number"
                    min="1"
                    value={recurrenceInterval}
                    onChange={(e) => setRecurrenceInterval(e.target.value)}
                    className="input-glass w-full px-3 py-2 text-sm"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-white/60 text-xs mb-1">Unit</label>
                  <select
                    value={recurrenceUnit}
                    onChange={(e) => setRecurrenceUnit(e.target.value)}
                    className="input-glass w-full px-3 py-2 text-sm"
                  >
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="important"
              checked={important}
              onChange={(e) => setImportant(e.target.checked)}
              className="w-5 h-5 rounded cursor-pointer"
            />
            <label htmlFor="important" className="text-white/80 cursor-pointer">
              Mark as <span className="font-bold">Important</span>
            </label>
          </div>
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="glass-button px-6 py-4 text-white font-semibold mt-auto"
        >
          Add Task
        </motion.button>
      </form>
    </div>
  );
}

export default TaskInput;
