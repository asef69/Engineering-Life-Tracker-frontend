import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api/auth';
import { todosAPI } from '../api/todos';
import { expensesAPI } from '../api/expenses';
import { coursesAPI } from '../api/courses';
import { calculateCGPA } from '../utils/cgpaCalculator';

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [expenseSummary, setExpenseSummary] = useState(null);
  const [courses, setCourses] = useState([]);
  const [todoCount, setTodoCount] = useState(0);
  const [courseCount, setCourseCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileData, todos, expenses, coursesData] = await Promise.all([
          authAPI.getProfile(),
          todosAPI.getTodos().catch(() => []),
          expensesAPI.getSummary().catch(() => null),
          coursesAPI.getCourses().catch(() => []),
        ]);

        setProfile(profileData);
        setTodoCount(todos.filter((todo) => !todo.is_completed).length);
        setExpenseSummary(expenses);
        setCourseCount(coursesData.length);
        setCourses(coursesData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          Welcome, {profile?.name || user?.name}!
        </h2>
        <p className="text-gray-600">
          {profile?.university_name || user?.university_name} - {profile?.department || user?.department}
        </p>
        <p className="text-gray-600">
          Level {profile?.level || user?.level}, Term {profile?.term || user?.term}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Pending Todos */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pending Todos</p>
              <p className="text-3xl font-bold text-gray-800">{todoCount}</p>
            </div>
            <div className="text-4xl">✓</div>
          </div>
        </div>

        {/* Total Courses */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Courses</p>
              <p className="text-3xl font-bold text-gray-800">{courseCount}</p>
            </div>
            <div className="text-4xl">🎓</div>
          </div>
        </div>

        {/* Monthly Balance */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Monthly Balance</p>
              <p className={`text-3xl font-bold ${
                expenseSummary?.balance >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                ${expenseSummary?.balance?.toFixed(2) || '0.00'}
              </p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </div>

        {/* Average CGPA */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">CGPA</p>
              <p className="text-3xl font-bold text-gray-800">
                {(() => {
                  const calculatedCGPA = calculateCGPA(courses);
                  return calculatedCGPA !== null ? calculatedCGPA.toFixed(2) : 'N/A';
                })()}
              </p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
        </div>
      </div>

      {/* Expense Summary */}
      {expenseSummary && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Monthly Expense Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded">
              <p className="text-sm text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-green-600">
                ${expenseSummary.total_earnings?.toFixed(2) || '0.00'}
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded">
              <p className="text-sm text-gray-600">Total Spending</p>
              <p className="text-2xl font-bold text-red-600">
                ${expenseSummary.total_spending?.toFixed(2) || '0.00'}
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-sm text-gray-600">Balance</p>
              <p className={`text-2xl font-bold ${
                expenseSummary.balance >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                ${expenseSummary.balance?.toFixed(2) || '0.00'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

