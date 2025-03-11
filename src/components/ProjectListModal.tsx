import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { supabase } from '../utils/supabaseClient';
import ModalHeader from './ModalHeader';
import { Trash2, Download, LogIn, Users } from 'lucide-react';
import { formatSupabaseError } from '../utils/supbaseErrorHandler';
import ErrorHandler from './common/ErrorHandler';
import LoadingSpinner from './common/LoadingSpinner';
import { isValidEmail } from '../utils/validators';

interface Project {
  id: string;
  name: string;
  address: string;
  created_at: string;
  data: any;
  user_id: string;
  is_public: boolean;
  created_by_email?: string;
}

interface ProjectListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadProject: (project: any) => void;
}

const ProjectListModal: React.FC<ProjectListModalProps> = ({ 
  isOpen, 
  onClose,
  onLoadProject
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth session error:", error);
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }
        
        const isAuthed = !!data.session;
        setIsAuthenticated(isAuthed);
        
        if (data.session) {
          setCurrentUserId(data.session.user.id);
          await fetchProjects(data.session.user.id);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error("Error checking auth status:", err);
        setIsAuthenticated(false);
        setLoading(false);
      }
    };
    
    if (isOpen) {
      checkAuth();
    }
  }, [isOpen]);

  // Reset error states when modal closes
  useEffect(() => {
    if (!isOpen) {
      setError(null);
      setAuthError(null);
    }
  }, [isOpen]);

  const validateSignIn = (): boolean => {
    if (!email.trim()) {
      setAuthError('Email is required');
      return false;
    }
    
    if (!isValidEmail(email)) {
      setAuthError('Please enter a valid email address');
      return false;
    }
    
    if (!password.trim()) {
      setAuthError('Password is required');
      return false;
    }
    
    setAuthError(null);
    return true;
  };

  const handleSignIn = async () => {
    if (!validateSignIn()) return;
    
    setAuthError(null);
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      setIsAuthenticated(true);
      
      if (data.user?.id) {
        setCurrentUserId(data.user.id);
        await fetchProjects(data.user.id);
      }
      
      setAuthError(null);
    } catch (err: any) {
      console.error('Error signing in:', err);
      setAuthError(formatSupabaseError(err));
      setLoading(false);
    }
  };

  const fetchProjects = async (userId: string) => {
    if (!userId) {
      setError('User ID is not available. Please try signing out and back in.');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Fetch all projects (both user's own projects and public projects)
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
    
      if (error) throw error;
      
      // Map the data to include the creator's email
      const projectsWithEmail = (data || []).map(project => ({
        ...project,
        created_by_email: project.profiles?.email || 'Unknown user'
      }));
      
      setProjects(projectsWithEmail);
    } catch (err: any) {
      console.error('Error fetching projects:', err);
      setError(formatSupabaseError(err));
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id: string) => {
    if (!currentUserId) {
      setError('User ID is not available. Cannot delete project.');
      return;
    }
    
    const confirmDelete = window.confirm("Are you sure you want to delete this project? This action cannot be undone.");
    if (!confirmDelete) return;
    
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)
        .eq('user_id', currentUserId); // Make sure user can only delete their own projects
      
      if (error) throw error;
      
      // Remove from local state
      setProjects(projects.filter(project => project.id !== id));
      
    } catch (err: any) {
      console.error('Error deleting project:', err);
      setError(formatSupabaseError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleLoadProject = (project: Project) => {
    onLoadProject(project.data);
    onClose();
  };

  const handleRetry = () => {
    if (currentUserId) {
      fetchProjects(currentUserId);
    } else {
      setError('No user ID available. Please try signing in again.');
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (err) {
      return dateString;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Saved Projects"
      ariaHideApp={false}
    >
      <div className="p-6">
        <ModalHeader title="Saved Projects" onClose={onClose} />
        
        {!isAuthenticated ? (
          <div className="mt-4">
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-4">
                Sign in to view all saved projects
              </p>
              
              <ErrorHandler error={authError} />
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={handleSignIn}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <LoadingSpinner size="small" message="Signing In..." />
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </>
                )}
              </button>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">
                For demo purposes, you can use any email and password that you used to save projects.
              </p>
            </div>
          </div>
        ) : (
          loading ? (
            <LoadingSpinner message="Loading projects..." />
          ) : (
            <div className="mt-4">
              <ErrorHandler error={error} onRetry={handleRetry} />
              
              {!error && (
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-blue-500 mr-2" />
                    <p className="text-sm text-blue-700">
                      All saved projects are viewable and editable by all authenticated users.
                    </p>
                  </div>
                </div>
              )}
              
              {!error && projects.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No saved projects found.</p>
                </div>
              ) : (
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Project Name</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Address</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {projects.map((project) => (
                        <tr key={project.id} className={project.user_id === currentUserId ? "bg-blue-50" : ""}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{project.name}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{project.address}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {formatDate(project.created_at)}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleLoadProject(project)}
                                className="text-blue-600 hover:text-blue-900 flex items-center"
                              >
                                <Download className="w-4 h-4 mr-1" />
                                Load
                              </button>
                              {project.user_id === currentUserId && (
                                <button
                                  onClick={() => deleteProject(project.id)}
                                  className="text-red-600 hover:text-red-900 flex items-center"
                                >
                                  <Trash2 className="w-4 h-4 mr-1" />
                                  Delete
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )
        )}
      </div>
    </Modal>
  );
};

export default ProjectListModal;