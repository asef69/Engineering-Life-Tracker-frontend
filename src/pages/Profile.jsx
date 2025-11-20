import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api/auth';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    university_name: '',
    department: '',
    level: '',
    term: '',
  });
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_new_password: '',
  });
  const [updating, setUpdating] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await authAPI.getProfile();
      setProfile(data);
      setFormData({
        name: data.name || '',
        university_name: data.university_name || '',
        department: data.department || '',
        level: data.level?.toString() || '',
        term: data.term?.toString() || '',
      });
    } catch (err) {
      setError('Failed to fetch profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError('');
    setSuccess('');

    try {
      // Convert level and term to integers
      const updateData = {
        ...formData,
        level: parseInt(formData.level),
        term: parseInt(formData.term),
      };

      // Try PATCH first (partial update), fallback to PUT if needed
      let data;
      try {
        data = await authAPI.patchProfile(updateData);
      } catch (patchErr) {
        // If PATCH fails, try PUT
        data = await authAPI.updateProfile(updateData);
      }

      setProfile(data);
      updateUser(data);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      console.error('Profile update error:', err);
      console.error('Error response:', err.response);
      
      // Extract error message from various possible formats
      let errorMessage = 'Failed to update profile';
      
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

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setChangingPassword(true);
    setError('');
    setSuccess('');

    // Validation
    if (!passwordData.old_password) {
      setError('Old password is required');
      setChangingPassword(false);
      return;
    }

    if (!passwordData.new_password) {
      setError('New password is required');
      setChangingPassword(false);
      return;
    }

    if (passwordData.new_password.length < 8) {
      setError('New password must be at least 8 characters long');
      setChangingPassword(false);
      return;
    }

    if (passwordData.new_password !== passwordData.confirm_new_password) {
      setError('New passwords do not match');
      setChangingPassword(false);
      return;
    }

    try {
      await authAPI.changePassword(
        passwordData.old_password,
        passwordData.new_password,
        passwordData.confirm_new_password
      );
      setPasswordData({
        old_password: '',
        new_password: '',
        confirm_new_password: '',
      });
      setSuccess('Password changed successfully!');
    } catch (err) {
      console.error('Password change error:', err);
      console.error('Error response:', err.response);
      
      // Extract error message from various possible formats
      let errorMessage = 'Failed to change password';
      
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data.error) {
          errorMessage = err.response.data.error;
        } else if (err.response.data.detail) {
          errorMessage = err.response.data.detail;
        } else if (err.response.data.old_password) {
          errorMessage = `Old password: ${Array.isArray(err.response.data.old_password) ? err.response.data.old_password.join(', ') : err.response.data.old_password}`;
        } else if (err.response.data.new_password) {
          errorMessage = `New password: ${Array.isArray(err.response.data.new_password) ? err.response.data.new_password.join(', ') : err.response.data.new_password}`;
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
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Profile</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      {/* Profile Information */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Profile Information</h2>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={profile?.email || ''}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                University Name *
              </label>
              <input
                type="text"
                value={formData.university_name}
                onChange={(e) => setFormData({ ...formData, university_name: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department *
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
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

          <button
            type="submit"
            disabled={updating}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {updating ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Change Password</h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Old Password *
            </label>
            <input
              type="password"
              value={passwordData.old_password}
              onChange={(e) =>
                setPasswordData({ ...passwordData, old_password: e.target.value })
              }
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password *
              </label>
              <input
                type="password"
                value={passwordData.new_password}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, new_password: e.target.value })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password *
              </label>
              <input
                type="password"
                value={passwordData.confirm_new_password}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirm_new_password: e.target.value,
                  })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={changingPassword}
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {changingPassword ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;

