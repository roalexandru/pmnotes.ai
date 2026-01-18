import React from 'react';

interface Feature {
  name: string;
  description: string;
}

interface FeatureListProps {
  features: Feature[];
}

export const FeatureList: React.FC<FeatureListProps> = ({ features }) => {
  if (!features || features.length === 0) {
    return <div className="p-4 text-gray-500">No features available.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6 border-b pb-2">Product Features</h2>
      <ul className="space-y-4">
        {features.map((feature, index) => (
          <li 
            key={index} 
            className="p-4 bg-white rounded-lg shadow border border-gray-200 hover:border-blue-500 transition-colors"
          >
            <h3 className="font-bold text-lg text-gray-900">{feature.name}</h3>
            <p className="text-gray-600 mt-1">{feature.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
