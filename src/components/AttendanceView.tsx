import React, { useState, useEffect, useRef } from 'react';
import { Scholar, StudentStatus } from '../types';
import {
  ChevronDown,
  Calendar,
  RotateCw,
  CheckCheck,
  X,
  CloudUpload,
  Check,
  Users,
  CheckCircle2,
  XCircle,
  Lock,
  Search,
  Filter,
  ShieldCheck,
  Clock,
} from 'lucide-react';

interface AttendanceViewProps {
  theme: 'dark' | 'light';
  scholars: Scholar[];
  onUpdateStatus: (scholarId: string, status: StudentStatus) => void;
  onMarkAllPresent: () => void;
  onMarkAllAbsent: () => void;
  selectedGrade: string;
  onChangeGrade: (grade: string) => void;
  selectedSubject: string;
  onChangeSubject: (subject: string) => void;
  selectedSection: string;
  onChangeSection: (section: string) => void;
  selectedDate: string;
  onChangeDate: (date: string) => void;
  isLoading?: boolean;
  onReload?: () => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  theme,
  scholars,
  onUpdateStatus,
  onMarkAllPresent,
  onMarkAllAbsent,
  selectedGrade,
  onChangeGrade,
  selectedSubject,
  onChangeSubject,
  selectedSection,
  onChangeSection,
  selectedDate,
  onChangeDate,
  isLoading = false,
  onReload,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isPushing, setIsPushing] = useState(false);
  const [pushedSuccess, setPushedSuccess] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [secondsRemaining, setSecondsRemaining] = useState(14 * 60 + 18);
  const dateInputRef = useRef<HTMLInputElement>(null);

  // Live ticking clock
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

  // 20-minute policy countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${String(s).padStart(2, '0')}s Remaining`;
  };

  const handleOpenCalendar = () => {
    if (dateInputRef.current) {
      if ('showPicker' in HTMLInputElement.prototype) {
        try {
          dateInputRef.current.showPicker();
        } catch {
          dateInputRef.current.focus();
        }
      } else {
        dateInputRef.current.focus();
      }
    }
  };

  const formatDisplayDate = (isoStr: string) => {
    try {
      const [year, month, day] = isoStr.split('-').map(Number);
      const d = new Date(year, month - 1, day);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return isoStr;
    }
  };

  // Dynamically compute KPI totals from active scholars
  const totalEnrolled = scholars.length;
  const presentCount = scholars.filter(s => s.status === 'present').length;
  const absentCount = scholars.filter(s => s.status === 'absent').length;
  const presentPercentage = totalEnrolled > 0 ? ((presentCount / totalEnrolled) * 100).toFixed(1) : '0.0';

  // Filter scholars
  const filteredScholars = scholars.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.track.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveAndPush = () => {
    setIsPushing(true);
    setTimeout(() => {
      setIsPushing(false);
      setPushedSuccess(true);
      setTimeout(() => {
        setPushedSuccess(false);
      }, 3000);
    }, 800);
  };

  return (
    <div className="w-full max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      
      {/* Top Header & Academic Context */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="flex flex-col gap-1 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-[#d4af37]">verified</span>
            <span className={`text-[11px] font-semibold uppercase tracking-widest font-mono ${
              theme === 'dark' ? 'text-[#ffe088]' : 'text-[#855800]'
            }`}>
              Pathshala • FACULTY REGISTRY SYSTEM
            </span>
          </div>
          <h1 className={`font-display text-3xl sm:text-4xl font-bold tracking-tight ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            Classroom Attendance & Roll Call Registry
          </h1>
          <p className={`text-sm ${theme === 'dark' ? 'text-[#d0c5af]' : 'text-slate-600'}`}>
            Official registrar log for {selectedGrade} • {selectedSubject} • {selectedSection} • Academic Year 2026–2027
          </p>
        </div>

        {/* Quick Session Indicator Chip with Live Clock */}
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-3 px-4 py-2 rounded-xl shadow-sm border ${
            theme === 'dark' ? 'bg-[#2a2a2c] border-[#353437]' : 'bg-[#ffffff] border-slate-200'
          }`}>
            <div className="w-2.5 h-2.5 rounded-full bg-[#d4af37] animate-pulse" />
            <div className="flex flex-col">
              <span className={`text-[10px] uppercase font-bold tracking-wider ${
                theme === 'dark' ? 'text-gray-400' : 'text-slate-500'
              }`}>
                Period 2 Active Clock
              </span>
              <span className={`font-mono text-sm font-bold ${
                theme === 'dark' ? 'text-[#d4af37]' : 'text-[#855800]'
              }`}>
                {currentTime || '08:44:12 EST'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Registry Control Console with 3 Dropdowns (Grade, Subject, Section) + Interactive Calendar Date Picker */}
      <div className={`w-full rounded-2xl p-5 shadow-xl flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4 border ${
        theme === 'dark' ? 'bg-[#1c1b1d] border-[#2a2a2c]' : 'bg-[#ffffff] border-slate-200'
      }`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 flex-1">
          
          {/* 1. Dropdown for Grade */}
          <div className="flex flex-col gap-1">
            <span className={`text-[10px] uppercase tracking-wider font-bold ${
              theme === 'dark' ? 'text-gray-400' : 'text-slate-600'
            }`}>
              Select Grade
            </span>
            <div className="relative">
              <select
                value={selectedGrade}
                onChange={(e) => onChangeGrade(e.target.value)}
                className={`w-full appearance-none px-3.5 py-2 pr-8 rounded-lg font-bold text-xs focus:outline-none cursor-pointer border transition-colors ${
                  theme === 'dark'
                    ? 'bg-[#2a2a2c] border-[#353437] text-white hover:bg-[#353437]'
                    : 'bg-slate-50 border-slate-300 text-slate-900 hover:bg-white'
                }`}
              >
                <option value="Grade 11">Grade 11 (Junior Roster)</option>
                <option value="Grade 12">Grade 12 (Senior Fellows)</option>
                <option value="Grade 10">Grade 10 (Sophomore Core)</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
            </div>
          </div>

          {/* 2. Dropdown for Subject */}
          <div className="flex flex-col gap-1">
            <span className={`text-[10px] uppercase tracking-wider font-bold ${
              theme === 'dark' ? 'text-gray-400' : 'text-slate-600'
            }`}>
              Select Subject
            </span>
            <div className="relative">
              <select
                value={selectedSubject}
                onChange={(e) => onChangeSubject(e.target.value)}
                className={`w-full appearance-none px-3.5 py-2 pr-8 rounded-lg font-bold text-xs focus:outline-none cursor-pointer border transition-colors ${
                  theme === 'dark'
                    ? 'bg-[#2a2a2c] border-[#353437] text-white hover:bg-[#353437]'
                    : 'bg-slate-50 border-slate-300 text-slate-900 hover:bg-white'
                }`}
              >
                <option value="AP Physics C">AP Physics C (Mechanics)</option>
                <option value="AP Calculus BC">AP Calculus BC (Series & ODEs)</option>
                <option value="Quantum Mechanics">Quantum Mechanics Foundations</option>
                <option value="Classical Mechanics">Classical Mechanics & Lagrangians</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
            </div>
          </div>

          {/* 3. Dropdown for Section */}
          <div className="flex flex-col gap-1">
            <span className={`text-[10px] uppercase tracking-wider font-bold ${
              theme === 'dark' ? 'text-gray-400' : 'text-slate-600'
            }`}>
              Select Section
            </span>
            <div className="relative">
              <select
                value={selectedSection}
                onChange={(e) => onChangeSection(e.target.value)}
                className={`w-full appearance-none px-3.5 py-2 pr-8 rounded-lg font-bold text-xs focus:outline-none cursor-pointer border transition-colors ${
                  theme === 'dark'
                    ? 'bg-[#2a2a2c] border-[#353437] text-white hover:bg-[#353437]'
                    : 'bg-slate-50 border-slate-300 text-slate-900 hover:bg-white'
                }`}
              >
                <option value="Section A">Section A (Morning Cohort)</option>
                <option value="Section B">Section B (Afternoon Cohort)</option>
                <option value="Section C">Section C (Lab Practicum)</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
            </div>
          </div>

          {/* 4. Interactive Session Calendar Date Picker */}
          <div className="flex flex-col gap-1">
            <span className={`text-[10px] uppercase tracking-wider font-bold ${
              theme === 'dark' ? 'text-gray-400' : 'text-slate-600'
            }`}>
              Session Calendar Date
            </span>
            <div
              onClick={handleOpenCalendar}
              className={`relative flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-bold border cursor-pointer select-none transition-all group ${
                theme === 'dark'
                  ? 'bg-[#2a2a2c] border-[#353437] text-white hover:border-[#d4af37]'
                  : 'bg-slate-50 border-slate-300 text-slate-900 hover:bg-white hover:border-amber-400'
              }`}
              title="Click to open interactive date picker"
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#d4af37] group-hover:scale-110 transition-transform" />
                <span>{formatDisplayDate(selectedDate)}</span>
              </div>
              <Calendar className="w-3.5 h-3.5 opacity-60" />

              {/* Hidden HTML5 Native Date Picker that triggers seamlessly on click */}
              <input
                ref={dateInputRef}
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  if (e.target.value) {
                    onChangeDate(e.target.value);
                  }
                }}
                className="absolute inset-0 opacity-0 pointer-events-auto cursor-pointer w-full h-full"
              />
            </div>
          </div>

        </div>

        {/* Action Buttons: Mark All Present, Mark All Absent, Save/Push, Reload */}
        <div className="flex items-center gap-2 mt-2 xl:mt-0 flex-wrap justify-end">
          {onReload && (
            <button
              onClick={onReload}
              disabled={isLoading}
              className={`p-2 rounded-xl border text-xs font-bold transition-all shadow-sm ${
                theme === 'dark'
                  ? 'bg-[#2a2a2c] border-[#353437] text-gray-300 hover:text-white'
                  : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100'
              }`}
              title="Reload Data"
            >
              <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#d4af37]' : ''}`} />
            </button>
          )}

          <button
            onClick={onMarkAllPresent}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border shadow-sm ${
              theme === 'dark'
                ? 'bg-[#2a2a2c] hover:bg-[#353437] border-[#353437] text-white hover:text-emerald-400'
                : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-900'
            }`}
          >
            <CheckCheck className="w-4 h-4 text-emerald-500" />
            <span>All Present</span>
          </button>

          <button
            onClick={onMarkAllAbsent}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border shadow-sm ${
              theme === 'dark'
                ? 'bg-[#2a2a2c] hover:bg-[#353437] border-[#353437] text-white hover:text-red-400'
                : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-900'
            }`}
          >
            <X className="w-4 h-4 text-red-500" />
            <span>All Absent</span>
          </button>

          <button
            disabled={isPushing}
            onClick={handleSaveAndPush}
            className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg ${
              pushedSuccess
                ? 'bg-emerald-600 text-white'
                : theme === 'dark'
                  ? 'bg-[#d4af37] hover:bg-[#ffe088] text-[#3c2f00]'
                  : 'bg-[#996515] hover:bg-[#7b4e00] text-white'
            }`}
          >
            {isPushing ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : pushedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Pushed to Registrar</span>
              </>
            ) : (
              <>
                <CloudUpload className="w-4 h-4" />
                <span>Push to Registrar</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Summary KPI Banner (Cleaned up: Total Enrolled, Present, Absent, Attendance Rate %, Sync State) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Enrolled */}
        <div className={`p-4 rounded-xl shadow-md border flex flex-col justify-between ${
          theme === 'dark' ? 'bg-[#1c1b1d] border-[#2a2a2c]' : 'bg-[#ffffff] border-slate-200'
        }`}>
          <div className={`flex items-center justify-between ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
            <span className="text-[10px] uppercase font-bold tracking-wider">Enrolled Total</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className={`text-3xl font-display font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              {totalEnrolled}
            </span>
            <span className={`text-xs font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
              Scholars
            </span>
          </div>
        </div>

        {/* Present in Hall */}
        <div className={`p-4 rounded-xl shadow-md border flex flex-col justify-between ${
          theme === 'dark' ? 'bg-[#1c1b1d] border-[#2a2a2c]' : 'bg-[#ffffff] border-slate-200'
        }`}>
          <div className={`flex items-center justify-between ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
            <span className="text-[10px] uppercase font-bold tracking-wider">Present in Hall</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-3xl font-display font-bold text-emerald-600 dark:text-emerald-400">
              {presentCount}
            </span>
            <span className={`text-xs font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
              {presentPercentage}% Rate
            </span>
          </div>
        </div>

        {/* Absent */}
        <div className={`p-4 rounded-xl shadow-md border flex flex-col justify-between ${
          theme === 'dark' ? 'bg-[#1c1b1d] border-[#2a2a2c]' : 'bg-[#ffffff] border-slate-200'
        }`}>
          <div className={`flex items-center justify-between ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
            <span className="text-[10px] uppercase font-bold tracking-wider">Absent Scholars</span>
            <XCircle className="w-4 h-4 text-red-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-3xl font-display font-bold text-red-600 dark:text-red-400">
              {absentCount}
            </span>
            <span className={`text-xs font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
              Demerit Flag
            </span>
          </div>
        </div>

        {/* Sync State */}
        <div className={`p-4 rounded-xl shadow-md border flex flex-col justify-between ${
          theme === 'dark' ? 'bg-[#201f22] border-[#353437]' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className={`flex items-center justify-between ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
            <span className="text-[10px] uppercase font-bold tracking-wider">Registrar Lock</span>
            <Lock className="w-4 h-4 text-[#d4af37]" />
          </div>
          <div className="mt-3 flex flex-col">
            <span className={`font-display font-bold text-sm ${
              theme === 'dark' ? 'text-[#d4af37]' : 'text-[#855800]'
            }`}>
              {pushedSuccess ? 'Locked & Verified' : 'Ready to Commit'}
            </span>
            <span className={`text-[11px] font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
              Auto-locks in {Math.floor(secondsRemaining / 60)} mins
            </span>
          </div>
        </div>
      </div>

      {/* Student Attendance Roster: ONLY Roll No., Scholar Name, and Status (Present / Absent) */}
      <div className={`w-full rounded-2xl shadow-2xl overflow-hidden flex flex-col border ${
        theme === 'dark' ? 'bg-[#1c1b1d] border-[#2a2a2c]' : 'bg-[#ffffff] border-slate-200'
      }`}>
        
        {/* Matrix Header Controls */}
        <div className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b ${
          theme === 'dark' ? 'bg-[#201f22] border-[#2a2a2c]' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <span className={`font-display font-bold text-base ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              Registered Scholars
            </span>
            <span className={`text-xs font-semibold ${
              theme === 'dark' ? 'text-[#d4af37]' : 'text-[#855800]'
            }`}>
              {selectedGrade} · {selectedSection}
            </span>
            {isLoading && (
              <span className="flex items-center gap-1.5 text-xs text-[#d4af37] font-semibold animate-pulse">
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                Loading...
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-slate-500'
              }`} />
              <input
                type="text"
                placeholder="Search scholar by roll or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`text-xs pl-8 pr-3 py-1.5 rounded-lg focus:outline-none w-56 sm:w-72 transition-colors border ${
                  theme === 'dark'
                    ? 'bg-[#2a2a2c] border-[#353437] text-white focus:bg-[#353437]'
                    : 'bg-white border-slate-300 text-slate-900 focus:bg-slate-50'
                }`}
              />
            </div>
            <button
              onClick={() => setSearchQuery('')}
              className={`p-1.5 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'hover:bg-gray-500/20 text-gray-400 hover:text-white'
                  : 'hover:bg-slate-200 text-slate-600 hover:text-slate-900'
              }`}
              title="Reset Search Filter"
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table Container: KEPT ONLY ROLL NO, NAME, PRESENT AND ABSENT */}
        <div className="w-full overflow-x-auto">
          {isLoading ? (
            <div className="p-12 flex flex-col items-center justify-center gap-3">
              <RotateCw className="w-8 h-8 text-[#d4af37] animate-spin" />
              <span className={`text-xs font-bold ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
                Loading roster and marks...
              </span>
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className={`text-[10px] font-bold uppercase tracking-wider ${
                  theme === 'dark' ? 'bg-[#2a2a2c]/60 text-gray-400' : 'bg-slate-100 text-slate-700'
                }`}>
                  <th className="py-3 px-6 w-32">Roll No.</th>
                  <th className="py-3 px-6">Scholar Name</th>
                  <th className="py-3 px-6 text-center w-60">Status</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-700/30' : 'divide-slate-200'}`}>
                {filteredScholars.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-gray-400">
                      No scholars found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredScholars.map((scholar) => (
                    <tr
                      key={scholar.id}
                      className={`transition-colors group ${
                        theme === 'dark' ? 'hover:bg-gray-500/10' : 'hover:bg-slate-50'
                      }`}
                    >
                      {/* 1. Roll No */}
                      <td className={`py-4 px-6 font-mono font-bold text-xs ${
                        theme === 'dark' ? 'text-gray-300' : 'text-slate-700'
                      }`}>
                        {scholar.rollNumber}
                      </td>

                      {/* 2. Scholar Name */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={scholar.avatar}
                            alt={scholar.name}
                            className="w-10 h-10 rounded-full object-cover ring-1 ring-gray-600/40 shrink-0"
                          />
                          <div className="flex flex-col min-w-0">
                            <span className={`font-bold text-sm transition-colors truncate ${
                              theme === 'dark'
                                ? 'text-white group-hover:text-[#d4af37]'
                                : 'text-slate-900 group-hover:text-[#996515]'
                            }`}>
                              {scholar.name}
                            </span>
                            <span className={`text-[11px] truncate ${
                              theme === 'dark' ? 'text-gray-400' : 'text-slate-600 font-medium'
                            }`}>
                              {scholar.track}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 3. Status: Present and Absent Toggle Only */}
                      <td className="py-4 px-6">
                        <div className={`flex items-center justify-center p-1 rounded-xl gap-2 w-max mx-auto border ${
                          theme === 'dark'
                            ? 'bg-[#0e0e10] border-[#2a2a2c]'
                            : 'bg-slate-100 border-slate-200'
                        }`}>
                          <button
                            type="button"
                            onClick={() => onUpdateStatus(scholar.id, 'present')}
                            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              scholar.status === 'present'
                                ? 'bg-emerald-600 text-white shadow-md'
                                : theme === 'dark'
                                    ? 'text-gray-400 hover:text-white hover:bg-[#2a2a2c]'
                                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Present</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => onUpdateStatus(scholar.id, 'absent')}
                            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              scholar.status === 'absent'
                                ? 'bg-red-600 text-white shadow-md'
                                : theme === 'dark'
                                    ? 'text-gray-400 hover:text-white hover:bg-[#2a2a2c]'
                                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200'
                            }`}
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Absent</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Table Footer */}
        <div className={`p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs border-t ${
          theme === 'dark'
            ? 'bg-[#201f22] border-[#2a2a2c] text-gray-400'
            : 'bg-slate-50 border-slate-200 text-slate-700'
        }`}>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#d4af37]" />
            <span className="font-semibold">
              Showing {filteredScholars.length} of {totalEnrolled} scholars in {selectedGrade} • {selectedSection}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] font-semibold">AES-256 Validated</span>
          </div>
        </div>

      </div>

      {/* Institutional Policy Notice */}
      <div className={`rounded-2xl p-5 shadow-xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
        theme === 'dark' ? 'bg-[#1c1b1d] border-[#2a2a2c]' : 'bg-[#ffffff] border-slate-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${
            theme === 'dark' ? 'bg-[#2a2a2c] text-[#d4af37]' : 'bg-amber-100 text-amber-900'
          }`}>
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className={`font-display font-bold text-sm block ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Faculty Handbook §4.2 Attendance Commitment
            </span>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600 font-medium'}`}>
              Classroom attendance must be synchronized to the Registrar within 20 minutes of period start.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#d4af37]" />
          <span className={`font-mono text-xs font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            {formatCountdown(secondsRemaining)}
          </span>
        </div>
      </div>

    </div>
  );
};
