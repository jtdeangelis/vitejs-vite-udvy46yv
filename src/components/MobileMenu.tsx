import React, { useState } from 'react';
import { Menu, X, Settings, Save, FolderOpen, LogIn } from 'lucide-react';

interface MobileMenuProps {
  user: any;
  onSignOut: () => void;
  onOpenSettings: () => void;
  onOpenSaveProject: () => void;
  onOpenProjectList: () => void;
  onOpenSignIn: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  user,
  onSignOut,
  onOpenSettings,
  onOpenSaveProject,
  onOpenProjectList,
  onOpenSignIn
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuItemClick = (callback: () => void) => {
    callback();
    setIsOpen(false);
  };

  return (
    <div className="md:hidden">
      <button
        className="p-2 text-white hover:text-gray-200 focus:outline-none"
        onClick={toggleMenu}
        aria-label="Toggle mobile menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {isOpen && (
        <div className="absolute top-16 right-0 left-0 bg-white shadow-md z-50">
          <div className="px-4 py-2 space-y-2">
            <button
              onClick={() => handleMenuItemClick(onOpenSettings)}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <Settings className="mr-3 h-5 w-5 text-gray-500" />
              Settings
            </button>

            {user ? (
              <>
                <button
                  onClick={() => handleMenuItemClick(onOpenSaveProject)}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <Save className="mr-3 h-5 w-5 text-gray-500" />
                  Save Project
                </button>
                
                <button
                  onClick={() => handleMenuItemClick(onOpenProjectList)}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <FolderOpen className="mr-3 h-5 w-5 text-gray-500" />
                  Load Project
                </button>
                
                <div className="border-t border-gray-200 my-2"></div>
                
                <button
                  onClick={() => handleMenuItemClick(onSignOut)}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-md"
                >
                  <LogIn className="mr-3 h-5 w-5" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleMenuItemClick(onOpenSaveProject)}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <Save className="mr-3 h-5 w-5 text-gray-500" />
                  Save
                </button>
                
                <button
                  onClick={() => handleMenuItemClick(onOpenProjectList)}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <FolderOpen className="mr-3 h-5 w-5 text-gray-500" />
                  Load
                </button>
                
                <button
                  onClick={() => handleMenuItemClick(onOpenSignIn)}
                  className="flex items-center w-full px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 rounded-md"
                >
                  <LogIn className="mr-3 h-5 w-5" />
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;