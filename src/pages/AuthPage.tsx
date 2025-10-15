import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import { Chrome } from 'lucide-react'; // Placeholder for social login icon

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      console.log('Logging in with:', { email, password });
      // Implement login logic
    } else {
      if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
      }
      console.log('Registering with:', { email, password });
      // Implement registration logic
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Logging in with ${provider}`);
    // Implement social login logic
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
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
            <Button type="submit" variant="primary" className="w-full">
              {isLogin ? 'Login' : 'Register'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 hover:underline font-semibold"
              >
                {isLogin ? 'Register' : 'Login'}
              </button>
            </p>
            <p className="my-4 text-gray-500">- OR -</p>
            <Button
              variant="secondary"
              className="w-full flex items-center justify-center space-x-2"
              onClick={() => handleSocialLogin('Google')}
            >
              <Chrome size={20} />
              <span>Continue with Google</span>
            </Button>
            {/* Add other social login buttons as needed */}
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default AuthPage;
