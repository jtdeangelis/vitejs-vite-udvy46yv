import React, { useState, useEffect } from 'react';
import { Mail, Lock, LogIn, UserPlus } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';
import { isValidEmail, isPasswordStrong, getPasswordStrengthFeedback } from '../utils/validators';
import ErrorHandler from './common/ErrorHandler';
import LoadingSpinner from './common/LoadingSpinner';
import BaseModal from './base/BaseModal';
import ModalContent from './base/ModalContent';
import ModalSection from './base/ModalSection';
import ModalButton from './base/ModalButton';
import ModalActions from './base/ModalActions';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'signin' | 'signup';
  onSuccess?: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  mode: initialMode,
  onSuccess
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordFeedback, setPasswordFeedback] = useState<{ isStrong: boolean; feedback: string } | null>(null);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    if (!isOpen) {
      setError(null);
      setPasswordFeedback(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (mode === 'signup' && password) {
      setPasswordFeedback(getPasswordStrengthFeedback(password));
    } else {
      setPasswordFeedback(null);
    }
  }, [password, mode]);

  const validateInputs = (): boolean => {
    if (!email) {
      setError('Email is required');
      return false;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (!password) {
      setError('Password is required');
      return false;
    }

    if (mode === 'signup' && !isPasswordStrong(password)) {
      setError('Password must be at least 8 characters with uppercase, lowercase and numbers');
      return false;
    }

    setError(null);
    return true;
  };

  const handleEmailSignUp = async () => {
    if (!validateInputs()) return;

    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;

      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignIn = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (mode === 'signup') {
      await handleEmailSignUp();
    } else {
      await handleEmailSignIn();
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'signin' ? 'Sign In to Your Account' : 'Create an Account'}
    >
      <ModalContent>
        <ModalSection title="Authentication">
          <div className="space-y-4">
            <ErrorHandler error={error} />

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="••••••••"
                  />
                </div>
                {passwordFeedback && (
                  <p className={`text-xs mt-1 ${passwordFeedback.isStrong ? 'text-green-600' : 'text-amber-600'}`}>
                    {passwordFeedback.feedback}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <ModalButton
                onClick={handleSubmit}
                disabled={loading}
                loading={loading}
                icon={mode === 'signin' ? <LogIn className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                className="w-full"
              >
                {mode === 'signin' ? 'Sign In' : 'Create Account'}
              </ModalButton>

              <button
                onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                className="w-full text-sm text-blue-600 hover:text-blue-800"
              >
                {mode === 'signin' ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
              </button>
            </div>
          </div>
        </ModalSection>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            For demo purposes, you can use any email and password.
          </p>
        </div>
      </ModalContent>
    </BaseModal>
  );
};

export default AuthModal;