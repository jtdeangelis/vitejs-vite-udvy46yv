import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { Room, IndividualRoom, PropertyDetails } from '../types';
import TabContainer from '../components/TabContainer';
import ErrorBoundary from '../components/ErrorBoundary';
import LoadingSpinner from '../components/common/LoadingSpinner';

interface SharedProjectData {
  propertyDetails: PropertyDetails;
  fixedRooms: Room[];
  bedrooms: IndividualRoom[];
  bathrooms: IndividualRoom[];
  customRooms: Room[];
  totalCost: number;
}

const SharedProject: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [projectData, setProjectData] = useState<SharedProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSharedProject = async () => {
      try {
        // First get the project ID from the share token
        const { data: shareData, error: shareError } = await supabase
          .from('shared_projects')
          .select('project_id')
          .eq('share_token', token)
          .single();

        if (shareError) throw shareError;
        if (!shareData) throw new Error('Share link not found');

        // Then get the actual project data
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', shareData.project_id)
          .single();

        if (projectError) throw projectError;
        if (!projectData) throw new Error('Project not found');

        // Update view count
        await supabase
          .from('shared_projects')
          .update({ 
            views: shareData.views + 1,
            last_viewed_at: new Date().toISOString()
          })
          .eq('share_token', token);

        setProjectData(projectData.data);
      } catch (err) {
        console.error('Error fetching shared project:', err);
        setError('This share link is invalid or has expired.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchSharedProject();
    }
  }, [token]);

  if (loading) {
    return <LoadingSpinner message="Loading shared project..." />;
  }

  if (error || !projectData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error || 'Failed to load project'}</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {projectData.propertyDetails.address || 'Shared Project'}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              View-only shared project
            </p>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <TabContainer
            propertyDetails={projectData.propertyDetails}
            setPropertyDetails={() => {}}
            fixedRooms={projectData.fixedRooms}
            bedrooms={projectData.bedrooms}
            bathrooms={projectData.bathrooms}
            customRooms={projectData.customRooms}
            doors={[]}
            onCustomizeRoom={() => {}}
            onAddBedroom={() => {}}
            onDeleteBedroom={() => {}}
            onCustomizeBedroom={() => {}}
            onAddBathroom={() => {}}
            onDeleteBathroom={() => {}}
            onCustomizeBathroom={() => {}}
            onAddCustomRoom={() => {}}
            onEditCustomRoom={() => {}}
            onDeleteCustomRoom={() => {}}
            onCustomizeCustomRoom={() => {}}
            onAddDoor={() => {}}
            onUpdateDoor={() => {}}
            onDeleteDoor={() => {}}
            totalCost={projectData.totalCost}
            readOnly={true}
          />
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default SharedProject;