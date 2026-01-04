// src/charts/BarChart03.jsx

import React, { useRef, useEffect } from 'react';
import {
  Chart,
  BarController,
  BarElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
Chart.register(
  BarController,
  BarElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

function BarChart03({ data, width, height }) {
  const canvas = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = canvas.current;
    if (!ctx) return;

    // Destroy existing chart
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Create new chart
    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 12,
            bottom: 16,
            left: 20,
            right: 20,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            border: {
              display: false,
            },
            ticks: {
              maxTicksLimit: 5,
              callback: (value) => value,
              color: getComputedStyle(document.documentElement)
                .getPropertyValue('--color-gray-500')
                .trim(),
            },
            grid: {
              color: getComputedStyle(document.documentElement)
                .getPropertyValue('--color-gray-200')
                .trim(),
            },
          },
          x: {
            type: 'category',
            border: {
              display: false,
            },
            grid: {
              display: false,
            },
            ticks: {
              color: getComputedStyle(document.documentElement)
                .getPropertyValue('--color-gray-500')
                .trim(),
            },
          },
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            align: 'end',
            labels: {
              boxWidth: 12,
              boxHeight: 12,
              padding: 15,
              color: getComputedStyle(document.documentElement)
                .getPropertyValue('--color-gray-700')
                .trim(),
              font: {
                size: 12,
                weight: '500',
              },
              usePointStyle: true,
              pointStyle: 'circle',
            },
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: getComputedStyle(document.documentElement)
              .getPropertyValue('--color-gray-800')
              .trim(),
            titleColor: getComputedStyle(document.documentElement)
              .getPropertyValue('--color-gray-100')
              .trim(),
            bodyColor: getComputedStyle(document.documentElement)
              .getPropertyValue('--color-gray-300')
              .trim(),
            borderColor: getComputedStyle(document.documentElement)
              .getPropertyValue('--color-gray-700')
              .trim(),
            borderWidth: 1,
            padding: 12,
            displayColors: true,
            callbacks: {
              title: (context) => context[0].label,
              label: (context) => {
                return `${context.dataset.label}: ${context.parsed.y}`;
              },
            },
          },
        },
        interaction: {
          mode: 'index',
          intersect: false,
        },
        animation: {
          duration: 500,
        },
        barPercentage: 0.7,
        categoryPercentage: 0.8,
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data]);

  return <canvas ref={canvas} width={width} height={height}></canvas>;
}

export default BarChart03;