import React, { useState } from 'react';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import Dropdown from '../components/Dropdown';
import { Edit, Trash2, UserPlus } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'Customer' | 'Admin';
}

const sampleUsers: User[] = [
  { id: 'u1', name: 'Jane Doe', email: 'jane.doe@example.com', role: 'Customer' },
  { id: 'u2', name: 'John Smith', email: 'john.smith@example.com', role: 'Customer' },
  { id: 'u3', name: 'Admin User', email: 'admin@example.com', role: 'Admin' },
];

const roleOptions = [
  { label: 'Customer', value: 'Customer' },
  { label: 'Admin', value: 'Admin' },
];

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(sampleUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Omit<User, 'id'>>({
    name: '',
    email: '',
    role: 'Customer',
  });

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

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      console.log('Deleted user:', userId);
      // Implement API call to delete user
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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode && currentUser) {
      setUsers((prev) =>
        prev.map((u) => (u.id === currentUser.id ? { ...u, ...formData, id: u.id } : u))
      );
      console.log('Updated user:', { ...currentUser, ...formData });
      // Implement API call to update user
    } else {
      const newUser: User = {
        id: `u${users.length + 1}`, // Simple ID generation
        ...formData,
      };
      setUsers((prev) => [...prev, newUser]);
      console.log('Added new user:', newUser);
      // Implement API call to add user
    }
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-grow container mx-auto p-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">User Management</h1>

        <div className="flex justify-end mb-6">
          <Button variant="primary" onClick={handleAddUser}>
            <UserPlus size={20} className="mr-2" /> Add New User
          </Button>
        </div>

        {users.length === 0 ? (
          <EmptyState message="No users found. Add a new user to get started!" />
        ) : (
          <Card className="p-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="secondary" size="small" className="mr-2" onClick={() => handleEditUser(user)}>
                        <Edit size={16} />
                      </Button>
                      <Button variant="danger" size="small" onClick={() => handleDeleteUser(user.id)}>
                        <Trash2 size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </main>

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
    </div>
  );
};

export default UserManagement;
