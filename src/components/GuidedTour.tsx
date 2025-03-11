import React, { useEffect, useState } from 'react';
import { ShepherdTour, ShepherdTourContext } from 'react-shepherd';
import 'shepherd.js/dist/css/shepherd.css';

interface GuidedTourProps {
  isFirstVisit?: boolean;
}

const steps = [
  {
    id: 'welcome',
    attachTo: { element: '#property-details-section', on: 'bottom' },
    buttons: [
      {
        classes: 'shepherd-button-secondary',
        text: 'Skip Tour',
        type: 'cancel'
      },
      {
        classes: 'shepherd-button-primary',
        text: 'Next',
        type: 'next'
      }
    ],
    title: 'Welcome to the Home Renovation Estimator',
    text: ['This tool helps you plan and budget your renovation projects. Let\'s take a quick tour!'],
    cancelIcon: {
      enabled: true
    }
  },
  {
    id: 'property-details',
    attachTo: { element: '#property-details-section', on: 'bottom' },
    buttons: [
      {
        classes: 'shepherd-button-primary',
        text: 'Previous',
        type: 'back'
      },
      {
        classes: 'shepherd-button-primary',
        text: 'Next',
        type: 'next'
      }
    ],
    title: 'Property Details',
    text: [
      'Start by entering your property details, including address, size, and estimated value.'
    ]
  },
  {
    id: 'common-areas',
    attachTo: { element: '#common-areas-section', on: 'bottom' },
    buttons: [
      {
        classes: 'shepherd-button-primary',
        text: 'Previous',
        type: 'back'
      },
      {
        classes: 'shepherd-button-primary',
        text: 'Next',
        type: 'next'
      }
    ],
    title: 'Common Areas',
    text: [
      'Customize each common area in your home by clicking "Customize".',
      'You can select different materials, sizes, and features for each room.'
    ]
  },
  {
    id: 'bedrooms',
    attachTo: { element: '#bedrooms-section', on: 'top' },
    buttons: [
      {
        classes: 'shepherd-button-primary',
        text: 'Previous',
        type: 'back'
      },
      {
        classes: 'shepherd-button-primary',
        text: 'Next',
        type: 'next'
      }
    ],
    title: 'Bedrooms',
    text: [
      'Add or remove bedrooms as needed.',
      'Customize each bedroom by selecting flooring, paint, lighting, and more.'
    ]
  },
  {
    id: 'bathrooms',
    attachTo: { element: '#bathrooms-section', on: 'top' },
    buttons: [
      {
        classes: 'shepherd-button-primary',
        text: 'Previous',
        type: 'back'
      },
      {
        classes: 'shepherd-button-primary',
        text: 'Next',
        type: 'next'
      }
    ],
    title: 'Bathrooms',
    text: [
      'Add or remove bathrooms as needed.',
      'Select different vanities, showers, toilets, and more for each bathroom.'
    ]
  },
  {
    id: 'cost-breakdown',
    attachTo: { element: '#cost-breakdown-tab', on: 'bottom' },
    buttons: [
      {
        classes: 'shepherd-button-primary',
        text: 'Previous',
        type: 'back'
      },
      {
        classes: 'shepherd-button-primary',
        text: 'Next',
        type: 'next'
      }
    ],
    title: 'Cost Breakdown',
    text: [
      'Click here to view a detailed breakdown of all costs.',
      'You can add additional costs like labor, permits, and contingency.'
    ]
  },
  {
    id: 'project-tools',
    attachTo: { element: '#project-tools-section', on: 'left' },
    buttons: [
      {
        classes: 'shepherd-button-primary',
        text: 'Previous',
        type: 'back'
      },
      {
        classes: 'shepherd-button-primary',
        text: 'Finish',
        type: 'next'
      }
    ],
    title: 'Project Tools',
    text: [
      'Use these tools to save, load, or export your project.',
      'You can also generate a PDF report to share with contractors.'
    ]
  }
];

// Tour configuration
const tourOptions = {
  defaultStepOptions: {
    cancelIcon: {
      enabled: true
    },
    classes: 'shepherd-theme-custom',
    scrollTo: { behavior: 'smooth', block: 'center' }
  },
  useModalOverlay: true
};

// TourContent component to wrap the app content
const TourContent: React.FC = () => {
  const tour = React.useContext(ShepherdTourContext);

  useEffect(() => {
    // Wait for elements to be available before starting tour
    const startTour = () => {
      const propertyDetails = document.getElementById('property-details-section');
      const commonAreas = document.getElementById('common-areas-section');
      const bedrooms = document.getElementById('bedrooms-section');
      const bathrooms = document.getElementById('bathrooms-section');
      const costBreakdown = document.getElementById('cost-breakdown-tab');
      const projectTools = document.getElementById('project-tools-section');

      if (propertyDetails && commonAreas && bedrooms && bathrooms && costBreakdown && projectTools) {
        if (tour) {
          tour.start();
        }
      } else {
        // Retry after a short delay if elements aren't ready
        setTimeout(startTour, 100);
      }
    };

    startTour();
  }, [tour]);

  return null;
};

const GuidedTour: React.FC<GuidedTourProps> = ({ isFirstVisit = false }) => {
  const [showTour, setShowTour] = useState(isFirstVisit);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    
    if (isFirstVisit || !hasSeenTour) {
      setShowTour(true);
      localStorage.setItem('hasSeenTour', 'true');
    }
  }, [isFirstVisit]);

  const handleTourComplete = () => {
    setShowTour(false);
  };

  if (!showTour) return null;

  return (
    <ShepherdTour 
      steps={steps} 
      tourOptions={tourOptions}
      onComplete={handleTourComplete}
    >
      <TourContent />
    </ShepherdTour>
  );
};

export default GuidedTour;