import React, { useState, useRef } from 'react';
import { CurricularModule } from '../types';
import { CURRICULUM_LAB_IMG } from '../data/mockData';

interface CurriculumViewProps {
  theme: 'dark' | 'light';
  curriculum: CurricularModule[];
  onAddModule: (module: CurricularModule) => void;
  onNavigateToFeedback: () => void;
}

export const CurriculumView: React.FC<CurriculumViewProps> = ({
  theme,
  curriculum,
  onAddModule,
  onNavigateToFeedback,
}) => {
  const [title, setTitle] = useState('Unit 5: Angular Momentum & Keplerian Orbits');
  const [category, setCategory] = useState<'Worksheet [Mid]' | 'Problem Set' | 'Lab Protocol' | 'Lecture Notes & Stream' | 'Worksheet Packet'>('Worksheet [Mid]');
  const [deadline, setDeadline] = useState('Nov 02, 2026 • 11:59 PM');
  const [weight, setWeight] = useState('Major Problem Set (15% Weight)');
  const [resourceLink, setResourceLink] = useState('https://faculty.aetheria.edu/docs/phys11-pset5.pdf');
  const [attachedFile, setAttachedFile] = useState('phys11-kepler-orbitals-annotated.pdf');
  const [attachedFileSize, setAttachedFileSize] = useState('4.2 MB');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [fileUploadNotice, setFileUploadNotice] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Directly triggers OS file manager / file browser
  const handleOpenFileManager = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile(file.name);
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      const formattedSize = file.size > 1024 * 1024 ? `${sizeMb} MB` : `${Math.round(file.size / 1024)} KB`;
      setAttachedFileSize(formattedSize);
      
      // Auto-populate or update title if default
      if (title.startsWith('Unit 5') || !title) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setTitle(cleanName);
      }

      setFileUploadNotice(`Loaded from file manager: ${file.name} (${formattedSize})`);
      setTimeout(() => setFileUploadNotice(null), 4000);
    }
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    setIsPublishing(true);

    setTimeout(() => {
      setIsPublishing(false);
      setPublishSuccess(true);

      const newMod: CurricularModule = {
        id: `curr-${Date.now()}`,
        title,
        category,
        dueDate: deadline.toUpperCase(),
        description: 'New syllabus unit distributed to 31 scholars with auto-graded rubric checkpoints.',
        submissionsCount: 0,
        totalCount: 31,
        fileName: attachedFile,
        fileSize: attachedFileSize,
        statusTag: '0% Turn-in',
        engagementPercent: 0,
      };
      onAddModule(newMod);

      setTimeout(() => {
        setPublishSuccess(false);
      }, 2500);
    }, 1000);
  };

  return (
    <div className="w-full max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      
      {/* Hidden File Input for Native OS File Manager */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.doc,.xlsx,.xls,.pptx,.ppt,.zip,.csv,.txt"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Editorial Header Section */}
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-inherit">
        <div className="flex flex-col max-w-3xl">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse" />
            <span className={`text-[11px] font-mono uppercase tracking-widest font-bold ${
              theme === 'dark' ? 'text-[#ffe088]' : 'text-[#855800]'
            }`}>
              Academic Operations Core • CYCLE 2026.02
            </span>
          </div>
          <h1 className={`font-display text-3xl sm:text-4xl font-bold tracking-tight ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            Curriculum Distribution & Worksheets
          </h1>
          <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-[#d0c5af]' : 'text-slate-600'}`}>
            Manage syllabus worksheets, assign academic problem sets, publish lecture notes, and dispatch course documents directly to scholar terminal pads.
          </p>
        </div>

        {/* Cohort & Quick Telemetry */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <div className={`px-4 py-2 rounded-xl shadow-sm border flex items-center gap-3 ${
            theme === 'dark' ? 'bg-[#1c1b1d] border-[#2a2a2c]' : 'bg-[#ffffff] border-slate-200'
          }`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              theme === 'dark' ? 'bg-[#d4af37]/20 text-[#d4af37]' : 'bg-amber-100 text-amber-900'
            }`}>
              <span className="material-symbols-outlined text-lg">auto_stories</span>
            </div>
            <div className="flex flex-col">
              <span className={`text-[10px] uppercase font-bold tracking-wider ${
                theme === 'dark' ? 'text-gray-400' : 'text-slate-600'
              }`}>
                Active Cohort
              </span>
              <span className={`font-bold text-xs ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                AP Physics C: Mechanics (Sec 11-A)
              </span>
            </div>
          </div>

          <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 text-xs font-bold ${
            theme === 'dark' ? 'bg-[#1c1b1d] border-[#2a2a2c]' : 'bg-[#ffffff] border-slate-200'
          }`}>
            <span className="material-symbols-outlined text-[#d4af37] text-base">group</span>
            <span className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>31 Enrolled</span>
          </div>
        </div>
      </section>

      {/* Main Workspace Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Distribute Work + Active Materials (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          
          {/* Create & Distribute New Work Card */}
          <div className={`rounded-2xl p-6 shadow-xl border relative overflow-hidden ${
            theme === 'dark' ? 'bg-[#1c1b1d] border-[#2a2a2c]' : 'bg-[#ffffff] border-slate-200'
          }`}>
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#d4af37]" />

            <div className="flex items-center justify-between pb-4 mb-4 border-b border-inherit">
              <div className="flex flex-col">
                <span className={`font-display font-bold text-base ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  Distribute New Pedagogical Work
                </span>
                <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600 font-medium'}`}>
                  Syllabus modules synchronise directly to the Student Portal & Guardian App
                </span>
              </div>
              <span
                onClick={() => setTitle('Unit 6: Special Relativity & Minkowski Diagrams')}
                className={`material-symbols-outlined transition-colors cursor-pointer text-xl ${
                  theme === 'dark' ? 'text-gray-400 hover:text-[#d4af37]' : 'text-slate-500 hover:text-[#855800]'
                }`}
                title="Fill Template"
              >
                auto_awesome
              </span>
            </div>

            <form onSubmit={handlePublish} className="flex flex-col gap-4 text-xs">
              {/* Work Title */}
              <div className="flex flex-col gap-1">
                <label className={`font-bold uppercase tracking-wider text-[10px] ${
                  theme === 'dark' ? 'text-gray-400' : 'text-slate-700'
                }`}>
                  Module or Work Title
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl font-bold focus:outline-none transition-colors border ${
                      theme === 'dark'
                        ? 'bg-[#2a2a2c] border-[#353437] text-white focus:bg-[#353437]'
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white'
                    }`}
                    placeholder="e.g. Unit Problem Set or Lab Dossier"
                  />
                  <span className={`material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-slate-500'
                  }`}>
                    edit
                  </span>
                </div>
              </div>

              {/* Category + Distribution Target */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className={`font-bold uppercase tracking-wider text-[10px] ${
                    theme === 'dark' ? 'text-gray-400' : 'text-slate-700'
                  }`}>
                    Category Classification
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className={`w-full px-3.5 py-2.5 rounded-xl font-bold focus:outline-none cursor-pointer border ${
                      theme === 'dark'
                        ? 'bg-[#2a2a2c] border-[#353437] text-white'
                        : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="Worksheet [Mid]">Worksheet [Mid]</option>
                    <option value="Problem Set">Problem Set</option>
                    <option value="Lab Protocol">Lab Protocol & Practicum</option>
                    <option value="Lecture Notes & Stream">Lecture Notes & Stream URL</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className={`font-bold uppercase tracking-wider text-[10px] ${
                    theme === 'dark' ? 'text-gray-400' : 'text-slate-700'
                  }`}>
                    Distribution Target
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value="All 31 Students in 11-A"
                      className={`w-full px-3.5 py-2.5 rounded-xl font-bold cursor-not-allowed border ${
                        theme === 'dark'
                          ? 'bg-[#2a2a2c] border-[#353437] text-[#d4af37]'
                          : 'bg-slate-50 border-slate-300 text-[#855800]'
                      }`}
                    />
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#d4af37] text-sm">
                      verified
                    </span>
                  </div>
                </div>
              </div>

              {/* Deadline + Weighting */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className={`font-bold uppercase tracking-wider text-[10px] ${
                    theme === 'dark' ? 'text-gray-400' : 'text-slate-700'
                  }`}>
                    Submission Deadline
                  </label>
                  <input
                    type="text"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl font-bold focus:outline-none border ${
                      theme === 'dark'
                        ? 'bg-[#2a2a2c] border-[#353437] text-white'
                        : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className={`font-bold uppercase tracking-wider text-[10px] ${
                    theme === 'dark' ? 'text-gray-400' : 'text-slate-700'
                  }`}>
                    Gradebook Weighting
                  </label>
                  <select
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl font-bold focus:outline-none border ${
                      theme === 'dark'
                        ? 'bg-[#2a2a2c] border-[#353437] text-white'
                        : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  >
                    <option>Major Problem Set (15% Weight)</option>
                    <option>Formative Check (5% Weight)</option>
                    <option>Laboratory Rubric (20% Weight)</option>
                    <option>Ungraded Reference Only</option>
                  </select>
                </div>
              </div>

              {/* URL & File Manager Upload Section */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className={`font-bold uppercase tracking-wider text-[10px] ${
                    theme === 'dark' ? 'text-gray-400' : 'text-slate-700'
                  }`}>
                    Curricular Resource URL or Document Upload
                  </label>
                  
                  {/* DIRECT BUTTON TO FILE MANAGER */}
                  <button
                    type="button"
                    onClick={handleOpenFileManager}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold text-[#d4af37] bg-[#d4af37]/15 hover:bg-[#d4af37]/25 transition-all cursor-pointer border border-[#d4af37]/30"
                  >
                    <span className="material-symbols-outlined text-sm">folder_open</span>
                    <span>Browse File Manager</span>
                  </button>
                </div>

                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#d4af37] text-base">link</span>
                  <input
                    type="url"
                    value={resourceLink}
                    onChange={(e) => setResourceLink(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 rounded-xl font-mono text-[11px] font-semibold focus:outline-none border ${
                      theme === 'dark'
                        ? 'bg-[#2a2a2c] border-[#353437] text-white'
                        : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                    placeholder="https://..."
                  />
                </div>

                {/* Upload Dropzone: Click opens file manager directly */}
                <div
                  onClick={handleOpenFileManager}
                  className={`p-4 rounded-xl border-2 border-dashed flex flex-col sm:flex-row items-center justify-between gap-3 cursor-pointer group transition-all ${
                    theme === 'dark'
                      ? 'bg-[#201f22] border-[#353437] hover:border-[#d4af37] hover:bg-[#2a2a2c]'
                      : 'bg-slate-50 border-slate-300 hover:border-amber-400 hover:bg-white'
                  }`}
                  title="Click to open file manager directly"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                      theme === 'dark' ? 'bg-[#d4af37]/20 text-[#d4af37]' : 'bg-amber-100 text-amber-900'
                    }`}>
                      <span className="material-symbols-outlined text-2xl">drive_folder_upload</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold block ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                          {attachedFile}
                        </span>
                        <span className="material-symbols-outlined text-sm text-[#d4af37]">check_circle</span>
                      </div>
                      <span className={`text-[10px] ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600 font-medium'}`}>
                        {attachedFileSize} • Click to select a different file from your device
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenFileManager();
                      }}
                      className="px-3 py-1.5 bg-[#d4af37] text-[#3c2f00] rounded-lg font-bold text-xs hover:bg-[#ffe088] shadow flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-xs">upload_file</span>
                      <span>Upload File</span>
                    </button>
                  </div>
                </div>

                {fileUploadNotice && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold animate-in fade-in duration-200">
                    <span className="material-symbols-outlined text-sm">done</span>
                    <span>{fileUploadNotice}</span>
                  </div>
                )}
              </div>

              {/* CTA Action */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 mt-1 border-t border-inherit">
                <div className={`flex items-center gap-1.5 text-xs font-semibold ${
                  theme === 'dark' ? 'text-gray-400' : 'text-slate-600'
                }`}>
                  <span className="material-symbols-outlined text-base text-[#d4af37]">schedule_send</span>
                  <span>Pushes instantaneous alert to 31 active student pads</span>
                </div>

                <button
                  type="submit"
                  disabled={isPublishing}
                  className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
                    publishSuccess
                      ? 'bg-emerald-600 text-white'
                      : theme === 'dark'
                        ? 'bg-[#d4af37] hover:bg-[#ffe088] text-[#3c2f00]'
                        : 'bg-[#996515] hover:bg-[#7b4e00] text-white'
                  }`}
                >
                  {isPublishing ? (
                    <>
                      <span className="material-symbols-outlined text-base animate-spin">sync</span>
                      <span>Distributing to 31 Pads...</span>
                    </>
                  ) : publishSuccess ? (
                    <>
                      <span className="material-symbols-outlined text-base">check_circle</span>
                      <span>Distributed to Section 11-A</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-base">send</span>
                      <span>Publish to Student Portal</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Active Materials & Worksheets List */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className={`font-display font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Active Materials & Worksheets
              </h3>
              <span className={`text-xs font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                {curriculum.length} Modules Distributed This Term
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {curriculum.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl shadow-md border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all group ${
                    theme === 'dark'
                      ? 'bg-[#1c1b1d] border-[#2a2a2c] hover:bg-[#201f22]'
                      : 'bg-[#ffffff] border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start gap-4 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      theme === 'dark' ? 'bg-[#2a2a2c] text-[#d4af37]' : 'bg-amber-100 text-amber-900'
                    }`}>
                      <span className="material-symbols-outlined text-xl">
                        {item.category.includes('Stream') ? 'play_circle' : 'description'}
                      </span>
                    </div>

                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider font-mono ${
                          theme === 'dark' ? 'bg-[#d4af37]/20 text-[#d4af37]' : 'bg-amber-100 text-amber-900'
                        }`}>
                          {item.category}
                        </span>
                        <span className={`text-[10px] font-mono font-bold ${
                          theme === 'dark' ? 'text-gray-400' : 'text-slate-600'
                        }`}>
                          {item.dueDate}
                        </span>
                      </div>
                      <span className={`font-bold text-sm transition-colors mt-1 truncate ${
                        theme === 'dark'
                          ? 'text-white group-hover:text-[#d4af37]'
                          : 'text-slate-900 group-hover:text-[#855800]'
                      }`}>
                        {item.title}
                      </span>
                      <p className={`text-xs mt-0.5 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600 font-medium'}`}>
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col items-end justify-between md:justify-center gap-1 shrink-0 pl-14 md:pl-0">
                    <div className="flex items-center gap-1.5 text-xs font-mono">
                      <span className={`font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>SUBMISSIONS:</span>
                      <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        {item.submissionsCount}/{item.totalCount}
                      </span>
                    </div>
                    <div className={`w-32 h-1.5 rounded-full overflow-hidden ${
                      theme === 'dark' ? 'bg-gray-700/40' : 'bg-slate-200'
                    }`}>
                      <div className="bg-[#d4af37] h-full rounded-full" style={{ width: `${item.engagementPercent || 0}%` }} />
                    </div>
                    <span className={`text-[10px] font-mono font-bold ${
                      theme === 'dark' ? 'text-[#d4af37]' : 'text-[#855800]'
                    }`}>
                      {item.statusTag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Material Preview Card (Photo Rich) */}
          <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center gap-4 overflow-hidden ${
            theme === 'dark' ? 'bg-[#1c1b1d] border-[#2a2a2c]' : 'bg-[#ffffff] border-slate-200'
          }`}>
            <div className="w-full sm:w-48 h-32 rounded-xl bg-gray-900 overflow-hidden shrink-0 relative">
              <img
                src={CURRICULUM_LAB_IMG}
                alt="Curriculum Schematic"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
              <span className="absolute bottom-2 left-2 text-[11px] font-mono uppercase text-[#d4af37] font-bold drop-shadow">
                Curriculum Lab
              </span>
            </div>

            <div className="flex flex-col gap-1 text-xs">
              <span className={`font-bold text-sm font-display ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                Curricular Standard Alignment: IB & AP CollegeBoard C-11
              </span>
              <p className={`leading-relaxed text-[11px] ${
                theme === 'dark' ? 'text-gray-400' : 'text-slate-600 font-medium'
              }`}>
                All problem sets auto-calibrate with the institutional markbook rubric. Uploaded assignments are cryptographically signed with faculty timestamps.
              </p>
              <div className="flex items-center gap-3 mt-1 text-[11px]">
                <button
                  onClick={() => alert('Downloading official Master Syllabus Key v4.19.')}
                  className={`font-bold flex items-center gap-1 hover:underline ${
                    theme === 'dark' ? 'text-[#d4af37]' : 'text-[#855800]'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">download</span>
                  Download Master Syllabus Key
                </button>
                <span>•</span>
                <span className={`font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>Version 4.19</span>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Quick Bridge to Scholar Feedback (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className={`rounded-2xl p-6 shadow-xl border flex flex-col justify-between gap-6 ${
            theme === 'dark' ? 'bg-[#1c1b1d] border-[#2a2a2c]' : 'bg-[#ffffff] border-slate-200'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-inherit">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#d4af37] text-xl">reviews</span>
                <h3 className={`font-display font-bold text-base ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  Direct Scholar Feedback Hub
                </h3>
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                theme === 'dark' ? 'bg-[#d4af37]/20 text-[#d4af37]' : 'bg-amber-100 text-amber-900'
              }`}>
                Top Priority
              </span>
            </div>

            <p className={`text-xs leading-relaxed ${
              theme === 'dark' ? 'text-gray-300' : 'text-slate-700 font-medium'
            }`}>
              Curricular distribution is integrated directly with scholar feedback logs. When scholars submit laboratory reports or homework sets, you can immediately transmit commended feedback or schedule office hours.
            </p>

            <div className={`p-4 rounded-xl border flex items-center justify-between ${
              theme === 'dark' ? 'bg-black/30 border-gray-700/30' : 'bg-slate-50 border-slate-200'
            }`}>
              <div>
                <span className={`font-bold text-xs block ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  48 Active Feedback Dossiers
                </span>
                <span className={`text-[10px] font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                  24 parent-acknowledged read receipts
                </span>
              </div>
              <button
                onClick={onNavigateToFeedback}
                className="px-4 py-2 rounded-xl bg-[#d4af37] text-[#3c2f00] font-bold text-xs hover:bg-[#ffe088] transition-all shadow-md flex items-center gap-1"
              >
                <span>Open Feedback Composer</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Institutional Governance Banner */}
          <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs ${
            theme === 'dark' ? 'bg-[#201f22] border-[#2a2a2c]' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                theme === 'dark' ? 'bg-[#d4af37]/20 text-[#d4af37]' : 'bg-amber-100 text-amber-900'
              }`}>
                <span className="material-symbols-outlined text-base">verified_user</span>
              </div>
              <div>
                <span className={`font-bold block ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  Institutional Governance Sync
                </span>
                <span className={`text-[10px] font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                  All notes automatically logged in FERPA & GDPR certified vault.
                </span>
              </div>
            </div>
            <span className="material-symbols-outlined text-slate-500 text-sm">lock</span>
          </div>

        </div>

      </div>

      {/* Bottom Telemetry & Quick Action Bar */}
      <section className={`p-4 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4 text-xs ${
        theme === 'dark' ? 'bg-[#1c1b1d] border-[#2a2a2c]' : 'bg-[#ffffff] border-slate-200'
      }`}>
        <div className={`flex items-center gap-4 flex-wrap ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              LMS Sync Status: Live & Encrypted
            </span>
          </div>
          <span className="hidden md:inline">•</span>
          <div className="flex items-center gap-1.5 font-medium">
            <span className="material-symbols-outlined text-sm">sync</span>
            <span>Last sync: 2 minutes ago</span>
          </div>
          <span className="hidden md:inline">•</span>
          <div className="flex items-center gap-1.5 font-medium">
            <span className="material-symbols-outlined text-sm">cloud_done</span>
            <span>Storage: 4.8 GB of 50 GB used</span>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button
            onClick={() => alert('Printing confidential cohort dossier for Section 11-A.')}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 border transition-colors ${
              theme === 'dark'
                ? 'bg-[#2a2a2c] hover:bg-[#353437] border-[#353437] text-white'
                : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-sm">print</span>
            <span>Print Cohort Dossier</span>
          </button>
          <button
            onClick={() => alert('Exporting Term II Academic Report.')}
            className="px-4 py-2 rounded-xl bg-[#d4af37] text-[#3c2f00] font-bold hover:bg-[#ffe088] transition-colors shadow flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">history_edu</span>
            <span>Export Term Report</span>
          </button>
        </div>
      </section>

    </div>
  );
};
