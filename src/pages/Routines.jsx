import { useEffect, useState } from 'react';
import { routinesAPI } from '../api/routines';

const Routines = () => {
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    level: '',
    term: '',
    file: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [filterLevel, setFilterLevel] = useState('');
  const [filterTerm, setFilterTerm] = useState('');
  const [filePreview, setFilePreview] = useState(null);

  useEffect(() => {
    fetchRoutines();
  }, [filterLevel, filterTerm]);

  const fetchRoutines = async () => {
    try {
      setLoading(true);
      const level = filterLevel || null;
      const term = filterTerm || null;
      const data = await routinesAPI.getRoutines(level, term);
      setRoutines(data);
    } catch (err) {
      setError('Failed to fetch routines');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    if (!formData.file) {
      setError('Please select a file');
      setSubmitting(false);
      return;
    }

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('level', formData.level);
      data.append('term', formData.term);
      data.append('file', formData.file);

      await routinesAPI.createRoutine(data);
      setFormData({ title: '', level: '', term: '', file: null });
      setFilePreview(null);
      document.getElementById('file-input').value = '';
      fetchRoutines();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload routine');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this routine?')) {
      return;
    }

    try {
      await routinesAPI.deleteRoutine(id);
      fetchRoutines();
    } catch (err) {
      setError('Failed to delete routine');
    }
  };

  const groupedRoutines = routines.reduce((acc, routine) => {
    const key = `Level ${routine.level} - Term ${routine.term}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(routine);
    return acc;
  }, {});

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Class Routines</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Add Routine Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Upload New Routine</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                Level *
              </label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Level</option>
                <option value="1">Level 1</option>
                <option value="2">Level 2</option>
                <option value="3">Level 3</option>
                <option value="4">Level 4</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Term *
              </label>
              <select
                value={formData.term}
                onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Term</option>
                <option value="1">Term 1</option>
                <option value="2">Term 2</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              File (PDF or Image) *
            </label>
            <input
              id="file-input"
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.webp"
              onChange={(e) => {
                const file = e.target.files[0];
                setFormData({ ...formData, file: file });
                
                // Create preview for images
                if (file && file.type.startsWith('image/')) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setFilePreview(reader.result);
                  };
                  reader.readAsDataURL(file);
                } else {
                  setFilePreview(null);
                }
              }}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {filePreview && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                <img
                  src={filePreview}
                  alt="Preview"
                  className="max-w-xs max-h-48 rounded-md border border-gray-200"
                />
              </div>
            )}
            {formData.file && !filePreview && formData.file.type === 'application/pdf' && (
              <div className="mt-3">
                <p className="text-sm text-gray-600">
                  Selected: <span className="font-medium">{formData.file.name}</span> (PDF)
                </p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {submitting ? 'Uploading...' : 'Upload Routine'}
          </button>
        </form>
      </div>

      {/* Filter Controls */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Filter Routines</h3>
        <div className="flex space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Level
            </label>
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Levels</option>
              <option value="1">Level 1</option>
              <option value="2">Level 2</option>
              <option value="3">Level 3</option>
              <option value="4">Level 4</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Term
            </label>
            <select
              value={filterTerm}
              onChange={(e) => setFilterTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Terms</option>
              <option value="1">Term 1</option>
              <option value="2">Term 2</option>
            </select>
          </div>
        </div>
      </div>

      {/* Routines List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Routines</h2>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : routines.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No routines yet. Upload one above!</p>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedRoutines).map(([group, groupRoutines]) => (
              <div key={group} className="border-b pb-4 last:border-b-0">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">{group}</h3>
                <div className="space-y-3">
                  {groupRoutines.map((routine) => {
                    const fileUrl = routine.file || routine.file_url;
                    const isImage = fileUrl && /\.(jpg|jpeg|png|gif|webp)$/i.test(fileUrl);
                    const isPdf = fileUrl && /\.pdf$/i.test(fileUrl);
                    
                    return (
                      <div
                        key={routine.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-4 flex-1">
                          {isImage && fileUrl && (
                            <div className="w-20 h-20 flex-shrink-0">
                              <img
                                src={fileUrl}
                                alt={routine.title}
                                className="w-full h-full object-cover rounded-md border border-gray-200"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                          {isPdf && (
                            <div className="w-20 h-20 flex-shrink-0 bg-red-100 rounded-md flex items-center justify-center">
                              <span className="text-3xl">📄</span>
                            </div>
                          )}
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-800">{routine.title}</h4>
                            <p className="text-sm text-gray-500">
                              {routine.created_at && `Uploaded: ${new Date(routine.created_at).toLocaleDateString()}`}
                            </p>
                            {fileUrl && (
                              <p className="text-xs text-gray-400 mt-1 truncate max-w-md">
                                {fileUrl}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm"
                          >
                            {isImage ? 'View Image' : isPdf ? 'View PDF' : 'View'}
                          </a>
                          <button
                            onClick={() => handleDelete(routine.id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Routines;

