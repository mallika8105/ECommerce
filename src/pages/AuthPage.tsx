import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import { Chrome } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';

type AuthStep = 'contact_input' | 'otp_verification';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [currentStep, setCurrentStep] = useState<AuthStep>('contact_input');
  const [contact, setContact] = useState(''); // Can be email or mobile number
  const [otp, setOtp] = useState('');
  const [name, setName] = useState(''); // For profile completion
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isMobileNumber, setIsMobileNumber] = useState(false); // To distinguish email/mobile

  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  // Function to check if a user exists in the profiles table
  const checkUserExists = async (contactValue: string, isMobile: boolean): Promise<boolean> => {
    try {
      let query = supabase.from('profiles').select('id').limit(1);
      if (isMobile) {
        query = query.eq('phone', contactValue);
      } else {
        query = query.eq('email', contactValue);
      }
      const { data, error } = await query.single();
      return !!data; // Returns true if data exists, false otherwise
    } catch (error) {
      // If error is "PGRST116" (no rows found), it means user doesn't exist.
      // For other errors, log and assume user doesn't exist for this check.
      console.error('Error checking user existence in profiles table:', error);
      return false;
    }
  };

  useEffect(() => {
    if (user && user.user_metadata?.name) { // Only redirect if user exists and profile is complete
      if (isAdmin) {
        navigate('/admin/dashboard');
      } else {
        navigate('/account'); // Redirect to /account
      }
    }
  }, [user, isAdmin, navigate]);

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setContact(value);
    // Simple check to determine if it's likely a mobile number
    setIsMobileNumber(/^\d+$/.test(value) && value.length >= 10);
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      let otpError;

      // E.164 phone number validation
      if (isMobileNumber && !/^\+\d{10,15}$/.test(contact)) {
        setMessage('Invalid phone number format. Please include country code (e.g., +918105372368).');
        setLoading(false);
        return;
      }

      if (isLogin) {
        // Login flow: Directly attempt to send OTP. Supabase will handle if user exists.
        if (isMobileNumber) {
          const { error } = await supabase.auth.signInWithOtp({
            phone: contact,
            options: {
              shouldCreateUser: false, // Never create user during login flow
            },
          });
          otpError = error;
        } else {
          const { error } = await supabase.auth.signInWithOtp({
            email: contact,
            options: {
              shouldCreateUser: false, // Never create user during login flow
            },
          });
          otpError = error;
        }
      } else {
        // Register flow: Check if user already exists in profiles table to prevent duplicate registrations
        const userExists = await checkUserExists(contact, isMobileNumber);
        if (userExists) {
          setMessage('An account with this contact already exists. Please login instead.');
          setLoading(false);
          return;
        }

        // Proceed with OTP request for registration
        if (isMobileNumber) {
          const { error } = await supabase.auth.signInWithOtp({
            phone: contact,
            options: {
              shouldCreateUser: true, // Create user during registration flow
            },
          });
          otpError = error;
        } else {
          const { error } = await supabase.auth.signInWithOtp({
            email: contact,
            options: {
              shouldCreateUser: true, // Create user during registration flow
            },
          });
          otpError = error;
        }
      }

      // Handle OTP request errors
      if (otpError) {
        setMessage(otpError.message);
      } else {
        setMessage(`OTP sent to ${contact}. Please check your ${isMobileNumber ? 'phone' : 'email'}.`);
        setCurrentStep('otp_verification');
      }
    } catch (err: any) {
      console.error('AuthPage: handleRequestOtp error:', err);
      setMessage(err.message || 'Failed to request OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      let verifyError;
      let authResponseData;

      if (isMobileNumber) {
        const { data, error } = await supabase.auth.verifyOtp({
          phone: contact,
          token: otp,
          type: 'sms',
        });
        verifyError = error;
        authResponseData = data;
      } else {
        const { data, error } = await supabase.auth.verifyOtp({
          email: contact,
          token: otp,
          type: 'email',
        });
        verifyError = error;
        authResponseData = data;
      }

      if (verifyError) {
        setMessage(verifyError.message);
      } else if (authResponseData && authResponseData.user) {
        setMessage('Verification successful!');

        // If it's a registration flow, ensure a profile exists and update user metadata
        if (!isLogin) {
          const { user: newUser } = authResponseData;
          // Check if profile already exists (e.g., from a trigger)
          const { data: existingProfile, error: fetchProfileError } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', newUser.id)
            .single();

          if (fetchProfileError && fetchProfileError.code !== 'PGRST116') { // PGRST116 means no rows found
            console.error('Error fetching profile during registration:', fetchProfileError);
            setMessage(`Verification successful, but failed to check profile: ${fetchProfileError.message}`);
            setLoading(false);
            return;
          }

          if (!existingProfile) {
            // Create profile if it doesn't exist
            const { error: createProfileError } = await supabase.from('profiles').insert({
              id: newUser.id,
              email: newUser.email,
              phone: newUser.phone,
              name: name || newUser.user_metadata?.name || 'New User', // Use provided name or default
              role: 'customer', // Default role for new users
            });

            if (createProfileError) {
              console.error('Error creating user profile:', createProfileError);
              setMessage(`Registration successful, but failed to create profile: ${createProfileError.message}`);
              setLoading(false);
              return;
            }
          }

          // Update user metadata if name was collected and not already set
          if (name && !newUser.user_metadata?.name) {
            const { error: updateError } = await supabase.auth.updateUser({
              data: { name: name },
            });
            if (updateError) {
              console.error('Error updating user metadata:', updateError);
              setMessage(`Registration successful, but failed to update user metadata: ${updateError.message}`);
              setLoading(false);
              return;
            }
          }
          setMessage('Registration successful!');
        } else {
          setMessage('Login successful!');
        }
        navigate('/account'); // Always redirect to /account after successful auth
      }
    } catch (err: any) {
      console.error('AuthPage: handleVerifyOtp error:', err);
      setMessage(err.message || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google') => {
    setLoading(true);
    setMessage(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: window.location.origin + '/auth/callback',
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

  const renderAuthForm = () => {
    switch (currentStep) {
      case 'contact_input':
        return (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            {!isLogin && ( // Only show name input in register mode
              <Input
                label="Full Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            )}
            <Input
              label="Enter Email/Mobile number"
              type="text"
              value={contact}
              onChange={handleContactChange}
              required
            />
            <Button type="submit" variant="primary" className="w-full" disabled={loading}>
              {loading ? (isLogin ? 'Sending OTP...' : 'Creating Account...') : (isLogin ? 'Request OTP' : 'Create Account')}
            </Button>
          </form>
        );
      case 'otp_verification':
        return (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <p className="text-center text-gray-600">An OTP has been sent to {contact}.</p>
            <Input
              label="Enter OTP"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <Button type="submit" variant="primary" className="w-full" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </Button>
            <Button type="button" variant="secondary" className="w-full mt-2" onClick={() => setCurrentStep('contact_input')} disabled={loading}>
              Change Contact
            </Button>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto p-4 flex items-center justify-center">
        <Card className="p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            {isLogin ? 'Login' : 'Register'}
          </h1>

          {renderAuthForm()}

          {message && (
            <div className={`mt-4 p-3 rounded-md text-sm ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {message}
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setCurrentStep('contact_input'); // Reset step when toggling login/register
                  setMessage(null);
                  setContact('');
                  setOtp('');
                  setName('');
                }}
                className="text-blue-600 hover:underline font-semibold"
                disabled={loading}
              >
                {isLogin ? 'Register' : 'Login'}
              </button>
            </p>
            {/* Only show social login if not in OTP verification step */}
            {currentStep !== 'otp_verification' && (
              <>
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
              </>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
};

export default AuthPage;
