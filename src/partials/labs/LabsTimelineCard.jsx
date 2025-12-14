import React from 'react';
import LineChart01 from '../../charts/LineChart01';
import EditMenu from '../../components/DropdownEditMenu';
import { Link } from 'react-router-dom';

export default function LabsTimelineCard() {

  const chartData = {
    labels: [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ],
    datasets: [
      {
        data: [5, 8, 3, 10, 7, 5, 6, 9, 4, 7, 8, 6],
        fill: true,
        borderColor: '#3b82f6', // Indigo
        backgroundColor: 'rgba(59,130,246,0.2)',
        tension: 0.2,
        pointRadius: 3,
        pointHoverRadius: 5,
      }
    ]
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-8 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <div className="px-5 pt-5">
        <header className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
            Labs Timeline
          </h2>
          <EditMenu align="right" className="relative inline-flex">
            <li>
              <Link className="font-medium text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 flex py-1 px-3" to="#0">Option 1</Link>
            </li>
            <li>
              <Link className="font-medium text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 flex py-1 px-3" to="#0">Option 2</Link>
            </li>
          </EditMenu>
        </header>
        <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-1">
          Labs Created per Month
        </div>
      </div>
      <div className="grow max-h-[180px]">
        <LineChart01 data={chartData} width={389} height={180} />
      </div>
    </div>
  );
}
