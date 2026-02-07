import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Pre-configured chart options
export const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: false,
        },
        tooltip: {
            callbacks: {
                label: function(context) {
                    const label = context.dataset.label || '';
                    const value = context.parsed.y;
                    const dataset = context.dataset.data;
                    const total = dataset.reduce((acc, val) => acc + val, 0);
                    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                    return `${label}: ${value} (${percentage}%)`;
                }
            }
        }
    },
    scales: {
        y: {
            beginAtZero: true,
        },
    },
};

export const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: false,
        },
        tooltip: {
            callbacks: {
                label: function(context) {
                    const label = context.dataset.label || '';
                    const value = context.parsed.y;
                    
                    // Calculate percentage of total for this dataset
                    const dataset = context.dataset.data;
                    const total = dataset.reduce((acc, val) => acc + val, 0);
                    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                    
                    return `${label}: ${value.toLocaleString()} (${percentage}%)`;
                }
            }
        }
    },
    scales: {
        y: {
            beginAtZero: true,
        },
    },
};

export const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'right',
        },
        title: {
            display: false,
        },
        tooltip: {
            callbacks: {
                label: function(context) {
                    const label = context.label || '';
                    const value = context.parsed;
                    
                    // Calculate percentage for pie charts
                    const dataset = context.dataset.data;
                    const total = dataset.reduce((acc, val) => acc + val, 0);
                    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                    
                    return `${label}: ${value.toLocaleString()} (${percentage}%)`;
                }
            }
        }
    },
};

export const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'right',
        },
        title: {
            display: false,
        },
        tooltip: {
            callbacks: {
                label: function(context) {
                    const label = context.label || '';
                    const value = context.parsed;
                    
                    // Calculate percentage for doughnut charts
                    const dataset = context.dataset.data;
                    const total = dataset.reduce((acc, val) => acc + val, 0);
                    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                    
                    return `${label}: ${value.toLocaleString()} (${percentage}%)`;
                }
            }
        }
    },
};

// Chart components exports
export { Line as LineChart, Bar as BarChart, Pie as PieChart, Doughnut as DoughnutChart };
