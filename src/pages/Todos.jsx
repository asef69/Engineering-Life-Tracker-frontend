import { useEffect, useState } from 'react';
import { todosAPI } from '../api/todos';

const Todos = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const data = await todosAPI.getTodos();
      setTodos(data);
    } catch (err) {
      setError('Failed to fetch todos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await todosAPI.createTodo(formData);
      setFormData({ title: '', description: '', due_date: '' });
      fetchTodos();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create todo');
    } finally {
      setSubmitting(false);
    }
  };

  const handleComplete = async (id) => {
    try {
      await todosAPI.completeTodo(id);
      fetchTodos();
    } catch (err) {
      setError('Failed to mark todo as complete');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this todo?')) {
      return;
    }

    try {
      await todosAPI.deleteTodo(id);
      fetchTodos();
    } catch (err) {
      setError('Failed to delete todo');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Todos</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Add Todo Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Add New Todo</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {submitting ? 'Adding...' : 'Add Todo'}
          </button>
        </form>
      </div>

      {/* Todos List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Todos</h2>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : todos.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No todos yet. Create one above!</p>
        ) : (
          <div className="space-y-4">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className={`border rounded-lg p-4 ${
                  todo.is_completed ? 'bg-gray-50 opacity-75' : 'bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className={`text-lg font-semibold ${
                        todo.is_completed ? 'line-through text-gray-500' : 'text-gray-800'
                      }`}>
                        {todo.title}
                      </h3>
                      {todo.is_completed && (
                        <span className="text-green-600 text-xl">✓</span>
                      )}
                    </div>
                    {todo.description && (
                      <p className="text-gray-600 mt-1">{todo.description}</p>
                    )}
                    {todo.due_date && (
                      <p className="text-sm text-gray-500 mt-2">
                        Due: {new Date(todo.due_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2 ml-4">
                    {!todo.is_completed && (
                      <button
                        onClick={() => handleComplete(todo.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition text-sm"
                      >
                        Mark Complete
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(todo.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Todos;

