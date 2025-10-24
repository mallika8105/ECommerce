import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useLocation and useNavigate
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import { Chrome } from 'lucide-react'; // Placeholder for social login icon
import { useAuth } from '../context/AuthContext'; // Import useAuth
import { supabase } from '../supabaseClient'; // Import supabase client

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const navigate = useNavigate();
  const { signIn, user, isAdmin } = useAuth(); // Use the signIn function from AuthContext, and isAdmin

  useEffect(() => {
    if (user) {
      if (isAdmin) {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard'); // Redirect regular users from public auth page
      }
    }
  }, [user, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (isLogin) {
      const { user: loggedInUser, error } = await signIn(email, password);
      if (error) {
        setMessage(error.message);
      } else if (loggedInUser) {
        setMessage('Login successful!');
        // The useEffect above will handle the redirection based on isAdmin status
      }
    } else {
      if (password !== confirmPassword) {
        setMessage('Passwords do not match!');
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) {
          setMessage(error.message);
        } else if (data.user) {
          setMessage('Registration successful! Please check your email to confirm.');
          // Optionally, sign in the user after successful registration
          // await signIn(email, password);
        }
      } catch (err: any) {
        setMessage(err.message || 'Registration failed');
      }
    }
    setLoading(false);
  };

  const handleSocialLogin = async (provider: 'google') => {
    setLoading(true);
    setMessage(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: window.location.origin + '/auth/callback', // Adjust redirect URL as needed
        },
      });
      if (error) {
        setMessage(error.message);
      }
    } catch (err: any) {
      setMessage(err.message || 'Social login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto p-4 flex items-center justify-center">
        <Card className="p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            {isLogin ? 'Login' : 'Register'}
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
            {!isLogin && (
              <Input
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            )}
            <Button type="submit" variant="primary" className="w-full" disabled={loading}>
              {isLogin ? 'Login' : 'Register'}
            </Button>
          </form>

          {message && (
            <div className={`mt-4 p-3 rounded-md text-sm ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {message}
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 hover:underline font-semibold"
                disabled={loading}
              >
                {isLogin ? 'Register' : 'Login'}
              </button>
            </p>
            <p className="my-4 text-gray-500">- OR -</p>
            <Button
              variant="secondary"
              className="w-full flex items-center justify-center space-x-2"
              onClick={() => handleSocialLogin('google')}
              disabled={loading}
            >
              <Chrome size={20} />
              <span>Continue with Google</span>
            </Button>
            {/* Add other social login buttons as needed */}
          </div>
        </Card>
      </main>
    </div>
  );
};

export default AuthPage;
