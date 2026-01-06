import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  format,
  isSameMonth,
  isSameDay,
  startOfDay,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
} from 'date-fns';
import { playCompletionSound } from '../utils/audio';
import { getTaskTypeById } from '../utils/taskTypes';

function CalendarView({ tasks, taskTypes, view, onViewChange, onToggleComplete }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleComplete = (taskId) => {
    playCompletionSound();
    onToggleComplete(taskId);
  };

  // Generate calendar days
  const calendarDays = useMemo(() => {
    if (view === 'month') {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      const startDate = startOfWeek(monthStart);
      const endDate = endOfWeek(monthEnd);

      const days = [];
      let day = startDate;

      while (day <= endDate) {
        days.push(day);
        day = addDays(day, 1);
      }

      return days;
    } else {
      // Week view
      const weekStart = startOfWeek(currentDate);
      const days = [];

      for (let i = 0; i < 7; i++) {
        days.push(addDays(weekStart, i));
      }

      return days;
    }
  }, [currentDate, view]);

  // Get tasks for a specific day
  const getTasksForDay = (day) => {
    return tasks.filter((task) =>
      isSameDay(startOfDay(new Date(task.dueDate)), startOfDay(day))
    );
  };

  // Navigate calendar
  const navigatePrevious = () => {
    if (view === 'month') {
      setCurrentDate(subMonths(currentDate, 1));
    } else {
      setCurrentDate(subWeeks(currentDate, 1));
    }
  };

  const navigateNext = () => {
    if (view === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else {
      setCurrentDate(addWeeks(currentDate, 1));
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">
          {format(currentDate, view === 'month' ? 'MMMM yyyy' : "'Week of' MMM d, yyyy")}
        </h2>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToToday}
            className="glass-button px-4 py-2 text-white text-sm"
          >
            Today
          </motion.button>

          <div className="glass-panel px-1 py-1 flex gap-1">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onViewChange('week')}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                view === 'week'
                  ? 'bg-white/20 text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Week
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onViewChange('month')}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                view === 'month'
                  ? 'bg-white/20 text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Month
            </motion.button>
          </div>

          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={navigatePrevious}
              className="glass-button w-10 h-10 flex items-center justify-center text-white"
            >
              ←
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={navigateNext}
              className="glass-button w-10 h-10 flex items-center justify-center text-white"
            >
              →
            </motion.button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Day headers */}
        <div className={`grid ${view === 'month' ? 'grid-cols-7' : 'grid-cols-7'} gap-2 mb-2`}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-white/60 text-sm font-semibold py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className={`grid ${view === 'month' ? 'grid-cols-7' : 'grid-cols-7'} gap-2 flex-1 overflow-y-auto`}>
          {calendarDays.map((day, index) => {
            const dayTasks = getTasksForDay(day);
            const isToday = isSameDay(day, new Date());
            const isCurrentMonth = isSameMonth(day, currentDate);

            return (
              <motion.div
                key={day.toString()}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.01 }}
                className={`glass-panel p-2 min-h-[120px] ${
                  isToday ? 'ring-2 ring-white/50' : ''
                } ${!isCurrentMonth && view === 'month' ? 'opacity-40' : ''}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-sm font-semibold ${
                      isToday
                        ? 'bg-white text-purple-600 px-2 py-1 rounded-full'
                        : 'text-white/80'
                    }`}
                  >
                    {format(day, 'd')}
                  </span>
                  {dayTasks.length > 0 && (
                    <span className="text-xs text-white/60 bg-white/10 px-2 py-0.5 rounded-full">
                      {dayTasks.length}
                    </span>
                  )}
                </div>

                <div className="space-y-1 overflow-y-auto max-h-[calc(100%-2rem)]">
                  {dayTasks.slice(0, 3).map((task) => {
                    const taskType = getTaskTypeById(taskTypes, task.typeId);
                    return (
                      <motion.div
                        key={task.id}
                        whileHover={{ scale: 1.02 }}
                        className={`text-xs p-2 rounded-lg backdrop-blur-sm cursor-pointer ${
                          task.completed
                            ? 'bg-green-400/20 border border-green-400/30'
                            : task.important
                            ? 'bg-yellow-400/20 border border-yellow-400/30'
                            : 'bg-white/5 border border-white/10'
                        }`}
                        style={{
                          borderLeftWidth: '2px',
                          borderLeftColor: taskType?.color || '#6366f1',
                        }}
                        onClick={() => handleComplete(task.id)}
                      >
                        <div className="flex items-center gap-1">
                          {taskType && <span className="text-[10px]">{taskType.emoji}</span>}
                          {task.important && <span className="text-[10px]">⭐</span>}
                          <span
                            className={`text-white/90 truncate flex-1 ${
                              task.completed ? 'line-through opacity-70' : ''
                            }`}
                          >
                            {task.title}
                          </span>
                        </div>
                        <div className="text-white/50 text-[10px] mt-1">
                          {format(new Date(task.dueDate), 'h:mm a')}
                        </div>
                      </motion.div>
                    );
                  })}
                  {dayTasks.length > 3 && (
                    <div className="text-[10px] text-white/40 text-center">
                      +{dayTasks.length - 3} more
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CalendarView;
