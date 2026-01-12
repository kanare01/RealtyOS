import React from 'react';

interface DonutChartProps {
  percentage: number;
  color?: string;
}

const DonutChart: React.FC<DonutChartProps> = ({ percentage, color = 'blue' }) => {
  const radius = 50;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  const colorClasses: Record<string, string> = {
      blue: 'text-blue-500',
  }

  return (
    <div className="relative w-32 h-32">
      <svg
        height="100%"
        width="100%"
        viewBox="0 0 120 120"
        className="-rotate-90"
      >
        <circle
          className="text-gray-200"
          strokeWidth={stroke}
          stroke="currentColor"
          fill="transparent"
          r={normalizedRadius}
          cx={radius+stroke}
          cy={radius+stroke}
        />
        <circle
          className={colorClasses[color]}
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          stroke="currentColor"
          fill="transparent"
          r={normalizedRadius}
          cx={radius+stroke}
          cy={radius+stroke}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-gray-800">{percentage}%</span>
      </div>
    </div>
  );
};

export default DonutChart;