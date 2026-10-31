import React from 'react';

interface FooterProps {
  theme: 'dark' | 'light';
  onOpenPolicyModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ theme, onOpenPolicyModal }) => {
  return (
    <footer className={`w-full border-t transition-colors duration-200 mt-auto ${
      theme === 'dark'
        ? 'bg-[#0e0e10] border-[#201f22] text-[#d0c5af]'
        : 'bg-[#ffffff] border-slate-200 text-slate-700'
    }`}>
      <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        
        {/* Accreditation & Governance */}
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 text-center md:text-left">
          <div className="flex items-center gap-1.5 font-bold">
            <span className="material-symbols-outlined text-sm text-[#d4af37]">verified</span>
            <span className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>
              Aetheria Academy Institutional Governance & Faculty Core
            </span>
          </div>
          <span className="hidden md:inline text-gray-400">•</span>
          <span className={`font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
            NEASC &amp; International Baccalaureate World School Accredited · QAA-9981
          </span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold">
          <button
            onClick={onOpenPolicyModal}
            className={`transition-colors cursor-pointer ${
              theme === 'dark' ? 'text-gray-300 hover:text-[#d4af37]' : 'text-slate-700 hover:text-[#855800]'
            }`}
          >
            Staff Handbook §4.2
          </button>
          <a
            href="#calendar"
            onClick={(e) => { e.preventDefault(); }}
            className={`transition-colors ${
              theme === 'dark' ? 'text-gray-300 hover:text-[#d4af37]' : 'text-slate-700 hover:text-[#855800]'
            }`}
          >
            Academic Calendar
          </a>
          <a
            href="#support"
            onClick={(e) => { e.preventDefault(); }}
            className={`transition-colors ${
              theme === 'dark' ? 'text-gray-300 hover:text-[#d4af37]' : 'text-slate-700 hover:text-[#855800]'
            }`}
          >
            Faculty Support Desk
          </a>
          <span className={`font-normal ${theme === 'dark' ? 'text-gray-500' : 'text-slate-500'}`}>
            © 2026–2027 Aetheria Academy. Confidential.
          </span>
        </div>

      </div>
    </footer>
  );
};
