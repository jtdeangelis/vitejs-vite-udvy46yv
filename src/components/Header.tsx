import React from 'react';
import { Flame, Settings, Save, FolderOpen, LogIn } from 'lucide-react';
import UserMenu from './UserMenu';
import MobileMenu from './MobileMenu';
import ResponsiveContainer from './ResponsiveContainer';

interface HeaderProps {
  user: any;
  onSignOut: () => void;
  onOpenSettings: () => void;
  onOpenSaveProject: () => void;
  onOpenProjectList: () => void;
  onOpenSignIn: () => void;
}

const Header: React.FC<HeaderProps> = ({
  user,
  onSignOut,
  onOpenSettings,
  onOpenSaveProject,
  onOpenProjectList,
  onOpenSignIn
}) => {
  return (
    <header className="bg-gradient-to-r from-orange-600 to-red-600 shadow-lg sticky top-0 z-10">
      <ResponsiveContainer>
        <div className="py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Flame className="h-8 w-8 text-white mr-2" />
            <h1 className="text-xl md:text-2xl font-bold text-white">Phoenix Rehab Estimation Tool</h1>
          </div>
          
          <div id="project-tools-section" className="flex items-center space-x-2 md:space-x-4">
            {/* Desktop navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <UserMenu 
                  user={user}
                  onSignOut={onSignOut}
                  onOpenSaveProject={onOpenSaveProject}
                  onOpenProjectList={onOpenProjectList}
                  onOpenSettings={onOpenSettings}
                />
              ) : (
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={onOpenSaveProject}
                    className="inline-flex items-center px-4 py-2 border border-white rounded-md shadow-sm text-sm font-medium text-white bg-transparent hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </button>
                  
                  <button
                    type="button"
                    onClick={onOpenProjectList}
                    className="inline-flex items-center px-4 py-2 border border-white rounded-md shadow-sm text-sm font-medium text-white bg-transparent hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                  >
                    <FolderOpen className="mr-2 h-4 w-4" />
                    Load
                  </button>
                  
                  <button
                    type="button"
                    onClick={onOpenSignIn}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-orange-600 bg-white hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </button>
                </div>
              )}
            </div>
            
            {/* Mobile menu */}
            <MobileMenu 
              user={user}
              onSignOut={onSignOut}
              onOpenSettings={onOpenSettings}
              onOpenSaveProject={onOpenSaveProject}
              onOpenProjectList={onOpenProjectList}
              onOpenSignIn={onOpenSignIn}
            />
          </div>
        </div>
      </ResponsiveContainer>
    </header>
  );
};

export default Header;