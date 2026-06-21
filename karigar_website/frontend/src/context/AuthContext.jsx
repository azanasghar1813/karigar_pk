import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      const storedUser = localStorage.getItem('karigarUser');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        try {
          // Set the token explicitly for this initial request just in case
          // interceptors haven't picked up the state yet, though api.js 
          // reads directly from localStorage so it should work.
          if (parsedUser.role === 'karigar') {
            // Need to create an endpoint for karigar me, or just use stats
            await api.get('/karigar-portal/stats');
          } else {
            await api.get('/auth/me');
          }
          setUser(parsedUser);
        } catch (error) {
          console.error('Session verification failed, logging out', error);
          localStorage.removeItem('karigarUser');
          setUser(null);
        }
      }
      setLoading(false);
    };

    verifySession();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('karigarUser', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const register = async (userData) => {
    const { data } = await api.post('/auth/register', userData);
    localStorage.setItem('karigarUser', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const loginKarigar = async (email, password) => {
    const { data } = await api.post('/karigars/login', { email, password });
    localStorage.setItem('karigarUser', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('karigarUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, loginKarigar, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
