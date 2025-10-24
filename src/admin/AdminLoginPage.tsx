import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';
const { useState, useEffect } = React;

const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const navigate = useNavigate();
  const { signIn, user, isAdmin } = useAuth();

  useEffect(() => {
    if (user && isAdmin) {
      navigate('/admin/dashboard');
    } else if (user && !isAdmin) {
      // If a non-admin user somehow lands here and is logged in, redirect them away
      navigate('/');
    }
  }, [user, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Mock authentication for admin
    if (email === 'admin@example.com' && password === 'Admin@123') {
      // Simulate successful login by updating AuthContext
      // In a real scenario, signIn would handle setting isAdmin based on actual auth
      // For mock, we'll directly set isAdmin if the mock credentials match
      // This requires a change in AuthContext to allow setting isAdmin directly or a mock signIn
      // For now, let's assume signIn can handle mock credentials and set isAdmin
      const { user: loggedInUser, error } = await signIn(email, password);

      if (error) {
        setMessage(error.message);
      } else if (loggedInUser) {
        setMessage('Admin login successful!');
        // Redirection will be handled by the useEffect in this component
      }
    } else {
      setMessage('Invalid admin credentials.');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto p-4 flex items-center justify-center">
        <Card className="p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Admin Login
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" variant="primary" className="w-full" disabled={loading}>
              Login as Admin
            </Button>
          </form>

          {message && (
            <div className={`mt-4 p-3 rounded-md text-sm ${message.includes('Invalid') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {message}
            </div>
          )}
        </Card>
      </main>
    </div>
  );
};

export default AdminLoginPage;
