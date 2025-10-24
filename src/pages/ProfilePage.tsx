import React, { useState } from 'react';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import Modal from '../components/Modal';
import './ProfilePage.css'; // Import the custom CSS file

interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  address: string;
}

const initialProfile: UserProfile = {
  fullName: 'John Doe',
  email: 'john.doe@example.com',
  phone: '123-456-7890',
  address: '123 Main St, Anytown, USA',
};

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<UserProfile>(initialProfile);

  const handleEditClick = () => {
    setEditFormData(profile); // Load current profile into form
    setIsEditModalOpen(true);
  };

  const handleModalClose = () => {
    setIsEditModalOpen(false);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(editFormData); // Update profile with new data
    setIsEditModalOpen(false);
    console.log('Profile updated:', editFormData);
    // Implement API call to update user profile
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto p-4 profile-page-main"> {/* Apply the new class */}
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">My Profile</h1>

        <div className="max-w-2xl mx-auto">
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Personal Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-600 font-semibold">Full Name:</p>
                <p className="text-gray-800">{profile.fullName}</p>
              </div>
              <div>
                <p className="text-gray-600 font-semibold">Email:</p>
                <p className="text-gray-800">{profile.email}</p>
              </div>
              <div>
                <p className="text-gray-600 font-semibold">Phone:</p>
                <p className="text-gray-800">{profile.phone}</p>
              </div>
              <div>
                <p className="text-gray-600 font-semibold">Address:</p>
                <p className="text-gray-800">{profile.address}</p>
              </div>
            </div>
            <Button variant="secondary" className="mt-6" onClick={handleEditClick}>
              Edit Profile
            </Button>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Account Settings</h2>
            <div className="space-y-4">
              <Button variant="secondary">Change Password</Button>
              <Button variant="danger">Delete Account</Button>
            </div>
          </Card>
        </div>
      </main>

      <Modal isOpen={isEditModalOpen} onClose={handleModalClose} title="Edit Profile">
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <Input
            label="Full Name"
            name="fullName"
            value={editFormData.fullName}
            onChange={handleFormChange}
            required
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={editFormData.email}
            onChange={handleFormChange}
            required
          />
          <Input
            label="Phone"
            name="phone"
            type="tel"
            value={editFormData.phone}
            onChange={handleFormChange}
          />
          <Input
            label="Address"
            name="address"
            value={editFormData.address}
            onChange={handleFormChange}
          />
          <div className="flex justify-end space-x-2 mt-6">
            <Button type="button" variant="secondary" onClick={handleModalClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProfilePage;
