import React from 'react';
import DoughnutChart from '../../charts/DoughnutChart';
import EditMenu from '../../components/DropdownEditMenu';
import { Link } from 'react-router-dom';

export default function LabsByStatusCard() {

  const chartData = {
    labels: ['Active', 'Completed', 'On Hold'],
    datasets: [
      {
        data: [8, 12, 3],
        backgroundColor: ['#22c55e', '#3b82f6', '#eab308'], // Green, Indigo, Yellow
        hoverBackgroundColor: ['#16a34a', '#2563eb', '#ca8a04']
      }
    ]
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <div className="px-5 pt-5">
        <header className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
            Labs By Status
          </h2>
          <EditMenu align="right" className="relative inline-flex">
            <li>
              <Link className="font-medium text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 flex py-1 px-3" to="#0">Option 1</Link>
            </li>
          </EditMenu>
        </header>
        <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-1">
          Status Distribution
        </div>
      </div>
      <div className="grow max-h-[180px]">
        <DoughnutChart data={chartData} width={180} height={180} />
      </div>
    </div>
  );
}
