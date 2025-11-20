import { useEffect, useState } from 'react';
import { expensesAPI } from '../api/expenses';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    amount: '',
    expense_type: 'spending',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [expensesData, summaryData] = await Promise.all([
        expensesAPI.getExpenses(),
        expensesAPI.getSummary(),
      ]);
      setExpenses(expensesData);
      setSummary(summaryData);
    } catch (err) {
      setError('Failed to fetch expenses');
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
      await expensesAPI.createExpense({
        ...formData,
        amount: parseFloat(formData.amount),
      });
      setFormData({
        amount: '',
        expense_type: 'spending',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
      });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add transaction');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Expense Tracker</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Monthly Summary */}
      {summary && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Monthly Summary ({summary.month}/{summary.year})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded">
              <p className="text-sm text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-green-600">
                ${summary.total_earnings?.toFixed(2) || '0.00'}
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded">
              <p className="text-sm text-gray-600">Total Spending</p>
              <p className="text-2xl font-bold text-red-600">
                ${summary.total_spending?.toFixed(2) || '0.00'}
              </p>
            </div>
            <div className={`p-4 rounded ${
              summary.balance >= 0 ? 'bg-green-50' : 'bg-red-50'
            }`}>
              <p className="text-sm text-gray-600">Balance</p>
              <p className={`text-2xl font-bold ${
                summary.balance >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                ${summary.balance?.toFixed(2) || '0.00'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Add Transaction Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Add Transaction</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type *
              </label>
              <select
                value={formData.expense_type}
                onChange={(e) => setFormData({ ...formData, expense_type: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="earning">Earning</option>
                <option value="spending">Spending</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Food, Transport, Salary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
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
              placeholder="Optional description"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {submitting ? 'Adding...' : 'Add Transaction'}
          </button>
        </form>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Transactions</h2>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : expenses.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No transactions yet. Add one above!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 text-gray-700">Type</th>
                  <th className="text-left py-3 px-4 text-gray-700">Category</th>
                  <th className="text-left py-3 px-4 text-gray-700">Description</th>
                  <th className="text-right py-3 px-4 text-gray-700">Amount</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr
                    key={expense.id}
                    className={`border-b ${
                      expense.expense_type === 'earning' ? 'bg-green-50' : 'bg-red-50'
                    }`}
                  >
                    <td className="py-3 px-4">
                      {new Date(expense.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-sm font-medium ${
                          expense.expense_type === 'earning'
                            ? 'bg-green-200 text-green-800'
                            : 'bg-red-200 text-red-800'
                        }`}
                      >
                        {expense.expense_type === 'earning' ? 'Earning' : 'Spending'}
                      </span>
                    </td>
                    <td className="py-3 px-4">{expense.category || '-'}</td>
                    <td className="py-3 px-4">{expense.description || '-'}</td>
                    <td className={`py-3 px-4 text-right font-semibold ${
                      expense.expense_type === 'earning' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {expense.expense_type === 'earning' ? '+' : '-'}${parseFloat(expense.amount).toFixed(2)}
                    </td>
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

export default Expenses;

