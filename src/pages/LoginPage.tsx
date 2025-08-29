import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AtSign, Lock } from 'lucide-react';

import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(username, password, rememberMe);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid username or password. Hint: Use "admin" and "password"');
      }
    } catch {
      setError('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-wordpress-gray flex items-center justify-center p-4 font-wp">
      <div className="max-w-md w-full">
        <div className="mb-6 text-center">
          <div className="w-16 h-16 rounded-full bg-wordpress-blue text-white flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            W
          </div>
          <h1 className="text-wp-2xl font-medium text-wordpress-darkgray">WordPress Clone</h1>
          <p className="text-wp-base text-gray-600 mt-1">Log in to your account</p>
        </div>

        <div className="bg-white p-8 rounded shadow-wp animate-fade-in">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-wordpress-error border border-red-200 rounded text-wp-base">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-wp-base font-medium mb-1 text-wordpress-darkgray">
                Username or Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                  <AtSign size={18} />
                </div>
                <input
                  id="username"
                  type="text"
                  className="bg-white border border-wordpress-border rounded pl-10 px-3 py-2 w-full text-wp-base focus:outline-none focus:ring-1 focus:ring-wordpress-blue focus:border-wordpress-blue transition-colors duration-200"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-wp-base font-medium mb-1 text-wordpress-darkgray">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  type="password"
                  className="bg-white border border-wordpress-border rounded pl-10 px-3 py-2 w-full text-wp-base focus:outline-none focus:ring-1 focus:ring-wordpress-blue focus:border-wordpress-blue transition-colors duration-200"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="password"
                  required
                />
              </div>
            </div>

            <div className="flex items-center mb-4">
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-wordpress-blue border-gray-300 rounded focus:ring-wordpress-blue"
              />
              <label htmlFor="rememberMe" className="ml-2 block text-wp-base text-gray-700">
                Remember me
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="large"
              isLoading={isLoading}
              className="w-full"
            >
              Log In
            </Button>
          </form>

          <p className="text-center mt-4 text-wp-base">
            <a href="#" className="text-wordpress-blue hover:underline">
              Lost your password?
            </a>
          </p>
        </div>

        <p className="text-center mt-4 text-gray-600 text-wp-small">
          <a href="#" className="text-wordpress-blue hover:underline">
            ← Back to WordPress Clone
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;