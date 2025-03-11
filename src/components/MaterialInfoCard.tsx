import React from 'react';
import { Info } from 'lucide-react';

interface MaterialInfoCardProps {
  title: string;
  description: string;
  price: number;
  features?: string[];
  image?: string;
  recommended?: boolean;
}

const MaterialInfoCard: React.FC<MaterialInfoCardProps> = ({
  title,
  description,
  price,
  features,
  image,
  recommended = false
}) => {
  return (
    <div className={`
      relative rounded-lg border p-4 
      ${recommended ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
    `}>
      {recommended && (
        <div className="absolute -top-3 -right-3">
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            Recommended
          </span>
        </div>
      )}

      {image && (
        <img
          src={image}
          alt={title}
          className="w-full h-40 object-cover rounded-md mb-4"
        />
      )}

      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <div className="text-lg font-medium text-gray-900">
            ${price.toLocaleString()}
          </div>
        </div>

        <p className="text-sm text-gray-500">{description}</p>

        {features && features.length > 0 && (
          <div className="pt-2">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Features:</h4>
            <ul className="space-y-1">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm text-gray-600">
                  <Info className="h-4 w-4 text-blue-500 mr-2" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaterialInfoCard;