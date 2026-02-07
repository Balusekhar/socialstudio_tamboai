
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white py-12 border-t border-gray-50">
      <div className="max-w-[1440px] mx-auto px-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 border-[4px] border-brand rounded-full flex items-center justify-center">
              <div className="w-1 h-1 bg-brand rounded-full"></div>
            </div>
            <span className="font-bold text-lg tracking-tight">IG Studio</span>
          </div>
          
          <div className="flex space-x-8 text-xs font-bold uppercase tracking-widest text-gray-400">
            <a href="#" className="hover:text-black transition-colors">Privacy</a>
            <a href="#" className="hover:text-black transition-colors">Terms</a>
            <a href="#" className="hover:text-black transition-colors">Twitter</a>
            <a href="#" className="hover:text-black transition-colors">LinkedIn</a>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t border-gray-50 pt-8">
          <p className="text-gray-400 text-[13px] font-medium">
            &copy; {new Date().getFullYear()} IG Studio. All rights reserved.
          </p>
          
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-gray-300 uppercase tracking-[0.2em]">Project Submission</span>
            <div className="h-4 w-px bg-gray-100 mx-2"></div>
            <p className="text-gray-400 text-[11px] font-medium">
              Proudly built for <a href="https://www.wemakedevs.org/hackathons/tambo" target="_blank" rel="noopener noreferrer" className="text-black hover:text-brand underline decoration-gray-200 underline-offset-4">WeMakeDevs</a> × <a href="https://tambo.co/" target="_blank" rel="noopener noreferrer" className="text-black hover:text-brand underline decoration-gray-200 underline-offset-4">Tambo AI</a> Hackathon
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
