import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { User, LogOut, Settings, Save, FolderOpen, UserCircle } from 'lucide-react';

interface UserMenuProps {
  user: any;
  onSignOut: () => void;
  onOpenSaveProject: () => void;
  onOpenProjectList: () => void;
  onOpenSettings: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ 
  user, 
  onSignOut, 
  onOpenSaveProject, 
  onOpenProjectList,
  onOpenSettings
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    // Get user email
    if (user) {
      setUserEmail(user.email || 'User');
    }

    // Close menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [user]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    onSignOut();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
          {userEmail ? userEmail.charAt(0).toUpperCase() : <UserCircle />}
        </div>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1 border-b border-gray-100">
            <div className="px-4 py-2">
              <p className="text-sm font-medium text-gray-900 truncate">{userEmail}</p>
              <p className="text-xs text-gray-500">Signed in</p>
            </div>
          </div>
          
          <div className="py-1">
            <button
              onClick={() => {
                onOpenSaveProject();
                setIsOpen(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Save className="mr-3 h-4 w-4 text-gray-500" />
              Save Project
            </button>
            
            <button
              onClick={() => {
                onOpenProjectList();
                setIsOpen(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <FolderOpen className="mr-3 h-4 w-4 text-gray-500" />
              Load Project
            </button>
            
            <button
              onClick={() => {
                onOpenSettings();
                setIsOpen(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Settings className="mr-3 h-4 w-4 text-gray-500" />
              Settings
            </button>
          </div>
          
          <div className="py-1 border-t border-gray-100">
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <LogOut className="mr-3 h-4 w-4 text-gray-500" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;