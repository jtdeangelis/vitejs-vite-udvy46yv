import React from 'react';
import { PropertyDetails } from '../types';
import GooglePhotosHelp from './GooglePhotosHelp';

interface PropertyDetailsFormProps {
  propertyDetails: PropertyDetails;
  setPropertyDetails: React.Dispatch<React.SetStateAction<PropertyDetails>>;
}

const PropertyDetailsForm: React.FC<PropertyDetailsFormProps> = ({ 
  propertyDetails, 
  setPropertyDetails 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Handle numeric fields
    if (['squareFeet', 'yearBuilt', 'purchasePrice', 'estimatedARV'].includes(name)) {
      setPropertyDetails({
        ...propertyDetails,
        [name]: value === '' ? 0 : Number(value)
      });
    } else {
      setPropertyDetails({
        ...propertyDetails,
        [name]: value
      });
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
          Property Address
        </label>
        <input
          type="text"
          id="address"
          name="address"
          value={propertyDetails.address}
          onChange={handleChange}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={propertyDetails.city}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
            State
          </label>
          <input
            type="text"
            id="state"
            name="state"
            value={propertyDetails.state}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
            Zip Code
          </label>
          <input
            type="text"
            id="zipCode"
            name="zipCode"
            value={propertyDetails.zipCode}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="squareFeet" className="block text-sm font-medium text-gray-700 mb-1">
            Square Feet
          </label>
          <div className="relative">
            <input
              type="number"
              id="squareFeet"
              name="squareFeet"
              value={propertyDetails.squareFeet || ''}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm pr-12"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-gray-500 sm:text-sm">sq ft</span>
            </div>
          </div>
        </div>
        
        <div>
          <label htmlFor="yearBuilt" className="block text-sm font-medium text-gray-700 mb-1">
            Year Built
          </label>
          <input
            type="number"
            id="yearBuilt"
            name="yearBuilt"
            value={propertyDetails.yearBuilt || ''}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="purchasePrice" className="block text-sm font-medium text-gray-700 mb-1">
            Purchase Price
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              id="purchasePrice"
              name="purchasePrice"
              value={propertyDetails.purchasePrice || ''}
              onChange={handleChange}
              className="block w-full pl-7 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="estimatedARV" className="block text-sm font-medium text-gray-700 mb-1">
            Estimated ARV
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              id="estimatedARV"
              name="estimatedARV"
              value={propertyDetails.estimatedARV || ''}
              onChange={handleChange}
              className="block w-full pl-7 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="photosAlbumUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Google Photos Album URL
          </label>
          <GooglePhotosHelp />
        </div>
        <input
          type="text"
          id="photosAlbumUrl"
          name="photosAlbumUrl"
          value={propertyDetails.photosAlbumUrl || ''}
          onChange={handleChange}
          placeholder="Paste your Google Photos album link here"
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
        <p className="mt-1 text-sm text-gray-500">
          Enter a Google Photos album URL to display property photos in the gallery.
        </p>
      </div>
    </div>
  );
};

export default PropertyDetailsForm;