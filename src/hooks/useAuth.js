import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Custom hook — cleaner than importing AuthContext everywhere
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default useAuth;