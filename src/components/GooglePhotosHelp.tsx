import React, { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';

const GooglePhotosHelp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-blue-500 hover:text-blue-700 focus:outline-none"
        title="How to share a Google Photos album"
      >
        <HelpCircle className="h-5 w-5" />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg z-10 p-4 border border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium text-gray-900">How to Share Google Photos Albums</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="space-y-4 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-800 mb-1">1. Create an album in Google Photos</h4>
              <p>Open Google Photos, select photos, click "+" and choose "Album"</p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-800 mb-1">2. Share the album</h4>
              <p>Open the album, click the share icon, then click "Create link"</p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-800 mb-1">3. Copy the link</h4>
              <p>Click "Copy link" and paste it into the album URL field</p>
            </div>
            
            <div className="bg-blue-50 p-3 rounded">
              <p className="text-blue-700">
                <strong>Note:</strong> For this demo app, any Google Photos album URL will display a set of demo property photos.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-800 mb-1">Example URLs:</h4>
              <ul className="list-disc list-inside">
                <li className="truncate">https://photos.app.goo.gl/1TFT5Qu1UBj4s52N8</li>
                <li className="truncate">https://photos.google.com/share/AF1QipM...</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GooglePhotosHelp;