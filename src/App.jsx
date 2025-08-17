import { useState, useEffect } from 'react'

function App() {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')
  const [filter, setFilter] = useState('all') // all, active, completed

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks')
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
  }, [])

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  const addTask = (e) => {
    e.preventDefault()
    if (newTask.trim()) {
      const task = {
        id: Date.now(),
        text: newTask.trim(),
        completed: false
      }
      setTasks([...tasks, task])
      setNewTask('')
    }
  }

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id))
    if (editingId === id) {
      setEditingId(null)
      setEditText('')
    }
  }

  const startEditing = (id, text) => {
    setEditingId(id)
    setEditText(text)
  }

  const saveEdit = (id) => {
    if (editText.trim()) {
      setTasks(tasks.map(task =>
        task.id === id ? { ...task, text: editText.trim() } : task
      ))
      setEditingId(null)
      setEditText('')
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditText('')
  }

  const clearCompleted = () => {
    setTasks(tasks.filter(task => !task.completed))
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed
    if (filter === 'completed') return task.completed
    return true
  })

  const activeTasksCount = tasks.filter(task => !task.completed).length
  const completedTasksCount = tasks.filter(task => task.completed).length

  return (
    <div
      className="min-h-screen p-3 sm:p-5 flex justify-center items-start"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}
    >
      <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-10 w-full max-w-[600px] mx-auto">
        {/* Header */}
        <header className="text-center mb-6 sm:mb-8">
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3"
            style={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            ✨ Task Manager
          </h1>
          <p className="text-gray-600 text-base sm:text-lg font-medium">
            Stay organized and boost your productivity
          </p>
        </header>

        {/* Task Form */}
        <form onSubmit={addTask} className="mb-8">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-3 items-center">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full sm:flex-1 px-5 py-4 border-2 border-gray-200 rounded-xl text-base transition-all duration-300 bg-white focus:outline-none focus:shadow-lg focus:shadow-blue-500/10"
              style={{ focus: { borderColor: '#667eea' } }}
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-4 text-white border-none rounded-xl text-base font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 whitespace-nowrap"
              style={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                boxShadow: '0 10px 20px rgba(102, 126, 234, 0.3)'
              }}
            >
              Add Task
            </button>
          </div>
        </form>

        {/* Filters */}
        {tasks.length > 0 && (
          <div className="flex gap-2 mb-6 flex-wrap justify-center">
            <button
              className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 ${filter === 'all'
                ? 'text-white border-2'
                : 'bg-gray-50 border-2 border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300'
                }`}
              style={filter === 'all' ? {
                background: '#667eea',
                borderColor: '#667eea'
              } : {}}
              onClick={() => setFilter('all')}
            >
              All ({tasks.length})
            </button>
            <button
              className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 ${filter === 'active'
                ? 'text-white border-2'
                : 'bg-gray-50 border-2 border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300'
                }`}
              style={filter === 'active' ? {
                background: '#667eea',
                borderColor: '#667eea'
              } : {}}
              onClick={() => setFilter('active')}
            >
              Active ({activeTasksCount})
            </button>
            <button
              className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 ${filter === 'completed'
                ? 'text-white border-2'
                : 'bg-gray-50 border-2 border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300'
                }`}
              style={filter === 'completed' ? {
                background: '#667eea',
                borderColor: '#667eea'
              } : {}}
              onClick={() => setFilter('completed')}
            >
              Completed ({completedTasksCount})
            </button>
            {completedTasksCount > 0 && (
              <button
                onClick={clearCompleted}
                className="px-4 py-2.5 bg-red-100 border-2 border-red-200 rounded-lg text-red-700 font-medium text-sm cursor-pointer transition-all duration-300 hover:bg-red-200 hover:border-red-300"
              >
                Clear Completed
              </button>
            )}
          </div>
        )}

        {/* Tasks Container */}
        <div className="mb-6">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-10 px-5 text-gray-600">
              {filter === 'all' ? (
                <>
                  <p className="text-xl font-semibold text-gray-700 mb-2">No tasks yet! 🎉</p>
                  <p className="text-lg">Add your first task above to get started.</p>
                </>
              ) : filter === 'active' ? (
                <p className="text-xl font-semibold text-gray-700">No active tasks! All done! 🎯</p>
              ) : (
                <p className="text-xl font-semibold text-gray-700">No completed tasks yet! Keep going! 💪</p>
              )}
            </div>
          ) : (
            filteredTasks.map(task => (
              <div
                key={task.id}
                className={`flex items-center justify-between p-4 sm:p-5 bg-white border-2 border-gray-200 rounded-xl mb-3 transition-all duration-300 hover:border-gray-300 hover:shadow-lg hover:shadow-black/5 animate-slide-in ${task.completed ? 'bg-green-50 border-green-200 opacity-80' : ''
                  }`}
              >
                <div className="flex items-center gap-3 sm:gap-4 flex-1">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="w-5 h-5 accent-green-500 cursor-pointer"
                  />
                  {editingId === task.id ? (
                    <div className="flex flex-col gap-2 sm:gap-2.5 flex-1">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="px-4 py-3 border-2 rounded-lg text-sm bg-white focus:outline-none focus:shadow-lg"
                        style={{
                          borderColor: '#667eea',
                          boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
                        }}
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => saveEdit(task.id)}
                          className="px-4 py-2 bg-green-500 text-white border-none rounded-lg font-medium cursor-pointer transition-all duration-300 hover:bg-green-600 text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="px-4 py-2 bg-gray-200 text-gray-700 border-none rounded-lg font-medium cursor-pointer transition-all duration-300 hover:bg-gray-300 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <span className={`text-base flex-1 break-words ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'
                      }`}>
                      {task.text}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  {editingId !== task.id && (
                    <>
                      <button
                        onClick={() => startEditing(task.id, task.text)}
                        className="bg-none border-none text-xl cursor-pointer p-2 rounded-lg transition-all duration-300 hover:bg-gray-100 hover:scale-110"
                        title="Edit task"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="bg-none border-none text-xl cursor-pointer p-2 rounded-lg transition-all duration-300 hover:bg-red-100 hover:scale-110"
                        title="Delete task"
                      >
                        🗑️
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Stats */}
        {tasks.length > 0 && (
          <div className="text-center p-5 bg-gray-50 rounded-xl border-2 border-gray-200">
            <p className="text-gray-600 font-medium text-sm">
              {activeTasksCount} task{activeTasksCount !== 1 ? 's' : ''} remaining
              {completedTasksCount > 0 && ` • ${completedTasksCount} completed`}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
