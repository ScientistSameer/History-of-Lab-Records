// src/components/CollaborationScoreInfo.jsx

import React from 'react';

function CollaborationScoreInfo() {
  return (
    <div className="w-80 text-left">
      <h4 className="font-semibold text-gray-900 mb-3">
        How Collaboration Score is Calculated
      </h4>
      
      <div className="space-y-3 text-sm">
        {/* Domain Match */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium text-gray-800">1. Domain Match</span>
            <span className="text-indigo-600 font-semibold">30 pts</span>
          </div>
          <ul className="text-gray-600 text-xs space-y-1 ml-3">
            <li>• Perfect match: 30 points</li>
            <li>• Partial match: 20 points</li>
            <li>• Different domains: 5 points</li>
          </ul>
        </div>

        {/* Sub-domain Overlap */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium text-gray-800">2. Sub-domain Overlap</span>
            <span className="text-indigo-600 font-semibold">20 pts</span>
          </div>
          <ul className="text-gray-600 text-xs space-y-1 ml-3">
            <li>• 7 points per common sub-domain</li>
            <li>• Max 20 points total</li>
          </ul>
        </div>

        {/* Resource Compatibility */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium text-gray-800">3. Resource Compatibility</span>
            <span className="text-indigo-600 font-semibold">20 pts</span>
          </div>
          <ul className="text-gray-600 text-xs space-y-1 ml-3">
            <li>• Equipment level match: 10 pts</li>
            <li>• Shared computing resources: 10 pts</li>
          </ul>
        </div>

        {/* Team Size */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium text-gray-800">4. Team Size Compatibility</span>
            <span className="text-indigo-600 font-semibold">15 pts</span>
          </div>
          <ul className="text-gray-600 text-xs space-y-1 ml-3">
            <li>• Both have active teams: 10 pts</li>
            <li>• Similar team sizes: 5 pts</li>
          </ul>
        </div>

        {/* Availability */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium text-gray-800">5. Availability & Workload</span>
            <span className="text-indigo-600 font-semibold">15 pts</span>
          </div>
          <ul className="text-gray-600 text-xs space-y-1 ml-3">
            <li>• Available status: 10 pts</li>
            <li>• Low workload (&lt;70): 5 pts</li>
          </ul>
        </div>

        {/* Total */}
        <div className="pt-2 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-900">Total Score</span>
            <span className="text-indigo-600 font-bold text-base">100 pts</span>
          </div>
        </div>

        {/* Grade Scale */}
        <div className="pt-2 border-t border-gray-200">
          <p className="font-medium text-gray-800 mb-2">Grade Scale:</p>
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">80-100:</span>
              <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded font-medium">
                Excellent
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">60-79:</span>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-medium">
                Good
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">40-59:</span>
              <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded font-medium">
                Fair
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">0-39:</span>
              <span className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded font-medium">
                Poor
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CollaborationScoreInfo;