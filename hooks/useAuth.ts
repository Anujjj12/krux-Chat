
import { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { User } from '../types';
import { MOCK_AGENTS, MOCK_CUSTOMERS } from '../constants';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const { state, dispatch } = useContext(AppContext);
  const navigate = useNavigate();

  const login = (identifier: string): boolean => {
    const trimmedIdentifier = identifier.trim();
    const customer = MOCK_CUSTOMERS.find(c => c.phone === trimmedIdentifier);
    if (customer) {
      dispatch({ type: 'LOGIN', payload: customer });
      navigate('/customer-chat');
      return true;
    }

    const agent = MOCK_AGENTS.find(a => a.username === trimmedIdentifier);
    if (agent) {
      dispatch({ type: 'LOGIN', payload: agent });
      navigate('/support-dashboard');
      return true;
    }

    return false;
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  };

  return {
    currentUser: state.currentUser,
    login,
    logout,
  };
};
