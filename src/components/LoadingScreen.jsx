import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50">
      <div className="relative">
        <div className="absolute -inset-4 bg-gradient-to-r from-[#ff5757] to-[#b91c1c] rounded-full opacity-20 blur-2xl animate-pulse"></div>
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-4 border-t-transparent border-[#ff5757] animate-spin"></div>
          <div className="mt-4 text-center">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#ff5757] to-[#b91c1c] rounded blur opacity-20"></div>
            <div className="relative font-medium text-gray-200">Loading...</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;