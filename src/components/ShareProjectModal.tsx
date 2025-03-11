import React, { useState } from 'react';
import Modal from 'react-modal';
import { supabase } from '../utils/supabaseClient';
import { Link, Copy, Check, Share2 } from 'lucide-react';
import { formatSupabaseError } from '../utils/supbaseErrorHandler';

interface ShareProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
}

const ShareProjectModal: React.FC<ShareProjectModalProps> = ({
  isOpen,
  onClose,
  projectId,
  projectName
}) => {
  const [shareUrl, setShareUrl] = useState<string>('');
  const [expiryDays, setExpiryDays] = useState<number>(7);
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCreateShareLink = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Call the create_share_link function
      const { data, error: shareError } = await supabase
        .rpc('create_share_link', { 
          project_id: projectId,
          days_valid: expiryDays
        });

      if (shareError) throw shareError;

      // Generate the full share URL
      const shareToken = data;
      const baseUrl = window.location.origin;
      const fullUrl = `${baseUrl}/shared/${shareToken}`;
      
      setShareUrl(fullUrl);
    } catch (err) {
      console.error('Error creating share link:', err);
      setError(formatSupabaseError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublic = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from('projects')
        .update({ is_public: !isPublic })
        .eq('id', projectId);

      if (updateError) throw updateError;

      setIsPublic(!isPublic);
    } catch (err) {
      console.error('Error updating project visibility:', err);
      setError(formatSupabaseError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Share Project</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Close</span>
            <Share2 className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Project Info */}
          <div>
            <h3 className="text-lg font-medium text-gray-900">{projectName}</h3>
            <p className="mt-1 text-sm text-gray-500">
              Share this project with others
            </p>
          </div>

          {/* Public/Private Toggle */}
          <div className="flex items-center justify-between py-4 border-y border-gray-200">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Make Project Public</h4>
              <p className="text-sm text-gray-500">
                Allow anyone to view this project
              </p>
            </div>
            <button
              type="button"
              onClick={handleTogglePublic}
              disabled={loading}
              className={`${
                isPublic ? 'bg-blue-600' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              <span
                className={`${
                  isPublic ? 'translate-x-5' : 'translate-x-0'
                } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
              />
            </button>
          </div>

          {/* Share Link Generation */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Link Expiration
            </label>
            <select
              value={expiryDays}
              onChange={(e) => setExpiryDays(parseInt(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value={1}>24 hours</option>
              <option value={7}>7 days</option>
              <option value={30}>30 days</option>
              <option value={0}>Never</option>
            </select>
          </div>

          <button
            onClick={handleCreateShareLink}
            disabled={loading}
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Link className="h-4 w-4 mr-2" />
            Generate Share Link
          </button>

          {error && (
            <div className="bg-red-50 p-4 rounded-md">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {shareUrl && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Share Link
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="block w-full rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ShareProjectModal;