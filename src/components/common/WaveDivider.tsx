import React from 'react';

interface WaveDividerProps {
  fillColor?: string;
  flip?: boolean;
}

export const WaveDivider: React.FC<WaveDividerProps> = ({ fillColor = '#F5A623', flip = false }) => {
  return (
    <div className={`w-full overflow-hidden leading-none ${flip ? 'rotate-180' : ''}`}>
      <svg
        className="relative block w-full h-12 md:h-20 lg:h-24"
        data-name="Layer 1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,60 L1200,120 L0,120 Z"
          fill={fillColor}
        ></path>
      </svg>
    </div>
  );
};
