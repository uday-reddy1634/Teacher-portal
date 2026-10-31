import React from 'react';
import { BRAND_LOGO_URL, DR_STERLING_AVATAR } from '../data/mockData';
import {
  LayoutDashboard,
  UserCheck,
  Table2,
  FolderOpen,
  Library,
  MessageSquareQuote,
  Megaphone,
  BarChart3,
  FileText,
  Moon,
  Sun,
  X,
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenBroadcast: () => void;
  onOpenHandbook: () => void;
  onOpenBellCurve: () => void;
  selectedGrade?: string;
  selectedSubject?: string;
  selectedSection?: string;
  scholarCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpen,
  onClose,
  theme,
  onToggleTheme,
  onOpenBroadcast,
  onOpenHandbook,
  onOpenBellCurve,
  selectedGrade = 'Grade 11',
  selectedSubject = 'AP Physics C',
  selectedSection = 'Section A',
  scholarCount = 31,
}) => {
  const navItems = [
    { id: 'overview', label: 'Executive Console', Icon: LayoutDashboard },
    { id: 'attendance', label: 'Attendance Registry', Icon: UserCheck },
    { id: 'gradebook', label: 'Marks & Gradebook', Icon: Table2 },
    { id: 'curriculum', label: 'Curriculum & Work', Icon: FolderOpen },
    { id: 'library', label: 'Academic Library', Icon: Library },
    { id: 'feedback', label: 'Student Feedback', Icon: MessageSquareQuote },
  ];

  const handleNavClick = (id: string) => {
    onSelectTab(id);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile/Tablet Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Aside Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 sm:w-72 lg:w-64 flex flex-col justify-between transition-transform duration-300 ease-in-out border-r ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${
          theme === 'dark'
            ? 'bg-[#131315] border-[#2a2a2c] text-[#e5e1e4]'
            : 'bg-[#ffffff] border-slate-200 text-slate-900 shadow-xl lg:shadow-none'
        }`}
      >
        {/* Top Header & Brand */}
        <div className="flex flex-col">
          <div className="h-20 px-5 flex items-center justify-between border-b border-inherit">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => handleNavClick('overview')}
            >
              <img
                src={BRAND_LOGO_URL}
                alt="Aetheria Academy Logo"
                className="h-8 w-auto object-contain"
              />
              <div className="flex flex-col">
                <span className={`font-display font-bold text-sm tracking-tight leading-none ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}>
                  Aetheria Academy
                </span>
                <span className={`text-[10px] tracking-widest uppercase font-bold mt-1 ${
                  theme === 'dark' ? 'text-[#d4af37]' : 'text-[#855800]'
                }`}>
                  Faculty Portal
                </span>
              </div>
            </div>

            {/* Mobile / Tablet Close Button */}
            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg lg:hidden transition-colors ${
                theme === 'dark'
                  ? 'text-gray-400 hover:text-white hover:bg-[#2a2a2c]'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Close Navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Active Cohort Chip Indicator */}
          <div className="p-3.5 mx-3.5 mt-3.5 rounded-xl border border-inherit bg-opacity-40 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className={`w-2 h-2 rounded-full shrink-0 ${
                theme === 'dark' ? 'bg-[#d4af37] animate-pulse' : 'bg-[#855800] animate-pulse'
              }`} />
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 truncate">
                  Active Cohort
                </span>
                <span className={`font-bold text-xs truncate ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}>
                  {selectedSubject} · {selectedSection}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-gray-400 font-semibold truncate">
                  {selectedGrade}
                </span>
              </div>
            </div>
            <span className={`text-xs font-mono font-bold shrink-0 ${
              theme === 'dark' ? 'text-[#ffe085]' : 'text-[#855800]'
            }`}>
              {scholarCount} scholars
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-3.5 flex flex-col gap-1 mt-1">
            <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-gray-500">
              Academic Suite
            </div>
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              const IconComp = item.Icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 group text-left ${
                    isActive
                      ? theme === 'dark'
                        ? 'bg-[#d4af37] text-[#3c2f00] shadow-md'
                        : 'bg-[#996515] text-white shadow-md'
                      : theme === 'dark'
                        ? 'text-gray-300 hover:text-white hover:bg-[#201f22]'
                        : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <IconComp className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive
                        ? theme === 'dark' ? 'text-[#3c2f00]' : 'text-white'
                        : theme === 'dark' ? 'text-[#d4af37] group-hover:text-white' : 'text-[#855800] group-hover:text-slate-950'
                    }`} />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Quick Actions Shortcuts */}
          <div className="px-3.5 py-2 flex flex-col gap-1 border-t border-inherit">
            <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-gray-500">
              Quick Execution
            </div>
            
            <button
              onClick={() => {
                onOpenBroadcast();
                if (window.innerWidth < 1024) onClose();
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-left transition-colors ${
                theme === 'dark'
                  ? 'text-gray-300 hover:text-white hover:bg-[#201f22]'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <Megaphone className="w-4 h-4 text-[#d4af37] shrink-0" />
              <span>Broadcast Alert</span>
            </button>

            <button
              onClick={() => {
                onOpenBellCurve();
                if (window.innerWidth < 1024) onClose();
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-left transition-colors ${
                theme === 'dark'
                  ? 'text-gray-300 hover:text-white hover:bg-[#201f22]'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-[#d4af37] shrink-0" />
              <span>Bell Curve Analytics</span>
            </button>

            <button
              onClick={() => {
                onOpenHandbook();
                if (window.innerWidth < 1024) onClose();
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-left transition-colors ${
                theme === 'dark'
                  ? 'text-gray-300 hover:text-white hover:bg-[#201f22]'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4 text-[#d4af37] shrink-0" />
              <span>Faculty Handbook §4.2</span>
            </button>
          </div>
        </div>

        {/* Bottom Profile & Theme Control */}
        <div className="p-3.5 border-t border-inherit flex flex-col gap-2">
          
          {/* Theme Mode Toggle Button */}
          <button
            onClick={onToggleTheme}
            className={`w-full flex items-center justify-between p-2.5 rounded-xl border border-inherit text-xs font-bold transition-all ${
              theme === 'dark'
                ? 'bg-[#1c1b1d] hover:bg-[#2a2a2c] text-white'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-800'
            }`}
          >
            <div className="flex items-center gap-2">
              {theme === 'dark' ? (
                <Moon className="w-4 h-4 text-[#d4af37] shrink-0" />
              ) : (
                <Sun className="w-4 h-4 text-[#d4af37] shrink-0" />
              )}
              <span>{theme === 'dark' ? 'Dark Theme' : 'Light Theme'}</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">
              Toggle
            </span>
          </button>

          {/* User Profile Card */}
          <div className={`p-2.5 rounded-xl flex items-center gap-3 border border-inherit ${
            theme === 'dark' ? 'bg-[#1c1b1d]' : 'bg-slate-50'
          }`}>
            <img
              src={DR_STERLING_AVATAR}
              alt="Dr. Alistair Sterling"
              className={`w-9 h-9 rounded-full object-cover ring-2 ${
                theme === 'dark' ? 'ring-[#d4af37]/60' : 'ring-[#855800]/60'
              }`}
            />
            <div className="flex flex-col min-w-0">
              <span className={`font-bold text-xs truncate leading-tight ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                Dr. Alistair Sterling
              </span>
              <span className="text-[10px] text-slate-500 dark:text-gray-400 font-semibold truncate">
                Senior Faculty Fellow
              </span>
            </div>
          </div>

        </div>
      </aside>
    </>
  );
};
