import React, { useState } from 'react';
import { Scholar, FeedbackItem } from '../types';

interface FeedbackViewProps {
  theme: 'dark' | 'light';
  scholars: Scholar[];
  feedbackList: FeedbackItem[];
  onAddFeedback: (feedback: FeedbackItem) => void;
}

export const FeedbackView: React.FC<FeedbackViewProps> = ({
  theme,
  scholars,
  feedbackList,
  onAddFeedback,
}) => {
  const [selectedScholarId, setSelectedScholarId] = useState(scholars[0]?.id || '1');
  const [typology, setTypology] = useState<'commendation' | 'conceptual' | 'intervention'>('commendation');
  const [noteText, setNoteText] = useState("Julian demonstrated extraordinary polymathic grasp during today's gyroscope experiment. Recommended for Aetheria Physics Olympiad qualifiers.");
  const [visibleStudent, setVisibleStudent] = useState(true);
  const [pushGuardian, setPushGuardian] = useState(true);
  const [archiveDean, setArchiveDean] = useState(true);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [transmitSuccess, setTransmitSuccess] = useState(false);

  const selectedScholar = scholars.find(s => s.id === selectedScholarId) || scholars[0];

  const handleTemplate = (type: string) => {
    if (type === 'olympiad') {
      setNoteText("Julian demonstrated extraordinary polymathic grasp during today's gyroscope experiment. Recommended for Aetheria Physics Olympiad qualifiers.");
      setTypology('commendation');
    } else if (type === 'office_hours') {
      setNoteText(`Encouraged review of harmonic oscillator derivations post-absence. Recommended scheduling Thursday faculty office hours in Kepler Suite 12B.`);
      setTypology('conceptual');
    } else if (type === 'lab_mastery') {
      setNoteText(`Exceptional error mitigation strategy formulated during multi-body dynamics lab practicum. Analytical precision is exemplary.`);
      setTypology('commendation');
    }
  };

  const handleTransmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText) return;

    setIsTransmitting(true);
    setTimeout(() => {
      setIsTransmitting(false);
      setTransmitSuccess(true);

      const newFb: FeedbackItem = {
        id: `fb-${Date.now()}`,
        scholarId: selectedScholar.id,
        scholarName: selectedScholar.name,
        scholarAvatar: selectedScholar.avatar,
        cohort: '11-A',
        timestamp: 'Just now • Period 2',
        typology,
        note: noteText,
        channels: {
          studentPortal: visibleStudent,
          guardianSms: pushGuardian,
          deanDossier: archiveDean,
        },
        readReceipt: 'Transmitted to Scholar Terminal',
        deliveryStatus: pushGuardian ? 'SMS Pushed' : 'Terminal Synced',
      };

      onAddFeedback(newFb);

      setTimeout(() => {
        setTransmitSuccess(false);
      }, 2500);
    }, 900);
  };

  return (
    <div className="w-full max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      
      {/* Editorial Header Section */}
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-inherit">
        <div className="flex flex-col max-w-3xl">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse" />
            <span className={`text-[11px] font-mono uppercase tracking-widest font-bold ${
              theme === 'dark' ? 'text-[#ffe088]' : 'text-[#855800]'
            }`}>
              COMMENDATION & ADVISING REGISTRY • FERPA VALIDATED
            </span>
          </div>
          <h1 className={`font-display text-3xl sm:text-4xl font-bold tracking-tight ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            Scholar Feedback & Advising Dossier
          </h1>
          <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-[#d0c5af]' : 'text-slate-600'}`}>
            Dispatch tailored pedagogical commendations, conceptual guidance notes, or pastoral interventions with verified guardian read receipts.
          </p>
        </div>

        {/* Quick Stats */}
        <div className={`px-4 py-2 rounded-xl border flex items-center gap-3 shrink-0 shadow-sm ${
          theme === 'dark' ? 'bg-[#1c1b1d] border-[#2a2a2c]' : 'bg-[#ffffff] border-slate-200'
        }`}>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            theme === 'dark' ? 'bg-[#d4af37]/20 text-[#d4af37]' : 'bg-amber-100 text-amber-900'
          }`}>
            <span className="material-symbols-outlined text-lg">rate_review</span>
          </div>
          <div className="flex flex-col">
            <span className={`text-[10px] uppercase font-bold tracking-wider ${
              theme === 'dark' ? 'text-gray-400' : 'text-slate-600'
            }`}>
              Total Transmitted
            </span>
            <span className={`font-bold text-xs ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              {feedbackList.length + 45} Dossier Records
            </span>
          </div>
        </div>
      </section>

      {/* Main Grid: Composer (7 cols) & History List (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Feedback Composer (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className={`rounded-2xl p-6 shadow-xl border relative overflow-hidden ${
            theme === 'dark' ? 'bg-[#1c1b1d] border-[#2a2a2c]' : 'bg-[#ffffff] border-slate-200'
          }`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between pb-4 mb-4 border-b border-inherit">
              <div className="flex flex-col">
                <span className={`font-display font-bold text-base ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  Dispatch Scholar Feedback
                </span>
                <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600 font-medium'}`}>
                  Direct channel to Scholar portal, Guardian dashboard, and Dean file
                </span>
              </div>
              <span className="material-symbols-outlined text-[#d4af37] text-2xl">campaign</span>
            </div>

            <form onSubmit={handleTransmit} className="flex flex-col gap-4 text-xs">
              
              {/* Select Recipient Scholar */}
              <div className="flex flex-col gap-1.5">
                <label className={`font-bold uppercase tracking-wider text-[10px] ${
                  theme === 'dark' ? 'text-gray-400' : 'text-slate-700'
                }`}>
                  Select Recipient Scholar
                </label>
                <div className="relative">
                  <select
                    value={selectedScholarId}
                    onChange={(e) => setSelectedScholarId(e.target.value)}
                    className={`w-full appearance-none pl-10 pr-8 py-2.5 rounded-xl font-bold text-xs focus:outline-none cursor-pointer border ${
                      theme === 'dark'
                        ? 'bg-[#2a2a2c] border-[#353437] text-white'
                        : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  >
                    {scholars.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} • {s.rollNumber} ({s.track})
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#d4af37] text-base">
                    person_search
                  </span>
                  <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-base opacity-60">
                    expand_more
                  </span>
                </div>
              </div>

              {/* Feedback Typology Selection */}
              <div className="flex flex-col gap-1.5">
                <label className={`font-bold uppercase tracking-wider text-[10px] ${
                  theme === 'dark' ? 'text-gray-400' : 'text-slate-700'
                }`}>
                  Feedback Typology
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setTypology('commendation')}
                    className={`py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                      typology === 'commendation'
                        ? 'bg-[#d4af37] text-[#3c2f00] shadow-md font-bold'
                        : theme === 'dark'
                          ? 'bg-[#2a2a2c] text-gray-300 hover:text-white'
                          : 'bg-slate-100 text-slate-700 hover:text-slate-950 border border-slate-200'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">workspace_premium</span>
                    <span>Commendation</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTypology('conceptual')}
                    className={`py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                      typology === 'conceptual'
                        ? 'bg-[#d4af37] text-[#3c2f00] shadow-md font-bold'
                        : theme === 'dark'
                          ? 'bg-[#2a2a2c] text-gray-300 hover:text-white'
                          : 'bg-slate-100 text-slate-700 hover:text-slate-950 border border-slate-200'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">psychology</span>
                    <span>Conceptual</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTypology('intervention')}
                    className={`py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                      typology === 'intervention'
                        ? 'bg-red-600 text-white shadow-md font-bold'
                        : theme === 'dark'
                          ? 'bg-[#2a2a2c] text-gray-300 hover:text-white'
                          : 'bg-slate-100 text-slate-700 hover:text-slate-950 border border-slate-200'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">notification_important</span>
                    <span>Intervention</span>
                  </button>
                </div>
              </div>

              {/* Observation & Notes */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className={`font-bold uppercase tracking-wider text-[10px] ${
                    theme === 'dark' ? 'text-gray-400' : 'text-slate-700'
                  }`}>
                    Faculty Observation & Notes
                  </label>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-slate-600 font-semibold'}>Presets:</span>
                    <button
                      type="button"
                      onClick={() => handleTemplate('olympiad')}
                      className={`font-bold hover:underline ${theme === 'dark' ? 'text-[#d4af37]' : 'text-[#855800]'}`}
                    >
                      Olympiad
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => handleTemplate('office_hours')}
                      className={`font-bold hover:underline ${theme === 'dark' ? 'text-[#d4af37]' : 'text-[#855800]'}`}
                    >
                      Office Hours
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => handleTemplate('lab_mastery')}
                      className={`font-bold hover:underline ${theme === 'dark' ? 'text-[#d4af37]' : 'text-[#855800]'}`}
                    >
                      Lab Mastery
                    </button>
                  </div>
                </div>

                <textarea
                  rows={4}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className={`w-full p-3.5 rounded-xl font-medium focus:outline-none resize-none leading-relaxed border ${
                    theme === 'dark'
                      ? 'bg-[#2a2a2c] border-[#353437] text-white focus:bg-[#353437]'
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white'
                  }`}
                  placeholder="Record structured qualitative remarks regarding scholar performance or advise remedial intervention..."
                />
              </div>

              {/* Multi-Channel Delivery Checkboxes */}
              <div className={`p-4 rounded-xl border flex flex-col gap-2.5 ${
                theme === 'dark'
                  ? 'bg-[#131315] border-[#2a2a2c] text-gray-200'
                  : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}>
                <span className={`font-bold uppercase tracking-wider text-[10px] ${
                  theme === 'dark' ? 'text-[#d4af37]' : 'text-[#855800]'
                }`}>
                  Transmission Protocol
                </span>

                <label className="flex items-center gap-2.5 cursor-pointer select-none font-semibold text-xs">
                  <input
                    type="checkbox"
                    checked={visibleStudent}
                    onChange={(e) => setVisibleStudent(e.target.checked)}
                    className="accent-[#d4af37] w-4 h-4 rounded"
                  />
                  <span>Visible to Scholar in Student Portal</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer select-none font-semibold text-xs">
                  <input
                    type="checkbox"
                    checked={pushGuardian}
                    onChange={(e) => setPushGuardian(e.target.checked)}
                    className="accent-[#d4af37] w-4 h-4 rounded"
                  />
                  <span className="flex items-center gap-2">
                    Push Copy to Guardian Dashboard
                    <span className={`text-[11px] font-mono font-bold ${
                      theme === 'dark' ? 'text-[#d4af37]' : 'text-[#855800]'
                    }`}>
                      (SMS Alert)
                    </span>
                  </span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer select-none font-semibold text-xs">
                  <input
                    type="checkbox"
                    checked={archiveDean}
                    onChange={(e) => setArchiveDean(e.target.checked)}
                    className="accent-[#d4af37] w-4 h-4 rounded"
                  />
                  <span>Archive in Academic Dean Permanent Dossier</span>
                </label>
              </div>

              {/* Dispatch Button */}
              <button
                type="submit"
                disabled={isTransmitting}
                className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all mt-1 ${
                  transmitSuccess
                    ? 'bg-emerald-600 text-white'
                    : theme === 'dark'
                      ? 'bg-[#d4af37] hover:bg-[#ffe088] text-[#3c2f00]'
                      : 'bg-[#996515] hover:bg-[#7b4e00] text-white'
                }`}
              >
                {isTransmitting ? (
                  <>
                    <span className="material-symbols-outlined text-base animate-spin">sync</span>
                    <span>Transmitting Protocol...</span>
                  </>
                ) : transmitSuccess ? (
                  <>
                    <span className="material-symbols-outlined text-base">mark_email_read</span>
                    <span>Feedback Dispatched & Pushed</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">mark_email_read</span>
                    <span>Transmit Feedback & Note</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: Recent Sent Feedback & Status (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className={`font-display font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Recent Sent Feedback & Status
            </h3>
            <span className={`text-xs font-mono font-bold ${theme === 'dark' ? 'text-[#d4af37]' : 'text-[#855800]'}`}>
              View History ({feedbackList.length + 21})
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {feedbackList.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-2xl shadow-md border flex flex-col gap-2.5 transition-all ${
                  theme === 'dark'
                    ? 'bg-[#1c1b1d] border-[#2a2a2c] hover:bg-[#201f22]'
                    : 'bg-[#ffffff] border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    {item.scholarAvatar ? (
                      <img
                        src={item.scholarAvatar}
                        alt={item.scholarName}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-gray-600"
                      />
                    ) : (
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                        theme === 'dark' ? 'bg-[#d4af37]/20 text-[#d4af37]' : 'bg-amber-100 text-amber-900'
                      }`}>
                        {item.scholarName.split(' ').map(n => n[0]).join('')}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className={`font-bold text-xs ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                          {item.scholarName}
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                        <span className={`font-mono text-[10px] font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                          {item.cohort}
                        </span>
                      </div>
                      <span className={`text-[10px] font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                        {item.timestamp}
                      </span>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider font-mono ${
                    item.typology === 'commendation'
                      ? theme === 'dark' ? 'bg-[#d4af37]/20 text-[#d4af37]' : 'bg-amber-100 text-amber-900'
                      : item.typology === 'conceptual'
                        ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
                        : 'bg-red-500/20 text-red-600 dark:text-red-400'
                  }`}>
                    {item.typology}
                  </span>
                </div>

                <p className={`p-2.5 rounded-lg text-xs italic leading-relaxed border ${
                  theme === 'dark'
                    ? 'bg-[#131315] border-[#2a2a2c] text-gray-200'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}>
                  “{item.note}”
                </p>

                <div className={`flex items-center justify-between text-[11px] pt-1 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-slate-600'
                }`}>
                  <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                    <span className="material-symbols-outlined text-sm">done_all</span>
                    <span>{item.readReceipt || 'Delivered to Terminal'}</span>
                  </div>
                  <span className={`font-mono text-[10px] font-bold ${
                    theme === 'dark' ? 'text-[#d4af37]' : 'text-[#855800]'
                  }`}>
                    {item.deliveryStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Academic Dean Dossier Integration Banner */}
          <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs ${
            theme === 'dark' ? 'bg-[#201f22] border-[#2a2a2c]' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                theme === 'dark' ? 'bg-[#d4af37]/20 text-[#d4af37]' : 'bg-amber-100 text-amber-900'
              }`}>
                <span className="material-symbols-outlined text-base">verified_user</span>
              </div>
              <div className="flex flex-col">
                <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
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

    </div>
  );
};
