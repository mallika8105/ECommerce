import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import Dropdown from '../components/Dropdown';
import { Edit, Trash2, UserPlus } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'Customer' | 'Admin';
}

const roleOptions = [
  { label: 'Customer', value: 'Customer' },
  { label: 'Admin', value: 'Admin' },
];

const UserManagement: React.FC = () => {
  const { user: currentAuthUser, isAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Omit<User, 'id'>>({
    name: '',
    email: '',
    role: 'Customer',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      if (!currentAuthUser) {
        setError('You must be logged in to access this page.');
        setUsers([]);
        return;
      }

      if (!isAdmin) {
        setError('You must be an admin to access this page.');
        setUsers([]);
        return;
      }

      // Fetch users from 'profiles' table
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email, role')
        .order('name');

      if (error) {
        console.error('Error fetching users:', error);
        if (error.code === '42501') {
          setError('You do not have permission to access user data.');
        } else {
          setError('Failed to fetch users.');
        }
        setUsers([]);
      } else {
        setUsers(data as User[]);
        setError(null);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    setIsEditMode(false);
    setCurrentUser(null);
    setFormData({ name: '', email: '', role: 'Customer' });
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setIsEditMode(true);
    setCurrentUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!currentAuthUser || !isAdmin) {
      setError('You must be an admin to delete users.');
      return;
    }

    if (userId === currentAuthUser.id) {
      setError('You cannot delete your own account.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        // First delete from profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .delete()
          .eq('id', userId);

        if (profileError) {
          console.error('Error deleting user profile:', profileError);
          setError('Failed to delete user profile.');
          return;
        }

        // Then delete from auth.users if you have admin access
        // Note: This might require a Supabase Edge Function or server-side API
        // const { error: authError } = await supabase.rpc('delete_user', { user_id: userId });
        
        setError(null);
        await fetchUsers(); // Re-fetch users to get the updated list
      } catch (err) {
        console.error('Error during user deletion:', err);
        setError('An error occurred while deleting the user.');
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleSelect = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value as User['role'] }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAuthUser || !isAdmin) {
      setError('You must be an admin to perform this action.');
      return;
    }

    try {
      if (isEditMode && currentUser) {
        // For editing, we only update the profile
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            name: formData.name,
            role: formData.role 
          })
          .eq('id', currentUser.id);

        if (updateError) {
          console.error('Error updating user:', updateError);
          setError('Failed to update user. Please check your permissions.');
          return;
        }
      } else {
        // For new users, first create the auth user
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: Math.random().toString(36).slice(-8) + 'Ab1!', // Generate a secure random password
          options: {
            data: {
              name: formData.name,
              role: formData.role
            }
          }
        });

        if (signUpError) {
          console.error('Error creating user:', signUpError);
          setError('Failed to create user account. Please try again.');
          return;
        }

        if (!authData.user) {
          setError('Failed to create user account. No user data received.');
          return;
        }

        // Then create the profile with admin privileges
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            name: formData.name,
            email: formData.email,
            role: formData.role,
            created_at: new Date().toISOString()
          })
          .select() // Add select to ensure RLS policies are respected
          .single();

        if (profileError) {
          console.error('Error creating profile:', profileError);
          if (profileError.code === '42501') {
            setError('You do not have permission to create user profiles. Please ensure you have admin privileges.');
          } else {
            setError('Failed to create user profile. The account may need to be created manually.');
          }
          return;
        }

        // Send a welcome email or notification here if needed
      }

      // If everything succeeded
      setError(null);
      await fetchUsers(); // Re-fetch users to get the updated list
      setIsModalOpen(false);

      // Clear form data
      setFormData({
        name: '',
        email: '',
        role: 'Customer'
      });
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-grow container mx-auto p-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">User Management</h1>

        {!currentAuthUser ? (
          <Card className="p-6 bg-yellow-50">
            <div className="text-yellow-800 text-center">
              <p className="text-lg font-medium">Please log in to access user management.</p>
            </div>
          </Card>
        ) : !isAdmin ? (
          <Card className="p-6 bg-red-50">
            <div className="text-red-600 text-center">
              <p className="text-lg font-medium">You must be an admin to access this page.</p>
            </div>
          </Card>
        ) : (
          <>
            <div className="flex justify-end mb-6">
              <Button variant="primary" onClick={handleAddUser}>
                <UserPlus size={20} className="mr-2" /> Add New User
              </Button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-48">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <Card className="p-6 bg-red-50">
                <div className="text-red-600 text-center">
                  <p className="text-lg font-medium">{error}</p>
                  <Button 
                    variant="secondary" 
                    className="mt-4"
                    onClick={fetchUsers}
                  >
                    Retry Loading
                  </Button>
                </div>
              </Card>
            ) : users.length === 0 ? (
              <EmptyState message="No users found. Add a new user to get started!" />
            ) : (
              <Card className="p-6 overflow-x-auto bg-white shadow-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Role
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            user.role === 'Admin' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button variant="secondary" size="small" className="mr-2" onClick={() => handleEditUser(user)}>
                            <Edit size={16} className="mr-1" /> Edit
                          </Button>
                          <Button variant="danger" size="small" onClick={() => handleDeleteUser(user.id)}>
                            <Trash2 size={16} className="mr-1" /> Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            )}

            <Modal isOpen={isModalOpen} onClose={handleModalClose} title={isEditMode ? 'Edit User' : 'Add New User'}>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <Input
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                  disabled={isEditMode}
                />
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Role</label>
                  <Dropdown
                    options={roleOptions}
                    onSelect={handleRoleSelect}
                    placeholder={formData.role}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                  <Button type="button" variant="secondary" onClick={handleModalClose}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary">
                    {isEditMode ? 'Save Changes' : 'Add User'}
                  </Button>
                </div>
              </form>
            </Modal>
          </>
        )}
      </main>
    </div>
  );
};

export default UserManagement;
