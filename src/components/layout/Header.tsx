import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Plus, User, ChevronDown, LogOut, Settings, Home, ExternalLink, Palette } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { currentTheme, setTheme, availableThemes } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNewMenu, setShowNewMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  return (
    <header className="bg-theme-secondary text-white h-12 fixed top-0 left-0 right-0 z-10 flex items-center px-4">
      <div className="flex-grow flex items-center">
        <Link to="/dashboard" className="mr-4">
          <span className="w-8 h-8 rounded-full bg-theme-primary flex items-center justify-center">
            W
          </span>
        </Link>
        
        <Link 
          to="/" 
          className="flex items-center text-gray-200 hover:text-white mr-6 text-wp-base"
          target="_blank"
        >
          <Home size={16} className="mr-1" />
          <span>View Site</span>
          <ExternalLink size={14} className="ml-1" />
        </Link>
        
        <div className="relative mr-4">
          <button 
            className="flex items-center bg-theme-primary hover:bg-opacity-90 rounded px-3 py-1 text-wp-base transition-colors duration-200"
            onClick={() => setShowNewMenu(!showNewMenu)}
          >
            <Plus size={16} className="mr-1" />
            <span>New</span>
            <ChevronDown size={14} className="ml-1" />
          </button>
          
          {showNewMenu && (
            <div className="absolute top-full left-0 mt-1 bg-white text-theme-secondary shadow-lg rounded animate-fade-in w-40 overflow-hidden">
              <Link 
                to="/posts/new" 
                className="block px-4 py-2 hover:bg-gray-100 text-wp-base"
                onClick={() => setShowNewMenu(false)}
              >
                Post
              </Link>
              <Link 
                to="/media/new" 
                className="block px-4 py-2 hover:bg-gray-100 text-wp-base"
                onClick={() => setShowNewMenu(false)}
              >
                Media
              </Link>
              <Link 
                to="/pages/new" 
                className="block px-4 py-2 hover:bg-gray-100 text-wp-base"
                onClick={() => setShowNewMenu(false)}
              >
                Page
              </Link>
              <Link 
                to="/users/new" 
                className="block px-4 py-2 hover:bg-gray-100 text-wp-base"
                onClick={() => setShowNewMenu(false)}
              >
                User
              </Link>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center">
        <div className="relative mr-4">
          <button
            className="text-gray-200 hover:text-white p-2"
            onClick={() => setShowThemeMenu(!showThemeMenu)}
          >
            <Palette size={18} />
          </button>
          {showThemeMenu && (
            <div className="absolute top-full right-0 mt-1 bg-white text-theme-secondary shadow-lg rounded animate-fade-in w-48 overflow-hidden">
              {availableThemes.map((theme) => (
                <button
                  key={theme.name}
                  className={`flex items-center w-full px-4 py-2 hover:bg-gray-100 text-wp-base ${
                    currentTheme.name === theme.name ? 'bg-gray-100' : ''
                  }`}
                  onClick={() => {
                    setTheme(theme);
                    setShowThemeMenu(false);
                  }}
                >
                  <div
                    className="w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: theme.colors.primary }}
                  />
                  {theme.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <button className="text-gray-200 hover:text-white p-2 relative">
          <Bell size={18} />
          <span className="absolute top-0 right-0 bg-theme-accent text-white text-wp-tiny w-4 h-4 rounded-full flex items-center justify-center">
            2
          </span>
        </button>
        
        <div className="relative ml-4">
          <button 
            className="flex items-center text-gray-200 hover:text-white"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden mr-2">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <User size={16} />
              )}
            </div>
            <span className="text-wp-base mr-1">Hi, {user?.name.split(' ')[0]}</span>
            <ChevronDown size={14} />
          </button>
          
          {showUserMenu && (
            <div className="absolute top-full right-0 mt-1 bg-white text-theme-secondary shadow-lg rounded animate-fade-in w-48 overflow-hidden">
              <div className="px-4 py-2 border-b border-gray-200">
                <p className="text-wp-base font-medium">{user?.name}</p>
                <p className="text-wp-small text-gray-500">{user?.email}</p>
              </div>
              
              <Link 
                to="/profile" 
                className="flex items-center px-4 py-2 hover:bg-gray-100 text-wp-base"
                onClick={() => setShowUserMenu(false)}
              >
                <User size={16} className="mr-2" />
                <span>Your Profile</span>
              </Link>
              
              <Link 
                to="/settings" 
                className="flex items-center px-4 py-2 hover:bg-gray-100 text-wp-base"
                onClick={() => setShowUserMenu(false)}
              >
                <Settings size={16} className="mr-2" />
                <span>Settings</span>
              </Link>
              
              <button 
                className="flex items-center px-4 py-2 hover:bg-gray-100 text-wp-base w-full text-left text-red-600"
                onClick={() => {
                  logout();
                  setShowUserMenu(false);
                }}
              >
                <LogOut size={16} className="mr-2" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;