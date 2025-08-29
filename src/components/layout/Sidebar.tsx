import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  FileEdit, 
  MessageSquare, 
  Image, 
  Tag, 
  Settings, 
  ChevronDown, 
  ChevronRight, 
  Users, 
  Palette 
} from 'lucide-react';

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  count?: number;
  onClick?: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, label, count, onClick }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => 
        `flex items-center px-4 py-2 text-wp-base transition-colors duration-200 hover:bg-opacity-20 hover:bg-theme-primary ${
          isActive ? 'bg-theme-primary bg-opacity-20 text-white font-medium' : 'text-gray-300'
        }`
      }
      onClick={onClick}
    >
      <span className="mr-3">{icon}</span>
      <span>{label}</span>
      {count !== undefined && (
        <span className="ml-auto bg-theme-accent bg-opacity-20 text-wp-tiny text-white px-1.5 rounded-full">
          {count}
        </span>
      )}
    </NavLink>
  );
};

interface SubmenuProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const Submenu: React.FC<SubmenuProps> = ({ title, icon, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center w-full px-4 py-2 text-wp-base text-gray-300 transition-colors duration-200 hover:bg-opacity-20 hover:bg-theme-primary"
      >
        <span className="mr-3">{icon}</span>
        <span>{title}</span>
        <span className="ml-auto">
          {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </span>
      </button>
      {isOpen && <div className="pl-4 bg-theme-secondary bg-opacity-50">{children}</div>}
    </div>
  );
};

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 h-screen bg-theme-secondary text-white font-wp fixed left-0 top-0 overflow-y-auto">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-wp-xl font-medium flex items-center">
          <span className="w-8 h-8 mr-2 rounded-full bg-theme-primary flex items-center justify-center">W</span>
          WordPress Clone
        </h1>
      </div>
      
      <nav className="py-4">
        <SidebarLink to="/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" />
        
        <Submenu title="Posts" icon={<FileText size={18} />}>
          <SidebarLink to="/posts" icon={<FileText size={18} />} label="All Posts" count={4} />
          <SidebarLink to="/posts/new" icon={<FileEdit size={18} />} label="Add New" />
          <SidebarLink to="/categories" icon={<Tag size={18} />} label="Categories" />
          <SidebarLink to="/tags" icon={<Tag size={18} />} label="Tags" />
        </Submenu>
        
        <SidebarLink to="/media" icon={<Image size={18} />} label="Media" />
        <SidebarLink to="/comments" icon={<MessageSquare size={18} />} label="Comments" count={2} />
        
        <Submenu title="Appearance" icon={<Palette size={18} />}>
          <SidebarLink to="/themes" icon={<Palette size={18} />} label="Themes" />
          <SidebarLink to="/customize" icon={<Settings size={18} />} label="Customize" />
        </Submenu>
        
        <SidebarLink to="/users" icon={<Users size={18} />} label="Users" />
        <SidebarLink to="/settings" icon={<Settings size={18} />} label="Settings" />
      </nav>
    </div>
  );
};

export default Sidebar;