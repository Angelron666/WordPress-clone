import React, { createContext, useState, useContext, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { User } from '../types';
import { currentUser } from '../data/mockData';

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string, rememberMe: boolean) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const COOKIE_NAME = 'wordpress_clone_auth';

const validateUserData = (data: unknown): data is User => {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.id === 'string' &&
    typeof data.username === 'string' &&
    typeof data.email === 'string' &&
    typeof data.name === 'string' &&
    typeof data.role === 'string' &&
    typeof data.avatar === 'string'
  );
};

const safelySetCookie = (value: unknown, options?: Cookies.CookieAttributes): boolean => {
  try {
    // Validate user data before storing
    if (!validateUserData(value)) {
      console.error("Invalid user data format", value);
      return false;
    }
    
    // Create a new object with sanitized values
    const sanitizedValue = {
      id: String(value.id),
      username: String(value.username).trim(),
      email: String(value.email).trim(),
      name: String(value.name).trim(),
      role: String(value.role).trim(),
      avatar: String(value.avatar).trim()
    };
    
    const serializedValue = JSON.stringify(sanitizedValue);
    
    // Verify the serialized value is valid JSON before setting
    JSON.parse(serializedValue);
    
    Cookies.set(COOKIE_NAME, btoa(serializedValue), {
      ...options,
      secure: true,
      sameSite: 'strict'
    });
    
    return true;
  } catch (error) {
    console.error("Error setting auth cookie:", error);
    return false;
  }
};

const safelyGetCookie = (): User | null => {
  try {
    const cookieValue = Cookies.get(COOKIE_NAME);
    if (!cookieValue) return null;

    // Decode the Base64 encoded cookie value
    let decodedValue: string;
    try {
      decodedValue = atob(cookieValue);
    } catch (error) {
      console.error("Base64 decoding error in auth cookie:", error);
      Cookies.remove(COOKIE_NAME);
      return null;
    }

    // First verify it's valid JSON
    let parsedValue: unknown;
    try {
      parsedValue = JSON.parse(decodedValue);
    } catch (error) {
      console.error("JSON parsing error in auth cookie:", error);
      Cookies.remove(COOKIE_NAME);
      return null;
    }
    
    // Then validate the data structure
    if (!validateUserData(parsedValue)) {
      console.error("Invalid user data structure in cookie");
      Cookies.remove(COOKIE_NAME);
      return null;
    }

    return parsedValue;
  } catch (error) {
    console.error("Error retrieving auth cookie:", error);
    Cookies.remove(COOKIE_NAME);
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    return safelyGetCookie();
  });

  const login = async (username: string, password: string, rememberMe: boolean): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (username === 'admin' && password === 'password') {
          // Validate currentUser before attempting to use it
          if (!validateUserData(currentUser)) {
            console.error("Mock user data is invalid");
            resolve(false);
            return;
          }

          const cookieOptions = rememberMe ? { expires: 30 } : { expires: 1 };
          
          if (safelySetCookie(currentUser, cookieOptions)) {
            setUser(currentUser);
            resolve(true);
          } else {
            console.error("Failed to set authentication cookie");
            setUser(null);
            resolve(false);
          }
        } else {
          resolve(false);
        }
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
    try {
      Cookies.remove(COOKIE_NAME, { 
        secure: true,
        sameSite: 'strict'
      });
    } catch (error) {
      console.error("Error removing auth cookie:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};