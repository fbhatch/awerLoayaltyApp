import React from 'react';

interface SpinnerProps {
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ className = '' }) => (
  <div className={`animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent ${className}`}></div>
);

export default Spinner;
