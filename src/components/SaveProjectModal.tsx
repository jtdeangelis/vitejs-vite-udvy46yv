import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { supabase } from '../utils/supabaseClient';
import ModalHeader from './ModalHeader';
import { Save, FileText, Loader } from 'lucide-react';
import { isValidProjectName } from '../utils/validators';
import { formatSupabaseError } from '../utils/supbaseErrorHandler';
import ErrorHandler from './common/ErrorHandler';
import LoadingSpinner from './common/LoadingSpinner';
import { PDFExporter } from '../utils/pdfExporter';

interface SaveProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectData: any;
  propertyDetails: any;
  onProjectSaved?: (projectId: string) => void;
}

const SaveProjectModal: React.FC<SaveProjectModalProps> = ({ 
  isOpen, 
  onClose,
  projectData,
  propertyDetails,
  onProjectSaved
}) => {
  const [projectName, setProjectName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [exportingPDF, setExportingPDF] = useState(false);

  // Check if user is authenticated when the modal opens
  useEffect(() => {
    if (isOpen) {
      checkAuthStatus();
      
      // Set initial project name based on property address
      if (propertyDetails?.address && !projectName) {
        setProjectName(propertyDetails.address);
      }
    }
  }, [isOpen, propertyDetails?.address]);

  // Reset states when modal closes
  useEffect(() => {
    if (!isOpen) {
      setError(null);
      setAuthError(null);
      setSuccess(false);
    }
  }, [isOpen]);

  const checkAuthStatus = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error checking auth status:", error);
        setIsAuthenticated(false);
        setUserId(null);
        return;
      }
      
      if (data.session) {
        setIsAuthenticated(true);
        setUserId(data.session.user.id);
      } else {
        setIsAuthenticated(false);
        setUserId(null);
      }
    } catch (err) {
      console.error("Error checking auth status:", err);
      setIsAuthenticated(false);
    }
  };

  const validateSignUpInputs = (): boolean => {
    if (!email.trim()) {
      setAuthError('Email is required');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setAuthError('Please enter a valid email address');
      return false;
    }
    
    if (!password.trim()) {
      setAuthError('Password is required');
      return false;
    }
    
    if (password.length < 6) {
      setAuthError('Password must be at least 6 characters');
      return false;
    }
    
    setAuthError(null);
    return true;
  };

  const handleSignUp = async () => {
    if (!validateSignUpInputs()) return;
    
    setAuthError(null);
    setSaving(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      setIsAuthenticated(true);
      if (data.user) {
        setUserId(data.user.id);
      }
      setAuthError(null);
    } catch (err: any) {
      console.error('Error signing up:', err);
      setAuthError(formatSupabaseError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      setAuthError('Please enter both email and password');
      return;
    }
    
    setAuthError(null);
    setSaving(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      setIsAuthenticated(true);
      if (data.user) {
        setUserId(data.user.id);
      }
      setAuthError(null);
    } catch (err: any) {
      console.error('Error signing in:', err);
      setAuthError(formatSupabaseError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Error signing out:", error);
        return;
      }
      
      setIsAuthenticated(false);
      setUserId(null);
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  const validateProjectSave = (): boolean => {
    if (!isValidProjectName(projectName)) {
      setError('Please enter a project name');
      return false;
    }
    
    if (!userId) {
      setError('User authentication error. Please try signing out and back in.');
      return false;
    }
    
    setError(null);
    return true;
  };

  const handleSave = async () => {
    if (!validateProjectSave()) return;

    setSaving(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Combine all project data
      const data = {
        ...projectData,
        propertyDetails
      };
      
      const { data: savedProject, error } = await supabase
        .from('projects')
        .insert([
          { 
            name: projectName.trim(),
            address: propertyDetails.address || 'No address',
            data: data,
            is_public: true,
            user_id: userId
          }
        ])
        .select()
        .single();
      
      if (error) throw error;
      
      setSuccess(true);
      setProjectName('');

      // Call onProjectSaved with the new project ID
      if (savedProject && onProjectSaved) {
        onProjectSaved(savedProject.id);
      }
      
      // Close modal after a short delay
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
      
    } catch (err: any) {
      console.error('Error saving project:', err);
      setError(formatSupabaseError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleExportPDF = async () => {
    setExportingPDF(true);
    try {
      const pdfExporter = new PDFExporter({
        propertyDetails,
        fixedRooms: projectData.fixedRooms,
        bedrooms: projectData.bedrooms,
        bathrooms: projectData.bathrooms,
        customRooms: projectData.customRooms,
        totalCost: projectData.totalCost,
        timeline: []
      });
      
      await pdfExporter.generateAndDownload();
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setExportingPDF(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Save Project"
      ariaHideApp={false}
    >
      <div className="p-6">
        <ModalHeader title="Save Project" onClose={onClose} />
        
        {!isAuthenticated ? (
          <div className="mt-4">
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-4">
                {isSigningUp 
                  ? 'Create an account to save your projects' 
                  : 'Sign in to save your projects'}
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
            
            <div className="flex flex-col space-y-3">
              {isSigningUp ? (
                <>
                  <button
                    onClick={handleSignUp}
                    disabled={saving}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
                  >
                    {saving ? <LoadingSpinner size="small" message="Creating Account..." /> : 'Create Account'}
                  </button>
                  <button
                    onClick={() => setIsSigningUp(false)}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Already have an account? Sign In
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleSignIn}
                    disabled={saving}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
                  >
                    {saving ? <LoadingSpinner size="small" message="Signing In..." /> : 'Sign In'}
                  </button>
                  <button
                    onClick={() => setIsSigningUp(true)}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Need an account? Sign Up
                  </button>
                </>
              )}
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">
                For demo purposes, you can use any email and password.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-600">
                Signed in and ready to save your project
              </p>
              <button
                onClick={handleSignOut}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Sign Out
              </button>
            </div>
            
            <ErrorHandler error={error} />
            
            <div>
              <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-1">
                Project Name
              </label>
              <input
                type="text"
                id="projectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Enter a name for this project"
              />
            </div>
            
            <div className="mt-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Note:</strong> All saved projects will be viewable and editable by all authenticated users.
                </p>
              </div>
            </div>
            
            {success && (
              <div className="mt-4 bg-green-50 p-4 rounded-lg">
                <p className="text-green-700">Project saved successfully!</p>
              </div>
            )}
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              
              <button
                onClick={handleExportPDF}
                disabled={exportingPDF}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {exportingPDF ? (
                  <>
                    <Loader className="animate-spin -ml-1 mr-2 h-5 w-5" />
                    Exporting PDF...
                  </>
                ) : (
                  <>
                    <FileText className="-ml-1 mr-2 h-5 w-5" />
                    Export PDF
                  </>
                )}
              </button>
              
              <button
                onClick={handleSave}
                disabled={saving || !projectName.trim()}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <LoadingSpinner size="small" message="Saving..." />
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Project
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default SaveProjectModal;