import React from 'react';

type Feature = {
  id: string;
  name: string;
  description: string;
  badge?: string;
};

type FeatureListProps = {
  features: Feature[];
  isLoading?: boolean;
  onSelect: (featureId: string) => void;
};

export const FeatureList: React.FC<FeatureListProps> = ({ features, isLoading = false, onSelect }) => {
  if (isLoading) {
    return <div className="p-4 text-gray-500">Loading features...</div>;
  }

  if (!features || features.length === 0) {
    return <div className="p-4 text-gray-500">No features available yet.</div>;
  }

  return (
    <section className="max-w-3xl mx-auto py-8" aria-label="Product features">
      <header className="mb-6">
        <h2 className="text-2xl font-bold">Product Features</h2>
        <p className="text-gray-600">Select a feature to learn more.</p>
      </header>
      <ul className="space-y-4">
        {features.map((feature) => (
          <li key={feature.id} className="border rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{feature.name}</h3>
                <p className="text-gray-600 mt-1">{feature.description}</p>
              </div>
              {feature.badge && (
                <span className="ml-4 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                  {feature.badge}
                </span>
              )}
            </div>
            <button
              type="button"
              className="mt-4 inline-flex items-center text-sm font-semibold text-blue-600"
              onClick={() => onSelect(feature.id)}
              aria-label={`View details for ${feature.name}`}
            >
              View details →
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};
