import React, { useState, useEffect } from 'react';
import { DR_STERLING_AVATAR } from '../data/mockData';
import { Menu, ChevronDown, Sun, Moon, Bell } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  selectedGrade?: string;
  onChangeGrade?: (g: string) => void;
  selectedSubject?: string;
  onChangeSubject?: (s: string) => void;
  selectedSection?: string;
  onChangeSection?: (sec: string) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenSidebar: () => void;
  unreadCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  selectedGrade = 'Grade 11',
  onChangeGrade,
  selectedSubject = 'AP Physics C',
  onChangeSubject,
  selectedSection = 'Section A',
  onChangeSection,
  theme,
  onToggleTheme,
  onOpenSidebar,
  unreadCount = 2,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  // Live ticking EST clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}:${seconds} EST`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const tabTitles: { [key: string]: string } = {
    overview: 'Executive Console',
    attendance: 'Attendance Registry',
    gradebook: 'Marks & Gradebook',
    curriculum: 'Curriculum & Work',
    library: 'Academic Library & Archives',
    feedback: 'Student Feedback',
  };

  return (
    <header
      className={`fixed top-0 right-0 left-0 lg:left-64 z-30 h-20 transition-colors duration-200 border-b backdrop-blur-xl ${
        theme === 'dark'
          ? 'bg-[#131315]/90 border-[#2a2a2c] text-[#e5e1e4]'
          : 'bg-[#ffffff]/90 border-slate-200 text-slate-900 shadow-sm'
      }`}
    >
      <div className="h-full max-w-360 mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        {/* Left Side: Mobile Menu Button + Breadcrumb */}
        <div className="flex items-center gap-3">
          {/* Hamburger toggle button for Mobile/Tablet */}
          <button
            onClick={onOpenSidebar}
            className={`p-2 rounded-xl lg:hidden transition-colors border ${
              theme === 'dark'
                ? 'bg-[#1c1b1d] border-[#353437] text-white hover:bg-[#2a2a2c]'
                : 'bg-slate-100 border-slate-200 text-slate-900 hover:bg-slate-200'
            }`}
            title="Open Navigation Menu"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumbs trail */}
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold uppercase tracking-wider hidden sm:inline ${
              theme === 'dark' ? 'text-gray-400' : 'text-slate-500'
            }`}>
              Faculty Portal
            </span>
            <span className="text-gray-400 hidden sm:inline">/</span>
            <span className={`font-display font-bold text-sm sm:text-base tracking-tight ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              {tabTitles[currentTab] || 'Dashboard'}
            </span>
          </div>
        </div>

        {/* Right Side: Cohort Dropdowns + Live Clock + Profile */}
        <div className="flex items-center gap-2.5">
          
          {/* Active Period Clock Chip */}
          <div className={`hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono font-bold ${
            theme === 'dark'
              ? 'bg-[#1c1b1d] border-[#353437] text-[#ffe085]'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse" />
            <span>Period 2 · {currentTime || '08:44:12 EST'}</span>
          </div>

          {/* 3 Quick Dropdowns in Header on Desktop */}
          {onChangeGrade && onChangeSubject && onChangeSection && (
            <div className="hidden md:flex items-center gap-1.5">
              {/* Grade */}
              <div className="relative">
                <select
                  value={selectedGrade}
                  onChange={(e) => onChangeGrade(e.target.value)}
                  className={`appearance-none text-xs font-bold pl-2.5 pr-6 py-1.5 rounded-lg cursor-pointer border transition-colors ${
                    theme === 'dark'
                      ? 'bg-[#2a2a2c] border-[#353437] text-white hover:bg-[#353437]'
                      : 'bg-slate-50 border-slate-300 text-slate-900 hover:bg-white'
                  }`}
                >
                  <option value="Grade 11">Gr 11</option>
                  <option value="Grade 12">Gr 12</option>
                  <option value="Grade 10">Gr 10</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
              </div>

              {/* Subject */}
              <div className="relative">
                <select
                  value={selectedSubject}
                  onChange={(e) => onChangeSubject(e.target.value)}
                  className={`appearance-none text-xs font-bold pl-2.5 pr-6 py-1.5 rounded-lg cursor-pointer border transition-colors ${
                    theme === 'dark'
                      ? 'bg-[#2a2a2c] border-[#353437] text-white hover:bg-[#353437]'
                      : 'bg-slate-50 border-slate-300 text-slate-900 hover:bg-white'
                  }`}
                >
                  <option value="AP Physics C">AP Physics C</option>
                  <option value="AP Calculus BC">AP Calculus BC</option>
                  <option value="Quantum Mechanics">Quantum Mech</option>
                  <option value="Classical Mechanics">Classical Mech</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
              </div>

              {/* Section */}
              <div className="relative">
                <select
                  value={selectedSection}
                  onChange={(e) => onChangeSection(e.target.value)}
                  className={`appearance-none text-xs font-bold pl-2.5 pr-6 py-1.5 rounded-lg cursor-pointer border transition-colors ${
                    theme === 'dark'
                      ? 'bg-[#2a2a2c] border-[#353437] text-white hover:bg-[#353437]'
                      : 'bg-slate-50 border-slate-300 text-slate-900 hover:bg-white'
                  }`}
                >
                  <option value="Section A">Sec A</option>
                  <option value="Section B">Sec B</option>
                  <option value="Section C">Sec C</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
              </div>
            </div>
          )}

          {/* Theme Toggle (Sun / Moon) */}
          <button
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            className={`p-2 rounded-xl transition-colors border flex items-center justify-center ${
              theme === 'dark'
                ? 'bg-[#1c1b1d] border-[#353437] text-white hover:bg-[#2a2a2c]'
                : 'bg-slate-100 border-slate-200 text-slate-900 hover:bg-slate-200'
            }`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#d4af37]" />
            ) : (
              <Moon className="w-4 h-4 text-[#d4af37]" />
            )}
          </button>

          {/* Notifications Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`relative p-2 rounded-xl transition-colors border flex items-center justify-center ${
                theme === 'dark'
                  ? 'bg-[#1c1b1d] border-[#353437] text-white hover:bg-[#2a2a2c]'
                  : 'bg-slate-100 border-slate-200 text-slate-900 hover:bg-slate-200'
              }`}
              title="Recent Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#d4af37] ring-2 ring-inherit" />
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div
                className={`absolute right-0 mt-2 w-80 rounded-2xl shadow-2xl p-4 border z-50 animate-in fade-in zoom-in-95 duration-150 ${
                  theme === 'dark'
                    ? 'bg-[#1c1b1d] border-[#353437] text-[#e5e1e4]'
                    : 'bg-[#ffffff] border-slate-300 text-slate-900'
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-inherit">
                  <span className="font-bold text-xs uppercase tracking-wider">Academic Alerts</span>
                  <span className={`text-[11px] font-bold font-mono ${
                    theme === 'dark' ? 'text-[#d4af37]' : 'text-[#855800]'
                  }`}>
                    2 Unread
                  </span>
                </div>
                <div className="flex flex-col gap-2.5 mt-2.5 text-xs">
                  <div className={`p-2.5 rounded-xl border ${
                    theme === 'dark' ? 'bg-[#2a2a2c] border-[#353437]' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}>
                    <div className="flex items-center justify-between font-bold">
                      <span>Records Synchronized</span>
                      <span className="text-[10px] text-slate-400">Just now</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-gray-300 mt-1">
                      Marks ledger auto-synchronized with registrar server.
                    </p>
                  </div>
                  <div className={`p-2.5 rounded-xl border ${
                    theme === 'dark' ? 'bg-[#2a2a2c] border-[#353437]' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}>
                    <div className="flex items-center justify-between font-bold">
                      <span>Devon Thorne (#1103)</span>
                      <span className="text-[10px] text-slate-400">07:45 AM</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-gray-300 mt-1">
                      Marked Absent in active registry. Guardian alert pending.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="w-full mt-3 py-1.5 text-center text-xs font-bold text-[#d4af37] hover:underline"
                >
                  Close Tray
                </button>
              </div>
            )}
          </div>

          {/* Profile Badge */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-[#201f22] transition-colors"
            >
              <img
                src={DR_STERLING_AVATAR}
                alt="Dr. Alistair Sterling"
                className={`w-9 h-9 rounded-full object-cover ring-2 ${
                  theme === 'dark' ? 'ring-[#d4af37]/60' : 'ring-[#996515]/60'
                }`}
              />
            </button>

            {showProfileMenu && (
              <div
                className={`absolute right-0 top-12 w-64 rounded-2xl shadow-2xl p-4 border z-50 text-xs ${
                  theme === 'dark'
                    ? 'bg-[#1c1b1d] border-[#353437] text-[#e5e1e4]'
                    : 'bg-[#ffffff] border-slate-300 text-slate-900'
                }`}
              >
                <div className="pb-2.5 border-b border-inherit">
                  <div className="font-bold text-sm">Dr. Alistair Sterling, Ph.D.</div>
                  <div className="text-[11px] text-slate-500 dark:text-gray-400">Senior Faculty Fellow · Physics Dept</div>
                  <div className="text-[10px] text-[#d4af37] mt-1 font-mono font-bold">FACULTY ID #AST-4421</div>
                </div>
                <div className="py-2 flex flex-col gap-1 text-slate-700 dark:text-gray-300">
                  <button
                    onClick={() => { setShowProfileMenu(false); onSelectTab('overview'); }}
                    className="text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#2a2a2c] font-medium"
                  >
                    Faculty Executive Console
                  </button>
                  <button
                    onClick={() => { setShowProfileMenu(false); onSelectTab('attendance'); }}
                    className="text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#2a2a2c] font-medium"
                  >
                    Attendance Roll Registry
                  </button>
                  <button
                    onClick={() => { setShowProfileMenu(false); onSelectTab('gradebook'); }}
                    className="text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#2a2a2c] font-medium"
                  >
                    Marks &amp; Gradebook Ledger
                  </button>
                </div>
                <div className="pt-2 border-t border-inherit flex justify-between items-center text-[10px] text-slate-400">
                  <span>AES-256 Validated</span>
                  <button
                    onClick={() => setShowProfileMenu(false)}
                    className="text-[#d4af37] font-bold hover:underline"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
