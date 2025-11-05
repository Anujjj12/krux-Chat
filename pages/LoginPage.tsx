
import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const location = useLocation();
  const initialUserType = location.state?.userType || 'customer';

  const [identifier, setIdentifier] = useState('');
  const [error, setError] = useState('');
  const [userType, setUserType] = useState<'customer' | 'agent'>(initialUserType);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = login(identifier);
    if (!success) {
      setError('Invalid credentials. Please try again.');
    }
  };

  const isCustomer = userType === 'customer';

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div>
          <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white">
            KRUX Finance
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Sign in to your account
          </p>
        </div>
        
        <div className="flex justify-center border border-gray-300 dark:border-gray-600 rounded-lg p-1">
            <button 
                onClick={() => setUserType('customer')}
                className={`w-1/2 py-2 rounded-md transition-colors ${isCustomer ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
                Customer
            </button>
            <button 
                onClick={() => setUserType('agent')}
                className={`w-1/2 py-2 rounded-md transition-colors ${!isCustomer ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
                Agent
            </button>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="identifier" className="sr-only">
                {isCustomer ? 'Phone Number' : 'Username'}
              </label>
              <input
                id="identifier"
                name="identifier"
                type="text"
                autoComplete={isCustomer ? 'tel' : 'username'}
                required
                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder={isCustomer ? 'Phone (+919876543210)' : 'Username (amit.kumar)'}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign in
            </button>
          </div>
        </form>
         <div className="text-sm text-center">
            <Link to="/" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
              Back to Home
            </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
