
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-darkgray text-gray-300 py-6 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; {new Date().getFullYear()} sokoide.com All rights reserved.</p>
        <p className="text-sm text-gray-400">Powered by React, Tailwind CSS, and Gemini API.</p>
      </div>
    </footer>
  );
};

export default Footer;
