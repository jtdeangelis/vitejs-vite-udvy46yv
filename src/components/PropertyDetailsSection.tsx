import React from 'react';
import { PropertyDetails } from '../types';
import PropertyDetailsForm from './PropertyDetailsForm';
import PhotoGallery from './PhotoGallery';

interface PropertyDetailsSectionProps {
  propertyDetails: PropertyDetails;
  setPropertyDetails: React.Dispatch<React.SetStateAction<PropertyDetails>>;
  projectId?: string;
}

const PropertyDetailsSection: React.FC<PropertyDetailsSectionProps> = ({ 
  propertyDetails, 
  setPropertyDetails,
  projectId
}) => {
  return (
    <div id="property-details-section" className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Property Details</h2>
        <p className="mt-1 text-sm text-gray-500">
          Enter information about the property
        </p>
      </div>
      
      <div className="px-4 py-5 sm:p-6">
        <div className="space-y-8">
          <div>
            <PropertyDetailsForm 
              propertyDetails={propertyDetails}
              setPropertyDetails={setPropertyDetails}
            />
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Property Photos & Videos</h3>
            <PhotoGallery projectId={projectId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsSection