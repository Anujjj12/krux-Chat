
import React from 'react';
import { Link } from 'react-router-dom';
import { Users, MessageSquare } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="text-center p-8">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-600 dark:text-blue-400 mb-4">KRUX Finance Support</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-12">Welcome! Please select your role to continue.</p>
        <div className="flex flex-col md:flex-row justify-center gap-6">
          <Link to="/login" state={{ userType: 'customer' }} className="group">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
              <MessageSquare className="w-16 h-16 mx-auto text-blue-500 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">I'm a Customer</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Get help with your loan</p>
            </div>
          </Link>
          <Link to="/login" state={{ userType: 'agent' }} className="group">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
              <Users className="w-16 h-16 mx-auto text-green-500 dark:text-green-400 mb-4 group-hover:scale-110 transition-transform" />
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">I'm a Support Agent</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Access the dashboard</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
