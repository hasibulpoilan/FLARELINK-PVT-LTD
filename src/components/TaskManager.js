import React, { useState, useEffect } from 'react';
import { useTransition, animated } from 'react-spring';
import 'font-awesome/css/font-awesome.min.css';

function TaskManager() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [taskTitle, setTaskTitle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [priority, setPriority] = useState('Low');
  const [sortOption, setSortOption] = useState('Date Added');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (taskTitle.trim()) {
      setTasks([
        ...tasks,
        { title: taskTitle, id: Date.now(), completed: false, priority }
      ]);
      setTaskTitle('');
      setPriority('Low');
    }
  };

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
  };

  const toggleCompletion = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const filteredTasks = tasks
    .filter((task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === 'Priority') {
        const priorityOrder = { High: 1, Medium: 2, Low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      } else if (sortOption === 'Title') {
        return a.title.localeCompare(b.title);
      } else {
        return b.id - a.id;
      }
    });

  const transitions = useTransition(filteredTasks, {
    keys: (task) => task.id,
    from: { opacity: 0, transform: 'translateY(-20px)' },
    enter: { opacity: 1, transform: 'translateY(0)' },
    leave: { opacity: 0, transform: 'translateY(20px)' },
  });

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'High':
        return { color: 'red', fontWeight: 'bold' };
      case 'Medium':
        return { color: 'orange' };
      case 'Low':
      default:
        return { color: 'green' };
    }
  };

  return (
    <div>
      <h2>Task Manager</h2>
      <div>
        <input
          type="text"
          placeholder="Enter task title..."
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
        />
        <button onClick={addTask}>
          <i className="fa fa-plus"></i> Add Task
        </button>
      </div>

      <div>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      <input
        type="text"
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginTop: '10px', display: 'block' }}
      />

      <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} style={{ marginTop: '10px' }}>
        <option value="Date Added">Date Added</option>
        <option value="Priority">Priority</option>
        <option value="Title">Title</option>
      </select>

      <ul>
  {transitions((style, task) => (
    <animated.li
      key={task.id}
      style={{ ...style, textDecoration: task.completed ? 'line-through' : 'none' }}
    >
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => toggleCompletion(task.id)}
        style={{ marginRight: '10px' }}
      />
      <div style={{ marginLeft: '10px', display: 'inline-block' }}>
        {task.title}
      </div>
      <span style={{ ...getPriorityStyle(task.priority), marginLeft: '10px' }}>
        {task.priority}
      </span>

      <button onClick={() => deleteTask(task.id)} style={{ marginLeft: '10px' }}>
        <i className="fa fa-trash"></i>
      </button>
    </animated.li>
  ))}
</ul>

    </div>
  );
}

export default TaskManager;
