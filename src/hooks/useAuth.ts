import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
  });
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('Initializing auth state');
      const user = localStorage.getItem('user');
      console.log('Found in localStorage:', { user });
      
      if (user) {
        try {
          const parsedUser = JSON.parse(user);
          console.log('Setting initial auth state:', { user: parsedUser });
          setAuthState({
            user: parsedUser,
          });
        } catch (error) {
          console.error('Error parsing user from localStorage:', error);
          localStorage.removeItem('user');
        }
      }
      setIsInitialized(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login with email:', email);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (!response.ok) {
        console.log('Login failed:', data.error);
        return { success: false, error: data.error || 'Invalid email or password' };
      }

      const { user } = data;
      console.log('Login successful, received:', { user });

      if (!user) {
        console.log('Missing user data');
        return { success: false, error: 'Invalid response from server' };
      }

      localStorage.setItem('user', JSON.stringify(user));


      setAuthState({ user });
      console.log('Auth state updated');

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'An unexpected error occurred' };
    }
  };

  const logout = async () => {
    console.log('Logging out...');
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Logout failed');
      }

     
      localStorage.removeItem('user');
    
      setAuthState({ user: null });
    
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      
      localStorage.removeItem('user');
      setAuthState({ user: null });
      window.location.href = '/';
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    try {
      console.log('Attempting signup...');
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      console.log('Signup response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

  
      return await login(email, password);
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Signup failed' };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      console.log('Attempting password reset...');
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      console.log('Reset password response:', data);

      if (!data.success) {
        return { success: false, error: data.error };
      }

      return { success: true, message: data.message };
    } catch (error) {
      console.error('Reset password error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to reset password' 
      };
    }
  };


  if (!isInitialized) {
    return {
      user: null,
      login,
      logout,
      signup,
      resetPassword,
    };
  }

  return {
    user: authState.user,
    login,
    logout,
    signup,
    resetPassword,
  };
} 