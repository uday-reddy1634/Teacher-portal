import React, { useState } from 'react';
import { LAB_EQUIPMENT_IMG } from '../data/mockData';

interface OverviewViewProps {
  theme: 'dark' | 'light';
  onNavigate: (tab: string) => void;
  onOpenBroadcast: () => void;
  onOpenInteractiveBoard: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  theme,
  onNavigate,
  onOpenBroadcast,
  onOpenInteractiveBoard,
}) => {
  const [approvedRows, setApprovedRows] = useState<{ [key: string]: boolean }>({});
  const [acknowledgedNotes, setAcknowledgedNotes] = useState<{ [key: string]: boolean }>({});
  const [inquiryReplies, setInquiryReplies] = useState<{ [key: string]: string }>({});
  const [openReplyBox, setOpenReplyBox] = useState<string | null>(null);
  const [gradeInputs, setGradeInputs] = useState<{ [key: string]: number }>({
    jv: 98,
    ml: 94,
    dt: 89,
  });

  const handleApproveGrade = (id: string) => {
    setApprovedRows(prev => ({ ...prev, [id]: true }));
  };

  const handleAcknowledge = (id: string) => {
    setAcknowledgedNotes(prev => ({ ...prev, [id]: true }));
  };

  const handleSendReply = (id: string, text: string) => {
    setInquiryReplies(prev => ({ ...prev, [id]: text }));
    setOpenReplyBox(null);
  };

  return (
    <div className="w-full max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      
      {/* Top Context & Salutation Module */}
      <div className="relative w-full">
        {theme === 'dark' && (
          <>
            <div className="absolute -top-16 left-1/4 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-[120px] pointer-events-none -z-10" />
            <div className="absolute top-10 right-10 w-72 h-72 bg-[#acb3c7]/5 rounded-full blur-[90px] pointer-events-none -z-10" />
          </>
        )}

        {/* Header & Executive Actions */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="flex flex-col gap-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest font-bold text-slate-500 dark:text-gray-400">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
                <span>FACULTY EXECUTIVE CONSOLE · FALL SEMESTER 2026</span>
              </div>
            </div>
            <h1 className={`font-display text-3xl sm:text-4xl font-extrabold tracking-tight mt-1 ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              Good morning, <span className={theme === 'dark' ? 'text-[#f2ca50]' : 'text-[#996515]'}>Dr. Sterling</span>.
            </h1>
            <p className={`text-sm font-medium ${
              theme === 'dark' ? 'text-[#d0c5af]' : 'text-slate-700'
            }`}>
              Here is your instructional pulse for <strong className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-950'}`}>AP Physics C (Section 11-A)</strong> and Departmental Advising.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <button
              onClick={onOpenBroadcast}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm border ${
                theme === 'dark'
                  ? 'bg-[#2a2a2c] hover:bg-[#353437] border-[#353437] text-white'
                  : 'bg-white hover:bg-slate-100 text-slate-900 border-slate-300'
              }`}
            >
              <span className="material-symbols-outlined text-[#d4af37] text-lg">campaign</span>
              <span>Broadcast Announcement</span>
            </button>
            <button
              onClick={() => onNavigate('attendance')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md ${
                theme === 'dark'
                  ? 'bg-[#d4af37] hover:bg-[#ffe088] text-[#3c2f00]'
                  : 'bg-[#996515] hover:bg-[#7b4e00] text-white'
              }`}
            >
              <span className="material-symbols-outlined text-lg">fact_check</span>
              <span>Take Today's Roll</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics 4-Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        
        {/* Metric 1: Attendance */}
        <div className={`p-5 rounded-2xl shadow-md border flex flex-col justify-between transition-all ${
          theme === 'dark' 
            ? 'bg-[#1c1b1d] border-[#2a2a2c]' 
            : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${
              theme === 'dark' ? 'text-gray-400' : 'text-slate-600'
            }`}>
              Today's Attendance
            </span>
            <span className={`text-[11px] font-bold ${
              theme === 'dark' ? 'text-[#f2ca50]' : 'text-[#855800]'
            }`}>
              Period 2 Completed
            </span>
          </div>
          <div className="my-3 flex items-baseline gap-2">
            <span className={`text-3xl font-display font-extrabold ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              96.8%
            </span>
            <span className={`text-xs font-semibold ${
              theme === 'dark' ? 'text-gray-400' : 'text-slate-600'
            }`}>
              30 / 31 Present
            </span>
          </div>
          <div className={`flex items-center justify-between text-xs font-medium ${
            theme === 'dark' ? 'text-gray-400' : 'text-slate-700'
          }`}>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500" /> 1 Excused Leave
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
              High Stability ↑
            </span>
          </div>
        </div>

        {/* Metric 2: Submissions */}
        <div className={`p-5 rounded-2xl shadow-md border flex flex-col justify-between transition-all ${
          theme === 'dark' 
            ? 'bg-[#1c1b1d] border-[#2a2a2c]' 
            : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${
              theme === 'dark' ? 'text-gray-400' : 'text-slate-600'
            }`}>
              Submissions to Grade
            </span>
            <span className={`text-[11px] font-bold ${
              theme === 'dark' ? 'text-[#ffe085]' : 'text-blue-800'
            }`}>
              Due for Review
            </span>
          </div>
          <div className="my-3 flex items-baseline gap-2">
            <span className={`text-3xl font-display font-extrabold ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              14
            </span>
            <span className={`text-xs font-semibold ${
              theme === 'dark' ? 'text-gray-400' : 'text-slate-600'
            }`}>
              Queue Pending
            </span>
          </div>
          <div className={`flex items-center justify-between text-xs font-medium ${
            theme === 'dark' ? 'text-gray-400' : 'text-slate-700'
          }`}>
            <span>8 Problem Sets, 6 Labs</span>
            <span className="material-symbols-outlined text-[#d4af37] text-base">assignment_late</span>
          </div>
        </div>

        {/* Metric 3: Section Grade Avg */}
        <div className={`p-5 rounded-2xl shadow-md border flex flex-col justify-between transition-all ${
          theme === 'dark' 
            ? 'bg-[#1c1b1d] border-[#2a2a2c]' 
            : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${
              theme === 'dark' ? 'text-gray-400' : 'text-slate-600'
            }`}>
              Section Grade Avg
            </span>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              +1.8% vs Mid 1
            </span>
          </div>
          <div className="my-3 flex items-baseline gap-2">
            <span className={`text-3xl font-display font-extrabold ${
              theme === 'dark' ? 'text-[#f2ca50]' : 'text-[#7b4e00]'
            }`}>
              91.4%
            </span>
            <span className={`text-sm font-bold ${
              theme === 'dark' ? 'text-gray-300' : 'text-slate-800'
            }`}>
              (A-)
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="w-24 h-6">
              <svg className="w-full h-full text-[#d4af37]" fill="none" viewBox="0 0 100 24">
                <path d="M0 18 Q 15 17, 30 14 T 60 11 T 85 6 T 100 4" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" />
                <path d="M0 18 Q 15 17, 30 14 T 60 11 T 85 6 T 100 4 L 100 24 L 0 24 Z" fill="currentColor" fillOpacity="0.15" />
              </svg>
            </div>
            <span className={`text-[11px] font-semibold ${
              theme === 'dark' ? 'text-gray-400' : 'text-slate-600'
            }`}>
              31 Cohort Marks
            </span>
          </div>
        </div>

        {/* Metric 4: Commendations */}
        <div className={`p-5 rounded-2xl shadow-md border flex flex-col justify-between transition-all ${
          theme === 'dark' 
            ? 'bg-[#1c1b1d] border-[#2a2a2c]' 
            : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${
              theme === 'dark' ? 'text-gray-400' : 'text-slate-600'
            }`}>
              Commendations
            </span>
            <span className="material-symbols-outlined text-[#d4af37] text-lg">military_tech</span>
          </div>
          <div className="my-3 flex items-baseline gap-2">
            <span className={`text-3xl font-display font-extrabold ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              8 New
            </span>
            <span className={`text-xs font-semibold ${
              theme === 'dark' ? 'text-gray-400' : 'text-slate-600'
            }`}>
              Notes
            </span>
          </div>
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className={`truncate max-w-37.5 ${
              theme === 'dark' ? 'text-gray-400' : 'text-slate-700'
            }`}>
              Vance, Chen & 6 others
            </span>
            <button
              onClick={() => onNavigate('feedback')}
              className={`font-bold hover:underline ${
                theme === 'dark' ? 'text-[#d4af37]' : 'text-[#7b4e00]'
              }`}
            >
              View All
            </button>
          </div>
        </div>

      </div>

      {/* Main Content 2-Column Grid (8 / 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: 8 Units */}
        <div className="lg:col-span-8 flex flex-col gap-8 min-w-0">
          
          {/* Today's Instructional Schedule */}
          <div className={`rounded-2xl p-6 shadow-md border flex flex-col gap-4 ${
            theme === 'dark' ? 'bg-[#1c1b1d] border-[#2a2a2c]' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-inherit">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#d4af37] text-xl">event_upcoming</span>
                <h2 className={`font-display text-lg font-bold tracking-tight ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}>
                  Today's Instructional Schedule
                </h2>
              </div>
              <div className={`flex items-center gap-1.5 text-xs font-semibold ${
                theme === 'dark' ? 'text-gray-400' : 'text-slate-600'
              }`}>
                <span>Wednesday</span>
                <span>•</span>
                <span className={theme === 'dark' ? 'text-[#d4af37]' : 'text-[#7b4e00]'}>
                  Day 3 Rotational Cycle
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {/* Period 01 */}
              <div className={`p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors border ${
                theme === 'dark' 
                  ? 'bg-[#2a2a2c] hover:bg-[#353437] border-transparent' 
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
              }`}>
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-display font-bold text-base shadow-sm ${
                    theme === 'dark' ? 'bg-[#1c1b1d] text-[#d4af37]' : 'bg-white text-[#7b4e00] border border-slate-200'
                  }`}>
                    01
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-bold text-sm ${
                        theme === 'dark' ? 'text-white' : 'text-slate-900'
                      }`}>
                        AP Physics C: Classical Dynamics Lab
                      </span>
                      <span className={`text-xs font-mono font-bold ${
                        theme === 'dark' ? 'text-[#d4af37]' : 'text-[#855800]'
                      }`}>
                        08:30 – 09:55 AM
                      </span>
                    </div>
                    <div className={`flex items-center gap-4 mt-1 text-xs font-medium flex-wrap ${
                      theme === 'dark' ? 'text-gray-400' : 'text-slate-600'
                    }`}>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">meeting_room</span> Faraday Hall 401
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">group</span> 31 Scholars Registered
                      </span>
                    </div>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold ${
                    theme === 'dark' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-900'
                  }`}>
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    Roll Finalized
                  </span>
                  <button
                    onClick={() => onNavigate('attendance')}
                    className={`p-1.5 rounded-md transition-colors ${
                      theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-gray-700/30' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
                    }`}
                    title="View Attendance Registry"
                  >
                    <span className="material-symbols-outlined text-lg">folder_open</span>
                  </button>
                </div>
              </div>

              {/* Period 03 (Active Session) */}
              <div className={`relative p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 overflow-hidden border ${
                theme === 'dark' ? 'bg-[#2a2a2c] border-[#d4af37]/60' : 'bg-amber-50/80 border-amber-300'
              }`}>
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#d4af37]" />
                <div className="flex items-start gap-4 pl-1">
                  <div className="w-10 h-10 rounded-xl bg-[#d4af37] text-[#3c2f00] flex items-center justify-center shrink-0 shadow-md font-display font-bold text-base">
                    03
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-extrabold text-sm ${
                        theme === 'dark' ? 'text-white' : 'text-slate-950'
                      }`}>
                        Honors Mechanics Seminar
                      </span>
                      <span className={`text-xs font-bold ${
                        theme === 'dark' ? 'text-[#d4af37]' : 'text-amber-900'
                      }`}>
                        • Active Session
                      </span>
                    </div>
                    <div className={`flex items-center gap-4 mt-1 text-xs font-semibold flex-wrap ${
                      theme === 'dark' ? 'text-gray-300' : 'text-slate-700'
                    }`}>
                      <span className={`flex items-center gap-1 font-bold ${
                        theme === 'dark' ? 'text-[#d4af37]' : 'text-amber-950'
                      }`}>
                        <span className="material-symbols-outlined text-sm">schedule</span> 11:15 AM – 12:40 PM
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">meeting_room</span> Hall 401
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">group</span> 28 Enrolled
                      </span>
                    </div>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <button
                    onClick={onOpenInteractiveBoard}
                    className="px-4 py-2 rounded-xl bg-[#d4af37] text-[#3c2f00] text-xs font-extrabold hover:bg-[#ffe088] transition-all shadow-md flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-sm">co_present</span>
                    <span>Launch Interactive Board</span>
                  </button>
                </div>
              </div>

              {/* Period 05 */}
              <div className={`p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors border ${
                theme === 'dark' 
                  ? 'bg-[#2a2a2c] hover:bg-[#353437] border-transparent' 
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
              }`}>
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-display font-bold text-base shadow-sm ${
                    theme === 'dark' ? 'bg-[#1c1b1d] text-gray-400' : 'bg-white text-slate-700 border border-slate-200'
                  }`}>
                    05
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-bold text-sm ${
                        theme === 'dark' ? 'text-white' : 'text-slate-900'
                      }`}>
                        Faculty Office Hours & Mentorship
                      </span>
                      <span className={`text-xs font-mono font-bold ${
                        theme === 'dark' ? 'text-[#d4af37]' : 'text-[#855800]'
                      }`}>
                        02:00 – 03:30 PM
                      </span>
                    </div>
                    <div className={`flex items-center gap-4 mt-1 text-xs font-medium flex-wrap ${
                      theme === 'dark' ? 'text-gray-400' : 'text-slate-600'
                    }`}>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">science</span> Kepler Innovation Suite
                      </span>
                      <span className={`flex items-center gap-1 font-bold ${
                        theme === 'dark' ? 'text-[#d4af37]' : 'text-amber-900'
                      }`}>
                        <span className="material-symbols-outlined text-sm">event_available</span> 4 Appointments Booked
                      </span>
                    </div>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <button
                    onClick={() => alert('Viewing 4 booked scholar appointments: Julian Vance (Astrophysics prep), Maya Lin (Lab practical inquiry), Lucas Chen (Robotics advising), Aria Montgomery (Pre-med fellowship).')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border ${
                      theme === 'dark' 
                        ? 'bg-[#1c1b1d] hover:bg-[#353437] text-white border-transparent' 
                        : 'bg-white hover:bg-slate-100 text-slate-900 border-slate-300 shadow-sm'
                    }`}
                  >
                    View Appointments
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Gradebook Queue */}
          <div className={`rounded-2xl p-6 shadow-md border flex flex-col gap-4 ${
            theme === 'dark' ? 'bg-[#1c1b1d] border-[#2a2a2c]' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-inherit">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#d4af37] text-xl">fact_check</span>
                <div>
                  <h2 className={`font-display text-lg font-bold tracking-tight ${
                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}>
                    Quick Gradebook Queue
                  </h2>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                    Quantum Oscillations Lab Reports awaiting score confirmation
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('gradebook')}
                className={`text-xs font-bold hover:underline flex items-center gap-1 ${
                  theme === 'dark' ? 'text-[#d4af37]' : 'text-[#7b4e00]'
                }`}
              >
                Open Full Gradebook <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>

            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className={`uppercase tracking-wider text-[10px] font-bold border-b border-inherit ${
                    theme === 'dark' ? 'text-gray-400 bg-transparent' : 'text-slate-700 bg-slate-50'
                  }`}>
                    <th className="py-2.5 px-3">Scholar</th>
                    <th className="py-2.5 px-3">Assessment Item</th>
                    <th className="py-2.5 px-3">Submitted</th>
                    <th className="py-2.5 px-3 text-center">Calculated Mark</th>
                    <th className="py-2.5 px-3 text-right">Quick Evaluation</th>
                  </tr>
                </thead>
                <tbody className="divide-y border-inherit">
                  {/* Row 1: Julian Vance */}
                  <tr className={`transition-colors ${theme === 'dark' ? 'hover:bg-gray-800/40' : 'hover:bg-slate-50'}`}>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#d4af37]/20 text-[#d4af37] flex items-center justify-center font-bold text-xs">
                          JV
                        </div>
                        <div>
                          <div className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            Julian Vance
                          </div>
                          <div className={`text-[10px] ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                            Roll #ATH-1101
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className={`font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-slate-900'}`}>
                        Quantum Oscillations Lab
                      </div>
                      <div className={`text-[10px] ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                        PDF Submission • 14 Pages
                      </div>
                    </td>
                    <td className={`py-3 px-3 font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-slate-700'}`}>
                      Oct 24, 09:14 PM
                    </td>
                    <td className="py-3 px-3 text-center">
                      <input
                        type="number"
                        value={gradeInputs['jv']}
                        onChange={(e) => setGradeInputs(prev => ({ ...prev, jv: Number(e.target.value) }))}
                        className={`w-14 text-center py-1 rounded font-mono font-bold text-sm focus:outline-none border ${
                          theme === 'dark' 
                            ? 'bg-[#2a2a2c] border-[#353437] text-[#f2ca50]' 
                            : 'bg-white border-slate-300 text-slate-950 shadow-sm'
                        }`}
                      />
                      <span className={`text-[10px] font-medium ml-1 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                        / 100
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {approvedRows['jv'] ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-end gap-1 text-[11px]">
                          <span className="material-symbols-outlined text-sm">check_circle</span> Published
                        </span>
                      ) : (
                        <button
                          onClick={() => handleApproveGrade('jv')}
                          className="px-3 py-1.5 rounded-lg bg-[#d4af37] text-[#3c2f00] font-bold hover:bg-[#ffe088] shadow-sm text-xs transition-all"
                        >
                          Approve & Publish
                        </button>
                      )}
                    </td>
                  </tr>

                  {/* Row 2: Maya Lin */}
                  <tr className={`transition-colors ${theme === 'dark' ? 'hover:bg-gray-800/40' : 'hover:bg-slate-50'}`}>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                          ML
                        </div>
                        <div>
                          <div className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            Maya Lin
                          </div>
                          <div className={`text-[10px] ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                            Roll #ATH-1102
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className={`font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-slate-900'}`}>
                        Quantum Oscillations Lab
                      </div>
                      <div className={`text-[10px] ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                        Jupyter Notebook & Data
                      </div>
                    </td>
                    <td className={`py-3 px-3 font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-slate-700'}`}>
                      Oct 24, 11:42 PM
                    </td>
                    <td className="py-3 px-3 text-center">
                      <input
                        type="number"
                        value={gradeInputs['ml']}
                        onChange={(e) => setGradeInputs(prev => ({ ...prev, ml: Number(e.target.value) }))}
                        className={`w-14 text-center py-1 rounded font-mono font-bold text-sm focus:outline-none border ${
                          theme === 'dark' 
                            ? 'bg-[#2a2a2c] border-[#353437] text-[#f2ca50]' 
                            : 'bg-white border-slate-300 text-slate-950 shadow-sm'
                        }`}
                      />
                      <span className={`text-[10px] font-medium ml-1 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                        / 100
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {approvedRows['ml'] ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-end gap-1 text-[11px]">
                          <span className="material-symbols-outlined text-sm">check_circle</span> Published
                        </span>
                      ) : (
                        <button
                          onClick={() => handleApproveGrade('ml')}
                          className="px-3 py-1.5 rounded-lg bg-[#d4af37] text-[#3c2f00] font-bold hover:bg-[#ffe088] shadow-sm text-xs transition-all"
                        >
                          Approve & Publish
                        </button>
                      )}
                    </td>
                  </tr>

                  {/* Row 3: Devon Thorne */}
                  <tr className={`transition-colors ${theme === 'dark' ? 'hover:bg-gray-800/40' : 'hover:bg-slate-50'}`}>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                          DT
                        </div>
                        <div>
                          <div className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            Devon Thorne
                          </div>
                          <div className={`text-[10px] ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                            Roll #ATH-1103
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className={`font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-slate-900'}`}>
                        Quantum Oscillations Lab
                      </div>
                      <div className={`text-[10px] ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                        LaTeX Source + Figures
                      </div>
                    </td>
                    <td className={`py-3 px-3 font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-slate-700'}`}>
                      Oct 25, 07:10 AM
                    </td>
                    <td className="py-3 px-3 text-center">
                      <input
                        type="number"
                        value={gradeInputs['dt']}
                        onChange={(e) => setGradeInputs(prev => ({ ...prev, dt: Number(e.target.value) }))}
                        className={`w-14 text-center py-1 rounded font-mono font-bold text-sm focus:outline-none border ${
                          theme === 'dark' 
                            ? 'bg-[#2a2a2c] border-[#353437] text-[#f2ca50]' 
                            : 'bg-white border-slate-300 text-slate-950 shadow-sm'
                        }`}
                      />
                      <span className={`text-[10px] font-medium ml-1 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                        / 100
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {approvedRows['dt'] ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-end gap-1 text-[11px]">
                          <span className="material-symbols-outlined text-sm">check_circle</span> Published
                        </span>
                      ) : (
                        <button
                          onClick={() => handleApproveGrade('dt')}
                          className="px-3 py-1.5 rounded-lg bg-[#d4af37] text-[#3c2f00] font-bold hover:bg-[#ffe088] shadow-sm text-xs transition-all"
                        >
                          Approve & Publish
                        </button>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Bottom Hardware Telemetry Banner */}
            <div className={`p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 mt-2 border ${
              theme === 'dark' 
                ? 'bg-[#131315] border-[#2a2a2c]' 
                : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-3">
                <img
                  src={LAB_EQUIPMENT_IMG}
                  alt="Cavendish Torsion Sensor Apparatus"
                  className="w-16 h-12 rounded-lg object-cover ring-1 ring-gray-400 shrink-0"
                />
                <div className="flex flex-col">
                  <span className={`font-bold text-xs ${
                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}>
                    Cavendish Torsion Sensor Suite Live
                  </span>
                  <span className={`text-[11px] font-medium ${
                    theme === 'dark' ? 'text-gray-400' : 'text-slate-600'
                  }`}>
                    Calibrated for Period 3 Honors Lab Session. Ready for telemetry stream.
                  </span>
                </div>
              </div>
              <span className={`text-xs font-bold shrink-0 ${
                theme === 'dark' ? 'text-[#d4af37]' : 'text-[#855800]'
              }`}>
                Hardware Synced
              </span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: 4 Units */}
        <div className="lg:col-span-4 flex flex-col gap-8 min-w-0">
          
          {/* Week Punctuality */}
          <div className={`rounded-2xl p-6 shadow-md border flex flex-col gap-4 ${
            theme === 'dark' ? 'bg-[#1c1b1d] border-[#2a2a2c]' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-inherit">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#d4af37] text-xl">query_stats</span>
                <h3 className={`font-display text-base font-bold tracking-tight ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}>
                  Week Punctuality
                </h3>
              </div>
              <span className={`text-xs font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                Week 9
              </span>
            </div>

            {/* Visual Bar Chart */}
            <div className="grid grid-cols-5 gap-2 items-end pt-4 pb-2">
              <div className="flex flex-col items-center gap-1">
                <span className={`text-[10px] font-mono font-bold ${
                  theme === 'dark' ? 'text-gray-300' : 'text-slate-700'
                }`}>
                  98%
                </span>
                <div className={`w-full rounded-t h-24 flex items-end ${
                  theme === 'dark' ? 'bg-[#2a2a2c]' : 'bg-slate-100'
                }`}>
                  <div className="w-full bg-[#d4af37] rounded-t" style={{ height: '98%' }} />
                </div>
                <span className={`text-[11px] font-bold mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-700'}`}>M</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className={`text-[10px] font-bold font-mono ${
                  theme === 'dark' ? 'text-[#d4af37]' : 'text-amber-900'
                }`}>
                  100%
                </span>
                <div className={`w-full rounded-t h-24 flex items-end ${
                  theme === 'dark' ? 'bg-[#2a2a2c]' : 'bg-slate-100'
                }`}>
                  <div className="w-full bg-[#d4af37] rounded-t" style={{ height: '100%' }} />
                </div>
                <span className={`text-[11px] font-bold mt-1 ${
                  theme === 'dark' ? 'text-[#d4af37]' : 'text-amber-900'
                }`}>
                  T
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className={`text-[10px] font-bold font-mono ${
                  theme === 'dark' ? 'text-white' : 'text-slate-950'
                }`}>
                  96.8%
                </span>
                <div className={`w-full rounded-t h-24 flex items-end ${
                  theme === 'dark' ? 'bg-[#2a2a2c]' : 'bg-slate-100'
                }`}>
                  <div className="w-full bg-[#d4af37]/80 rounded-t" style={{ height: '96.8%' }} />
                </div>
                <span className={`text-[11px] font-bold mt-1 ${
                  theme === 'dark' ? 'text-white' : 'text-slate-950'
                }`}>
                  W
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className={`text-[10px] font-mono font-bold ${
                  theme === 'dark' ? 'text-gray-300' : 'text-slate-700'
                }`}>
                  97%
                </span>
                <div className={`w-full rounded-t h-24 flex items-end ${
                  theme === 'dark' ? 'bg-[#2a2a2c]' : 'bg-slate-100'
                }`}>
                  <div className="w-full bg-[#d4af37]/60 rounded-t" style={{ height: '97%' }} />
                </div>
                <span className={`text-[11px] font-bold mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-700'}`}>Th</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] text-gray-400 font-mono">—</span>
                <div className={`w-full rounded-t h-24 flex items-end ${
                  theme === 'dark' ? 'bg-[#131315]' : 'bg-slate-100'
                }`}>
                  <div className="w-full bg-gray-400/30 rounded-t" style={{ height: '12%' }} />
                </div>
                <span className="text-[11px] text-gray-400 mt-1">F</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('attendance')}
              className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border ${
                theme === 'dark'
                  ? 'bg-[#2a2a2c] hover:bg-[#353437] border-transparent text-[#d4af37]'
                  : 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-950'
              }`}
            >
              <span className="material-symbols-outlined text-sm">touch_app</span>
              <span>Launch Period Roll Call</span>
            </button>
          </div>

          {/* Feedback & Inquiries Stream */}
          <div className={`rounded-2xl p-6 shadow-md border flex flex-col gap-4 ${
            theme === 'dark' ? 'bg-[#1c1b1d] border-[#2a2a2c]' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-inherit">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#d4af37] text-xl">forum</span>
                <h3 className={`font-display text-base font-bold tracking-tight ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}>
                  Feedback & Inquiries
                </h3>
              </div>
              <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-ping" />
            </div>

            <div className="flex flex-col gap-3 text-xs">
              {/* Inquiry 1: Julian Vance */}
              <div className={`p-3.5 rounded-xl flex flex-col gap-2 border ${
                theme === 'dark' ? 'bg-[#2a2a2c] border-transparent' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    Julian Vance
                  </span>
                  <span className={`text-[10px] font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                    42m ago
                  </span>
                </div>
                <p className={`text-xs leading-relaxed italic ${
                  theme === 'dark' ? 'text-gray-300' : 'text-slate-800'
                }`}>
                  “Question regarding rotational kinetic derivation in Problem Set 4: does torque damping factor into Problem 3b?”
                </p>
                {inquiryReplies['jv-inq'] ? (
                  <div className={`p-2 rounded-lg border-l-2 border-[#d4af37] text-[11px] font-medium ${
                    theme === 'dark' ? 'bg-black/40 text-emerald-400' : 'bg-emerald-50 text-emerald-950 border border-emerald-200'
                  }`}>
                    <strong>Replied:</strong> {inquiryReplies['jv-inq']}
                  </div>
                ) : openReplyBox === 'jv-inq' ? (
                  <div className="mt-2 flex flex-col gap-2">
                    <input
                      type="text"
                      placeholder="Type reply to Julian..."
                      id="reply-jv-input"
                      className={`px-3 py-1.5 text-xs rounded-lg focus:outline-none border ${
                        theme === 'dark' ? 'bg-black/40 border-gray-600 text-white' : 'bg-white border-slate-300 text-slate-900'
                      }`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSendReply('jv-inq', (e.target as HTMLInputElement).value);
                        }
                      }}
                    />
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setOpenReplyBox(null)} className="text-gray-400 hover:text-white text-[10px] font-semibold">
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          const el = document.getElementById('reply-jv-input') as HTMLInputElement;
                          if (el) handleSendReply('jv-inq', el.value || 'Assume zero friction unless otherwise noted in the torque vector.');
                        }}
                        className="px-3 py-1 rounded-lg bg-[#d4af37] text-[#3c2f00] font-bold text-xs"
                      >
                        Send Reply
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between pt-1 border-t border-inherit">
                    <span className={`font-bold text-[10px] uppercase ${
                      theme === 'dark' ? 'text-[#d4af37]' : 'text-amber-900'
                    }`}>
                      Scholar Inquiry
                    </span>
                    <button
                      onClick={() => setOpenReplyBox('jv-inq')}
                      className={`font-bold flex items-center gap-1 text-[11px] ${
                        theme === 'dark' ? 'text-white hover:text-[#d4af37]' : 'text-slate-900 hover:text-[#7b4e00]'
                      }`}
                    >
                      Draft Quick Response <span className="material-symbols-outlined text-sm">reply</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Inquiry 2: Eleanor Vance */}
              <div className={`p-3.5 rounded-xl flex flex-col gap-2 border ${
                theme === 'dark' ? 'bg-[#2a2a2c] border-transparent' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    Eleanor Vance (Parent)
                  </span>
                  <span className={`text-[10px] font-bold ${
                    theme === 'dark' ? 'text-[#d4af37]' : 'text-amber-900'
                  }`}>
                    Commendation
                  </span>
                </div>
                <p className={`text-xs leading-relaxed italic ${
                  theme === 'dark' ? 'text-gray-300' : 'text-slate-800'
                }`}>
                  “Thank you for providing Julian with extra mentorship on the astrophysics preprint. His engagement has soared.”
                </p>
                <div className="flex items-center justify-between pt-1 border-t border-inherit">
                  <span className="font-bold text-[10px] uppercase text-emerald-600 dark:text-emerald-400">
                    Parent Commendation
                  </span>
                  {acknowledgedNotes['ev-com'] ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                      <span className="material-symbols-outlined text-sm">check</span> Acknowledged
                    </span>
                  ) : (
                    <button
                      onClick={() => handleAcknowledge('ev-com')}
                      className={`font-bold flex items-center gap-1 text-[11px] ${
                        theme === 'dark' ? 'text-white hover:text-[#d4af37]' : 'text-slate-900 hover:text-[#7b4e00]'
                      }`}
                    >
                      Acknowledge Note <span className="material-symbols-outlined text-sm">favorite</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Curricular Bridges */}
          <div className={`rounded-2xl p-6 shadow-md border flex flex-col gap-4 ${
            theme === 'dark' ? 'bg-[#1c1b1d] border-[#2a2a2c]' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-inherit">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#d4af37] text-xl">sync_saved_locally</span>
                <h3 className={`font-display text-base font-bold tracking-tight ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}>
                  Curricular Bridges
                </h3>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                theme === 'dark' ? 'bg-[#d4af37]/20 text-[#d4af37]' : 'bg-amber-100 text-amber-900'
              }`}>
                Live
              </span>
            </div>

            <div className="flex flex-col gap-2.5 text-xs">
              <div className={`flex items-center justify-between p-2.5 rounded-xl border ${
                theme === 'dark' ? 'bg-[#2a2a2c] border-transparent' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    Aetheria Central Core LMS
                  </span>
                </div>
                <span className={`text-[10px] font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                  Synced 2m ago
                </span>
              </div>

              <div className={`flex items-center justify-between p-2.5 rounded-xl border ${
                theme === 'dark' ? 'bg-[#2a2a2c] border-transparent' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    Google Classroom Sync
                  </span>
                </div>
                <span className={`text-[10px] font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                  Active
                </span>
              </div>

              <div className={`flex items-center justify-between p-2.5 rounded-xl border ${
                theme === 'dark' ? 'bg-[#2a2a2c] border-transparent' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#d4af37]" />
                  <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    Dean Registrar Grade Vault
                  </span>
                </div>
                <button
                  onClick={() => alert('Encrypted bridge pinged. Ready for Term II final sync.')}
                  className={`text-xs font-bold hover:underline ${
                    theme === 'dark' ? 'text-[#d4af37]' : 'text-[#7b4e00]'
                  }`}
                >
                  Push Marks →
                </button>
              </div>
            </div>

            {/* Academic Moderation Preview Card */}
            <div className={`p-3.5 rounded-xl flex items-center gap-3.5 mt-1 border ${
              theme === 'dark' ? 'bg-[#131315] border-[#2a2a2c]' : 'bg-slate-100 border-slate-200'
            }`}>
              <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 text-center font-bold ${
                theme === 'dark' ? 'bg-[#2a2a2c]' : 'bg-white shadow-sm border border-slate-200'
              }`}>
                <span className={`text-[10px] uppercase font-bold ${theme === 'dark' ? 'text-[#d4af37]' : 'text-[#7b4e00]'}`}>
                  NOV
                </span>
                <span className={`text-base font-display font-extrabold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  04
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className={`font-bold text-xs truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  Midterm 2 Moderation
                </span>
                <span className={`text-[11px] font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                  Faculty Senate Review Hall
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
