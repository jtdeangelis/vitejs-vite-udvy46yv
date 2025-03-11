import React, { ReactNode } from 'react';
import Header from '../Header';
import ErrorBoundary from '../ErrorBoundary';
import ResponsiveContainer from '../ResponsiveContainer';
import { useAuth } from '../../context/AuthContext';

interface MainLayoutProps {
  children: ReactNode;
  onOpenSettings: () => void;
  onOpenSaveProject: () => void;
  onOpenProjectList: () => void;
  onOpenSignIn: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  onOpenSettings,
  onOpenSaveProject,
  onOpenProjectList,
  onOpenSignIn
}) => {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <ErrorBoundary>
        <Header
          user={user}
          onSignOut={signOut}
          onOpenSettings={onOpenSettings}
          onOpenSaveProject={onOpenSaveProject}
          onOpenProjectList={onOpenProjectList}
          onOpenSignIn={onOpenSignIn}
        />
        <main className="py-6">
          <ResponsiveContainer>
            {children}
          </ResponsiveContainer>
        </main>
      </ErrorBoundary>
    </div>
  );
};

export default MainLayout;