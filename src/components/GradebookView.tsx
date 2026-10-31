import React, { useState } from 'react';
import { Scholar } from '../types';

interface GradebookViewProps {
  theme: 'dark' | 'light';
  scholars: Scholar[];
  onOpenBellCurve: () => void;
  onUpdateUnit4Score: (scholarId: string, score: number) => void;
  onApplyCurve: (offset: number) => void;
  selectedGrade: string;
  onChangeGrade: (grade: string) => void;
  selectedSubject: string;
  onChangeSubject: (subject: string) => void;
  selectedSection: string;
  onChangeSection: (section: string) => void;
  isLoading?: boolean;
  onReload?: () => void;
}

export const GradebookView: React.FC<GradebookViewProps> = ({
  theme,
  scholars,
  onOpenBellCurve,
  onUpdateUnit4Score,
  onApplyCurve,
  selectedGrade,
  onChangeGrade,
  selectedSubject,
  onChangeSubject,
  selectedSection,
  onChangeSection,
  isLoading = false,
  onReload,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [curvedApplied, setCurvedApplied] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedSuccess, setPublishedSuccess] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState('Term 2 - Fall 2026');
  const [selectedAssessment, setSelectedAssessment] = useState('Unit 4: Rotational Dynamics Exam');
  const [isExpanded, setIsExpanded] = useState(false);
  const [, setEditingRemarks] = useState<{ [id: string]: string }>({});

  // Calculate dynamic weighted grade
  const calculateTotalGrade = (s: Scholar): { percent: number; letter: string } => {
    const raw = (
      s.grades.quiz1 * 0.10 +
      s.grades.pset3 * 0.15 +
      s.grades.labPrac2 * 0.25 +
      s.grades.midterm * 0.25 +
      s.grades.unit4Exam * 0.25
    );
    const percent = Math.min(100, Math.round(raw * 10) / 10);
    let letter = 'F';
    if (percent >= 97) letter = 'A+';
    else if (percent >= 93) letter = 'A';
    else if (percent >= 90) letter = 'A-';
    else if (percent >= 87) letter = 'B+';
    else if (percent >= 83) letter = 'B';
    else if (percent >= 80) letter = 'B-';
    else if (percent >= 75) letter = 'C+';
    else if (percent >= 70) letter = 'C';
    else if (percent >= 60) letter = 'D';

    return { percent, letter };
  };

  const handleApplyTwoPtCurve = () => {
    onApplyCurve(2);
    setCurvedApplied(true);
  };

  const handleResetCurve = () => {
    onApplyCurve(-2);
    setCurvedApplied(false);
  };

  const handlePublishMarks = () => {
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      setPublishedSuccess(true);
      setTimeout(() => setPublishedSuccess(false), 2500);
    }, 1000);
  };

  const filteredScholars = scholars.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6 transition-all ${
      isExpanded ? 'max-w-full' : 'max-w-360'
    }`}>
      
      {/* Header Section */}
      <section className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
        <div className="flex flex-col gap-1 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-[#d4af37]">verified_user</span>
            <span className={`text-[11px] font-semibold uppercase tracking-widest font-mono ${
              theme === 'dark' ? 'text-[#ffe088]' : 'text-[#855800]'
            }`}>
              FACULTY EVALUATION SUITE • ACADEMIC LEDGER
            </span>
          </div>
          <h1 className={`font-display text-3xl sm:text-4xl font-bold tracking-tight ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            Scholastic Marks & Gradebook Matrix
          </h1>
          <p className={`text-sm ${theme === 'dark' ? 'text-[#d0c5af]' : 'text-slate-600'}`}>
            Continuous assessment ledger, weighted examinations, and score submission for <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-950'}`}>{selectedGrade} • {selectedSubject} • {selectedSection}</span>.
          </p>
        </div>

        {/* Action Buttons Group */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {onReload && (
            <button
              onClick={onReload}
              disabled={isLoading}
              className={`p-2 rounded-xl border text-xs font-bold transition-all shadow-sm ${
                theme === 'dark'
                  ? 'bg-[#2a2a2c] border-[#353437] text-gray-300 hover:text-white'
                  : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100'
              }`}
              title="Reload Marks"
            >
              <span className={`material-symbols-outlined text-base ${isLoading ? 'animate-spin text-[#d4af37]' : ''}`}>
                refresh
              </span>
            </button>
          )}

          <button
            onClick={onOpenBellCurve}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border shadow-sm ${
              theme === 'dark'
                ? 'bg-[#2a2a2c] hover:bg-[#353437] border-[#353437] text-white'
                : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-base text-[#d4af37]">analytics</span>
            <span>Bell Curve</span>
          </button>

          <button
            disabled={isPublishing}
            onClick={handlePublishMarks}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg ${
              publishedSuccess
                ? 'bg-emerald-600 text-white'
                : theme === 'dark'
                  ? 'bg-[#d4af37] hover:bg-[#ffe088] text-[#3c2f00]'
                  : 'bg-[#996515] hover:bg-[#7b4e00] text-white'
            }`}
          >
            {isPublishing ? (
              <>
                <span className="material-symbols-outlined text-base animate-spin">sync</span>
                <span>Publishing...</span>
              </>
            ) : publishedSuccess ? (
              <>
                <span className="material-symbols-outlined text-base">verified</span>
                <span>Published</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-base">send_and_archive</span>
                <span>Publish Marks</span>
              </>
            )}
          </button>
        </div>
      </section>

      {/* Assessment Switcher Matrix Strip with 3 Dropdowns (Grade, Subject, Section) + Term + Assessment */}
      <section className={`p-5 rounded-2xl shadow-sm flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4 border ${
        theme === 'dark' ? 'bg-[#1c1b1d] border-[#2a2a2c]' : 'bg-[#ffffff] border-slate-200'
      }`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 flex-1">
          {/* 1. Grade Dropdown */}
          <div className="flex flex-col gap-1">
            <label className={`text-[10px] uppercase font-bold tracking-wider ${
              theme === 'dark' ? 'text-gray-400' : 'text-slate-600'
            }`}>
              Select Grade
            </label>
            <div className="relative">
              <select
                value={selectedGrade}
                onChange={(e) => onChangeGrade(e.target.value)}
                className={`w-full appearance-none px-3.5 py-2 pr-8 rounded-lg font-bold text-xs focus:outline-none cursor-pointer border transition-colors ${
                  theme === 'dark'
                    ? 'bg-[#2a2a2c] border-[#353437] text-white'
                    : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              >
                <option value="Grade 11">Grade 11</option>
                <option value="Grade 12">Grade 12</option>
                <option value="Grade 10">Grade 10</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-base opacity-60">expand_more</span>
            </div>
          </div>

          {/* 2. Subject Dropdown */}
          <div className="flex flex-col gap-1">
            <label className={`text-[10px] uppercase font-bold tracking-wider ${
              theme === 'dark' ? 'text-gray-400' : 'text-slate-600'
            }`}>
              Select Subject
            </label>
            <div className="relative">
              <select
                value={selectedSubject}
                onChange={(e) => onChangeSubject(e.target.value)}
                className={`w-full appearance-none px-3.5 py-2 pr-8 rounded-lg font-bold text-xs focus:outline-none cursor-pointer border transition-colors ${
                  theme === 'dark'
                    ? 'bg-[#2a2a2c] border-[#353437] text-white'
                    : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              >
                <option value="AP Physics C">AP Physics C</option>
                <option value="AP Calculus BC">AP Calculus BC</option>
                <option value="Quantum Mechanics">Quantum Mechanics</option>
                <option value="Classical Mechanics">Classical Mechanics</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-base opacity-60">expand_more</span>
            </div>
          </div>

          {/* 3. Section Dropdown */}
          <div className="flex flex-col gap-1">
            <label className={`text-[10px] uppercase font-bold tracking-wider ${
              theme === 'dark' ? 'text-gray-400' : 'text-slate-600'
            }`}>
              Select Section
            </label>
            <div className="relative">
              <select
                value={selectedSection}
                onChange={(e) => onChangeSection(e.target.value)}
                className={`w-full appearance-none px-3.5 py-2 pr-8 rounded-lg font-bold text-xs focus:outline-none cursor-pointer border transition-colors ${
                  theme === 'dark'
                    ? 'bg-[#2a2a2c] border-[#353437] text-white'
                    : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              >
                <option value="Section A">Section A</option>
                <option value="Section B">Section B</option>
                <option value="Section C">Section C</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-base opacity-60">expand_more</span>
            </div>
          </div>

          {/* 4. Academic Term */}
          <div className="flex flex-col gap-1">
            <label className={`text-[10px] uppercase font-bold tracking-wider ${
              theme === 'dark' ? 'text-gray-400' : 'text-slate-600'
            }`}>
              Evaluation Term
            </label>
            <div className="relative">
              <select
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
                className={`w-full appearance-none px-3.5 py-2 pr-8 rounded-lg font-bold text-xs focus:outline-none cursor-pointer border transition-colors ${
                  theme === 'dark'
                    ? 'bg-[#2a2a2c] border-[#353437] text-white'
                    : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              >
                <option>Term 2 - Fall 2026</option>
                <option>Term 1 - Fall 2026</option>
                <option>Mid-Year Audit</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-base opacity-60">expand_more</span>
            </div>
          </div>

          {/* 5. Target Assessment Scope */}
          <div className="flex flex-col gap-1">
            <label className={`text-[10px] uppercase font-bold tracking-wider ${
              theme === 'dark' ? 'text-gray-400' : 'text-slate-600'
            }`}>
              Assessment Target
            </label>
            <div className="relative">
              <select
                value={selectedAssessment}
                onChange={(e) => setSelectedAssessment(e.target.value)}
                className={`w-full appearance-none px-3.5 py-2 pr-8 rounded-lg font-bold text-xs focus:outline-none cursor-pointer border transition-colors ${
                  theme === 'dark'
                    ? 'bg-[#2a2a2c] border-[#353437] text-white'
                    : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              >
                <option>Unit 4: Rotational Dynamics Exam</option>
                <option>Lab Practical 2: Angular Momentum</option>
                <option>Midterm Exam: Classical Mechanics</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-base opacity-60">expand_more</span>
            </div>
          </div>
        </div>

        {/* Specs Badges */}
        <div className="flex items-center gap-2 pt-2 xl:pt-0 shrink-0">
          <div className={`flex flex-col px-3 py-1.5 rounded-xl border ${
            theme === 'dark' ? 'bg-[#201f22] border-[#2a2a2c]' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className={`text-[9px] uppercase font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>Weight</span>
            <span className={`font-bold text-xs ${theme === 'dark' ? 'text-[#d4af37]' : 'text-[#855800]'}`}>25% Overall</span>
          </div>

          <div className={`flex flex-col px-3 py-1.5 rounded-xl border ${
            theme === 'dark' ? 'bg-[#201f22] border-[#2a2a2c]' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className={`text-[9px] uppercase font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>Status</span>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Live</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Gradebook Matrix */}
      <section className={`rounded-2xl shadow-xl overflow-hidden flex flex-col border ${
        theme === 'dark' ? 'bg-[#1c1b1d] border-[#2a2a2c]' : 'bg-[#ffffff] border-slate-200'
      }`}>
        
        {/* Matrix Subhead & Filter Controls */}
        <div className={`p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b ${
          theme === 'dark' ? 'bg-[#201f22] border-[#2a2a2c]' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#d4af37] text-xl">table_chart_view</span>
            <div className="flex flex-col">
              <span className={`font-display font-bold text-base ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                {selectedGrade} · {selectedSubject} Marks Ledger ({selectedSection})
              </span>
              <span className={`text-[11px] ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600 font-medium'}`}>
                Unit 4 input column recalculates weighted grades and synchronizes live.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <span className={`material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-slate-500'
              }`}>
                search
              </span>
              <input
                type="text"
                placeholder="Filter student or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`text-xs pl-8 pr-3 py-1.5 rounded-lg focus:outline-none w-48 sm:w-60 transition-colors border ${
                  theme === 'dark'
                    ? 'bg-[#2a2a2c] border-[#353437] text-white focus:bg-[#353437]'
                    : 'bg-white border-slate-300 text-slate-900 focus:bg-slate-50'
                }`}
              />
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors border ${
                theme === 'dark'
                  ? 'bg-[#2a2a2c] hover:bg-[#353437] border-[#353437] text-white'
                  : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-sm">{isExpanded ? 'close_fullscreen' : 'fullscreen'}</span>
              <span>{isExpanded ? 'Compact' : 'Expand'}</span>
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto w-full">
          {isLoading ? (
            <div className="p-12 flex flex-col items-center justify-center gap-3">
              <span className="material-symbols-outlined text-3xl text-[#d4af37] animate-spin">sync</span>
              <span className={`text-xs font-bold ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
                Loading marks and assessment matrix...
              </span>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-275 text-xs">
              <thead>
                <tr className={`text-[10px] font-bold uppercase tracking-wider ${
                  theme === 'dark' ? 'bg-[#2a2a2c]/80 text-gray-400' : 'bg-slate-100 text-slate-700'
                }`}>
                  <th className="py-3 px-4 font-bold">Scholar Reference</th>
                  <th className="py-3 px-3 text-center">Quiz 1 <br/><span className="opacity-75 font-normal">10%</span></th>
                  <th className="py-3 px-3 text-center">P-Set 3 <br/><span className="opacity-75 font-normal">15%</span></th>
                  <th className="py-3 px-3 text-center">Lab Prac 2 <br/><span className="opacity-75 font-normal">25%</span></th>
                  <th className="py-3 px-3 text-center">Midterm <br/><span className="opacity-75 font-normal">25%</span></th>
                  <th className="py-3 px-4 text-center bg-[#d4af37]/20 font-bold text-[#d4af37]">
                    Unit 4 Exam <br/><span className="font-normal text-[10px]">25% (Active Input)</span>
                  </th>
                  <th className={`py-3 px-3 text-center font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    Total Grade
                  </th>
                  <th className="py-3 px-3 text-center font-bold">Status</th>
                  <th className="py-3 px-4 font-bold">Faculty Remarks</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-700/30' : 'divide-slate-200'}`}>
                {filteredScholars.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-gray-400">
                      No scholars found in this cohort.
                    </td>
                  </tr>
                ) : (
                  filteredScholars.map((scholar) => {
                    const total = calculateTotalGrade(scholar);
                    return (
                      <tr
                        key={scholar.id}
                        className={`transition-colors group ${
                          theme === 'dark' ? 'hover:bg-gray-500/10' : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={scholar.avatar}
                              alt={scholar.name}
                              className="w-9 h-9 rounded-full object-cover ring-1 ring-gray-600/40 shrink-0"
                            />
                            <div className="flex flex-col">
                              <span className={`font-bold text-sm transition-colors ${
                                theme === 'dark'
                                  ? 'text-white group-hover:text-[#d4af37]'
                                  : 'text-slate-900 group-hover:text-[#855800]'
                              }`}>
                                {scholar.name}
                              </span>
                              <span className={`font-mono text-[10px] tracking-wider font-semibold ${
                                theme === 'dark' ? 'text-gray-400' : 'text-slate-600'
                              }`}>
                                {scholar.rollNumber}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className={`py-3 px-3 text-center font-mono font-bold ${
                          theme === 'dark' ? 'text-gray-200' : 'text-slate-800'
                        }`}>
                          {scholar.grades.quiz1} <span className="text-[10px] opacity-60">/100</span>
                        </td>
                        <td className={`py-3 px-3 text-center font-mono font-bold ${
                          theme === 'dark' ? 'text-gray-200' : 'text-slate-800'
                        }`}>
                          {scholar.grades.pset3} <span className="text-[10px] opacity-60">/100</span>
                        </td>
                        <td className={`py-3 px-3 text-center font-mono font-bold ${
                          theme === 'dark' ? 'text-gray-200' : 'text-slate-800'
                        }`}>
                          {scholar.grades.labPrac2} <span className="text-[10px] opacity-60">/100</span>
                        </td>
                        <td className={`py-3 px-3 text-center font-mono font-bold ${
                          theme === 'dark' ? 'text-gray-200' : 'text-slate-800'
                        }`}>
                          {scholar.grades.midterm} <span className="text-[10px] opacity-60">/100</span>
                        </td>

                        {/* Active Input Field */}
                        <td className="py-3 px-4 text-center bg-[#d4af37]/10">
                          <div className="inline-flex items-center justify-center">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={scholar.grades.unit4Exam}
                              onChange={(e) => onUpdateUnit4Score(scholar.id, Number(e.target.value))}
                              className={`w-20 text-center font-display font-bold text-sm py-1.5 px-2 rounded-lg shadow-sm border border-[#d4af37]/60 focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition-all ${
                                theme === 'dark' ? 'bg-[#2a2a2c] text-[#f2ca50]' : 'bg-white text-[#855800]'
                              }`}
                            />
                          </div>
                        </td>

                        {/* Dynamic Calculated Total */}
                        <td className={`py-3 px-3 text-center font-display font-bold text-sm ${
                          theme === 'dark' ? 'text-[#d4af37]' : 'text-[#855800]'
                        }`}>
                          {total.percent}%
                        </td>

                        {/* Tier */}
                        <td className="py-3 px-3 text-center">
                          <span className={`font-mono font-bold text-xs ${
                            total.letter.startsWith('A')
                              ? theme === 'dark' ? 'text-[#d4af37]' : 'text-[#855800]'
                              : theme === 'dark' ? 'text-gray-300' : 'text-slate-700'
                          }`}>
                            {total.letter}
                          </span>
                        </td>

                        {/* Faculty Remarks */}
                        <td className="py-3 px-4 max-w-xs">
                          <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-sm text-[#d4af37] shrink-0">edit_note</span>
                            <input
                              type="text"
                              defaultValue={scholar.remarks}
                              onChange={(e) => setEditingRemarks(prev => ({ ...prev, [scholar.id]: e.target.value }))}
                              className={`w-full px-2 py-1 rounded text-xs focus:outline-none truncate border transition-colors ${
                                theme === 'dark'
                                  ? 'bg-[#2a2a2c]/60 border-transparent text-gray-200 focus:border-[#d4af37] focus:bg-[#2a2a2c]'
                                  : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-[#d4af37] focus:bg-white'
                              }`}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })
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
          <span className="font-semibold">
            Showing {filteredScholars.length} scholars in {selectedGrade} • {selectedSubject} ({selectedSection})
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleApplyTwoPtCurve}
              className={`px-3 py-1 rounded font-bold border transition-colors ${
                curvedApplied
                  ? 'bg-[#d4af37] text-[#3c2f00]'
                  : theme === 'dark'
                    ? 'bg-[#2a2a2c] hover:bg-[#353437] border-[#353437] text-white'
                    : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-900'
              }`}
            >
              {curvedApplied ? 'Curve Active (+2 Pts)' : '+2 Pts Curve'}
            </button>
            {curvedApplied && (
              <button
                onClick={handleResetCurve}
                className="px-2 py-1 text-xs text-red-500 hover:underline font-bold"
              >
                Reset
              </button>
            )}
          </div>
        </div>

      </section>

    </div>
  );
};
