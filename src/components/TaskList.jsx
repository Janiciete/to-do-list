import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { playCompletionSound } from '../utils/audio';
import { getTaskTypeById } from '../utils/taskTypes';

function TaskList({ tasks, taskTypes, onToggleComplete, onToggleImportant, onRemoveTask, selectedTypeFilter, onTypeFilterChange }) {
  // Group tasks by type
  const groupedTasks = tasks.reduce((acc, task) => {
    const typeId = task.typeId || 'unknown';
    if (!acc[typeId]) {
      acc[typeId] = [];
    }
    acc[typeId].push(task);
    return acc;
  }, {});

  // Sort tasks within each group: incomplete tasks first, then by important status and due date
  Object.keys(groupedTasks).forEach((typeId) => {
    groupedTasks[typeId].sort((a, b) => {
      // Completed tasks go to bottom
      if (a.completed && !b.completed) return 1;
      if (!a.completed && b.completed) return -1;

      // Among incomplete tasks, important ones come first
      if (a.important && !b.important) return -1;
      if (!a.important && b.important) return 1;

      // Then sort by due date
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
  });

  const handleComplete = (taskId) => {
    playCompletionSound();
    onToggleComplete(taskId);
  };

  const getTaskStatus = (task) => {
    if (task.completed) return 'completed';
    const now = new Date();
    const dueDate = new Date(task.dueDate);
    const diffHours = (dueDate - now) / (1000 * 60 * 60);

    if (diffHours < 0) return 'overdue';
    if (diffHours < 24) return 'urgent';
    return 'normal';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'border-green-400/30 bg-green-400/5';
      case 'overdue':
        return 'border-red-400/30 bg-red-400/5';
      case 'urgent':
        return 'border-yellow-400/30 bg-yellow-400/5';
      default:
        return 'border-white/10';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-white mb-3">
          Tasks ({tasks.filter(t => !t.completed).length})
        </h2>

        {/* Type Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onTypeFilterChange(null)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
              selectedTypeFilter === null
                ? 'bg-white/20 text-white'
                : 'bg-white/5 text-white/60 hover:text-white'
            }`}
          >
            All
          </motion.button>
          {taskTypes.map((type) => (
            <motion.button
              key={type.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onTypeFilterChange(type.id)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                selectedTypeFilter === type.id
                  ? 'text-white'
                  : 'bg-white/5 text-white/60 hover:text-white'
              }`}
              style={{
                backgroundColor: selectedTypeFilter === type.id ? type.color : undefined,
              }}
            >
              {type.emoji} {type.name}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        <AnimatePresence mode="popLayout">
          {Object.keys(groupedTasks).map((typeId) => {
            const type = getTaskTypeById(taskTypes, typeId);
            const typeTasks = groupedTasks[typeId];

            if (!type) return null;

            return (
              <div key={typeId}>
                {/* Group Header */}
                <div className="flex items-center gap-2 mb-2 px-2">
                  <span className="text-lg">{type.emoji}</span>
                  <h3 className="text-white/80 text-sm font-semibold">{type.name}</h3>
                  <span className="text-white/40 text-xs">({typeTasks.length})</span>
                </div>

                {/* Tasks in this group */}
                <div className="space-y-2">
                  {typeTasks.map((task, index) => {
                    const status = getTaskStatus(task);
                    return (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ delay: index * 0.05 }}
                        className={`task-item p-4 ${getStatusColor(status)} ${
                          task.completed ? 'opacity-50' : ''
                        }`}
                        style={{
                          borderLeftWidth: '3px',
                          borderLeftColor: type.color,
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleComplete(task.id)}
                            className={`flex-shrink-0 w-6 h-6 rounded-full border-2 mt-0.5 ${
                              task.completed
                                ? 'bg-green-400 border-green-400'
                                : 'border-white/40 hover:border-white/60'
                            } transition-all duration-200 flex items-center justify-center`}
                          >
                            {task.completed && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="text-white text-sm"
                              >
                                ✓
                              </motion.span>
                            )}
                          </motion.button>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-base">{type.emoji}</span>
                              <h3
                                className={`text-white font-medium ${
                                  task.completed ? 'line-through opacity-70' : ''
                                }`}
                              >
                                {task.title}
                              </h3>
                            </div>

                    {task.description && (
                      <p className="text-white/60 text-sm mb-2 line-clamp-2">
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center gap-3 text-xs text-white/50">
                      <span>
                        📅 {format(new Date(task.dueDate), 'MMM d, h:mm a')}
                      </span>
                      {task.recurrence && task.recurrence.enabled && (
                        <span className="flex items-center gap-1">
                          🔄 Every {task.recurrence.interval}{' '}
                          {task.recurrence.unit}
                        </span>
                      )}
                    </div>
                  </div>

                          <div className="flex flex-col gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => onToggleImportant(task.id)}
                              className="text-lg"
                            >
                              {task.important ? '⭐' : '☆'}
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => onRemoveTask(task.id)}
                              className="text-red-400 hover:text-red-300 text-lg"
                            >
                              🗑️
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </AnimatePresence>

        {tasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-white/40 mt-20"
          >
            <p className="text-4xl mb-4">📝</p>
            <p>No tasks yet. Add one to get started!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default TaskList;
