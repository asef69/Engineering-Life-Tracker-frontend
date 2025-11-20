import { useEffect, useState } from 'react';
import { coursesAPI } from '../api/courses';
import { calculateCGPA } from '../utils/cgpaCalculator';

const CGPA = () => {
  const [courses, setCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    course_name: '',
    course_code: '',
    ct_marks: '',
    cgpa: '',
    credit_hour: '',
    level: '',
    term: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [filterLevel, setFilterLevel] = useState('');
  const [filterTerm, setFilterTerm] = useState('');
  const [editingCourse, setEditingCourse] = useState(null);
  const [editFormData, setEditFormData] = useState({
    cgpa: '',
    credit_hour: '',
  });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchData();
  }, [filterLevel, filterTerm]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const level = filterLevel || null;
      const term = filterTerm || null;

      const [coursesData, allCoursesData] = await Promise.all([
        coursesAPI.getCourses(level, term),
        coursesAPI.getCourses(), // Fetch all courses for overall CGPA
      ]);

      setCourses(coursesData);
      setAllCourses(allCoursesData);
    } catch (err) {
      setError('Failed to fetch courses');
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
      await coursesAPI.createCourse({
        ...formData,
        ct_marks: parseFloat(formData.ct_marks),
        cgpa: parseFloat(formData.cgpa),
        credit_hour: parseFloat(formData.credit_hour),
      });
      setFormData({
        course_name: '',
        course_code: '',
        ct_marks: '',
        cgpa: '',
        credit_hour: '',
        level: '',
        term: '',
      });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add course');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (course) => {
    setEditingCourse(course.id);
    setEditFormData({
      cgpa: course.cgpa || '',
      credit_hour: course.credit_hour || '',
    });
  };

  const handleCancelEdit = () => {
    setEditingCourse(null);
    setEditFormData({
      cgpa: '',
      credit_hour: '',
    });
  };

  const handleUpdateSubmit = async (courseId) => {
    setUpdating(true);
    setError('');

    try {
      // Validate inputs
      const cgpa = parseFloat(editFormData.cgpa);
      const creditHour = parseFloat(editFormData.credit_hour);

      if (isNaN(cgpa) || cgpa < 0 || cgpa > 4) {
        setError('CGPA must be between 0 and 4');
        setUpdating(false);
        return;
      }

      if (isNaN(creditHour) || creditHour <= 0) {
        setError('Credit hours must be greater than 0');
        setUpdating(false);
        return;
      }

      // Find the course to get all its data
      const course = courses.find(c => c.id === courseId || c.course_id === courseId);
      if (!course) {
        setError('Course not found');
        setUpdating(false);
        return;
      }

      console.log('Updating course:', courseId, 'with data:', { cgpa, credit_hour: creditHour });

      // Try PATCH first (partial update), fallback to PUT if needed
      try {
        await coursesAPI.patchCourse(courseId, {
          cgpa: cgpa,
          credit_hour: creditHour,
        });
        console.log('Update successful with PATCH');
      } catch (patchErr) {
        console.log('PATCH failed, trying PUT with all fields:', patchErr);
        // If PATCH fails, try PUT with all course fields
        await coursesAPI.updateCourse(courseId, {
          course_name: course.course_name,
          course_code: course.course_code,
          ct_marks: course.ct_marks,
          cgpa: cgpa,
          credit_hour: creditHour,
          level: course.level,
          term: course.term,
        });
        console.log('Update successful with PUT');
      }

      setEditingCourse(null);
      setEditFormData({
        cgpa: '',
        credit_hour: '',
      });
      fetchData();
    } catch (err) {
      console.error('Update error:', err);
      console.error('Error response:', err.response);
      
      // Extract error message from various possible formats
      let errorMessage = 'Failed to update course';
      
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data.error) {
          errorMessage = err.response.data.error;
        } else if (err.response.data.detail) {
          errorMessage = err.response.data.detail;
        } else {
          // Try to extract field-specific errors
          const fieldErrors = Object.entries(err.response.data)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join('; ');
          errorMessage = fieldErrors || JSON.stringify(err.response.data);
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">CGPA Management</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* CGPA Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Filtered CGPA
          </h2>
          {filterLevel || filterTerm ? (
            <div>
              <p className="text-gray-600">
                {filterLevel && filterTerm 
                  ? `Level ${filterLevel}, Term ${filterTerm}`
                  : filterLevel 
                    ? `Level ${filterLevel}`
                    : `Term ${filterTerm}`}
              </p>
              {(() => {
                const filteredCGPA = calculateCGPA(courses);
                return (
                  <p className="text-3xl font-bold text-blue-600 mt-2">
                    {filteredCGPA !== null ? filteredCGPA.toFixed(2) : 'N/A'}
                  </p>
                );
              })()}
            </div>
          ) : (
            <p className="text-gray-500">Select level and/or term to see filtered CGPA</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Overall CGPA
          </h2>
          {(() => {
            const overallCGPA = calculateCGPA(allCourses);
            return (
              <p className="text-3xl font-bold text-green-600">
                {overallCGPA !== null ? overallCGPA.toFixed(2) : 'N/A'}
              </p>
            );
          })()}
        </div>
      </div>

      {/* Add Course Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Add New Course</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Name *
              </label>
              <input
                type="text"
                value={formData.course_name}
                onChange={(e) => setFormData({ ...formData, course_name: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Code *
              </label>
              <input
                type="text"
                value={formData.course_code}
                onChange={(e) => setFormData({ ...formData, course_code: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CT Marks (0-100) *
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={formData.ct_marks}
                onChange={(e) => setFormData({ ...formData, ct_marks: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CGPA (0-4) *
              </label>
              <input
                type="number"
                min="0"
                max="4"
                step="0.01"
                value={formData.cgpa}
                onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Credit Hours *
              </label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={formData.credit_hour}
                onChange={(e) => setFormData({ ...formData, credit_hour: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 3.0"
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

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {submitting ? 'Adding...' : 'Add Course'}
          </button>
        </form>
      </div>

      {/* Filter Controls */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Filter Courses</h3>
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

      {/* Courses List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Courses</h2>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : courses.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No courses yet. Add one above!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-gray-700">Course Code</th>
                  <th className="text-left py-3 px-4 text-gray-700">Course Name</th>
                  <th className="text-left py-3 px-4 text-gray-700">Level</th>
                  <th className="text-left py-3 px-4 text-gray-700">Term</th>
                  <th className="text-right py-3 px-4 text-gray-700">CT Marks</th>
                  <th className="text-right py-3 px-4 text-gray-700">Credit Hours</th>
                  <th className="text-right py-3 px-4 text-gray-700">CGPA</th>
                  <th className="text-center py-3 px-4 text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{course.course_code}</td>
                    <td className="py-3 px-4">{course.course_name}</td>
                    <td className="py-3 px-4">Level {course.level}</td>
                    <td className="py-3 px-4">Term {course.term}</td>
                    <td className="py-3 px-4 text-right">{course.ct_marks}</td>
                    {editingCourse === course.id ? (
                      <>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            min="0.5"
                            step="0.5"
                            value={editFormData.credit_hour}
                            onChange={(e) => setEditFormData({ ...editFormData, credit_hour: e.target.value })}
                            className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                            placeholder="e.g., 3.0"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            min="0"
                            max="4"
                            step="0.01"
                            value={editFormData.cgpa}
                            onChange={(e) => setEditFormData({ ...editFormData, cgpa: e.target.value })}
                            className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => handleUpdateSubmit(course.id)}
                              disabled={updating}
                              className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                              {updating ? 'Saving...' : 'Save'}
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              disabled={updating}
                              className="px-3 py-1 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                              Cancel
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-3 px-4 text-right">{course.credit_hour || 'N/A'}</td>
                        <td className="py-3 px-4 text-right font-semibold text-blue-600">
                          {course.cgpa}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleEditClick(course)}
                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition mx-auto block"
                          >
                            Edit
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CGPA;

