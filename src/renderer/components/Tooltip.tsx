import React from "react";

interface Props {
  message: string;
  children: React.ReactNode;
  placement?: 'center' | 'left' | 'right';
}

const containerPlacement: Record<
  NonNullable<Props['placement']>,
  string
> = {
  center: 'left-1/2 -translate-x-1/2 items-center',
  left: 'left-0 items-start',
  right: 'right-0 items-end',
};

const arrowPlacement: Record<NonNullable<Props['placement']>, string> = {
  center: 'left-6',
  left: 'left-4',
  right: 'right-4',
};

const Tooltip: React.FC<Props> = ({ message, children, placement = 'center' }) => (
  <div className="relative inline-block group">
    {children}
    <div
      className={`pointer-events-none absolute top-0 z-50 hidden -translate-y-full group-hover:flex flex-col ${containerPlacement[placement]}`}
    >
      <div className="relative mb-2 min-w-[220px] max-w-[90vw] sm:min-w-[260px] sm:max-w-lg md:max-w-xl rounded-md border border-gray-200 bg-white px-3 py-2 text-xs text-left text-gray-700 shadow-md break-words whitespace-pre-line dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
        {message}
        <div
          className={`absolute bottom-0 translate-y-1/2 h-2 w-2 rotate-45 border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 ${arrowPlacement[placement]}`}
        />
      </div>
    </div>
  </div>
);

export default Tooltip;
