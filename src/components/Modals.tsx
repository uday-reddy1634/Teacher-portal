import React, { useState } from 'react';
import { Scholar } from '../types';

interface BroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
  onSend: (msg: string, targets: string[]) => void;
}

export const BroadcastModal: React.FC<BroadcastModalProps> = ({ isOpen, onClose, theme, onSend }) => {
  const [title, setTitle] = useState('Laboratory Preparation: Cavendish Torsion Calibration');
  const [message, setMessage] = useState('Scholars attending Period 3 Honors Seminar are requested to load dataset PHY-11-L4 onto their terminal pads prior to entering Lecture Amphitheater 401.');
  const [targetPads, setTargetPads] = useState(true);
  const [targetParents, setTargetParents] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSend = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSentSuccess(true);
      onSend(message, [targetPads ? 'Student Pads' : '', targetParents ? 'Guardian App' : ''].filter(Boolean));
      setTimeout(() => {
        setSentSuccess(false);
        onClose();
      }, 1200);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className={`w-full max-w-lg rounded-2xl p-6 shadow-2xl border transition-all ${
        theme === 'dark'
          ? 'bg-[#1c1b1d] border-[#353437] text-[#e5e1e4]'
          : 'bg-[#ffffff] border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center justify-between pb-3 border-b border-inherit">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#d4af37] text-2xl">campaign</span>
            <h3 className="font-display font-bold text-lg">Broadcast Faculty Announcement</h3>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-gray-700/30' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-4 text-xs">
          <div>
            <label className={`font-bold block mb-1 uppercase tracking-wider text-[11px] ${
              theme === 'dark' ? 'text-gray-300' : 'text-slate-700'
            }`}>
              Announcement Subject
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg focus:outline-none transition-colors border font-bold ${
                theme === 'dark'
                  ? 'bg-[#2a2a2c] border-[#353437] text-white focus:bg-[#353437]'
                  : 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white'
              }`}
            />
          </div>

          <div>
            <label className={`font-bold block mb-1 uppercase tracking-wider text-[11px] ${
              theme === 'dark' ? 'text-gray-300' : 'text-slate-700'
            }`}>
              Transmission Body
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={`w-full p-3 rounded-lg focus:outline-none resize-none leading-relaxed text-xs transition-colors border font-medium ${
                theme === 'dark'
                  ? 'bg-[#2a2a2c] border-[#353437] text-white focus:bg-[#353437]'
                  : 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white'
              }`}
            />
          </div>

          <div className={`p-3 rounded-xl flex flex-col gap-2 border ${
            theme === 'dark' ? 'bg-[#131315] border-[#2a2a2c]' : 'bg-slate-50 border-slate-200 text-slate-900'
          }`}>
            <span className={`font-bold uppercase tracking-wider text-[10px] ${
              theme === 'dark' ? 'text-[#d4af37]' : 'text-[#855800]'
            }`}>
              Distribution Gateways
            </span>
            <label className="flex items-center gap-2 cursor-pointer font-semibold">
              <input
                type="checkbox"
                checked={targetPads}
                onChange={(e) => setTargetPads(e.target.checked)}
                className="accent-[#d4af37] w-4 h-4 rounded"
              />
              <span>Push instant notification to all 31 Scholar iPad Terminals (Section 11-A)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-semibold">
              <input
                type="checkbox"
                checked={targetParents}
                onChange={(e) => setTargetParents(e.target.checked)}
                className="accent-[#d4af37] w-4 h-4 rounded"
              />
              <span>Carbon Copy to Guardian Communication Hub (SMS & Email)</span>
            </label>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-inherit">
          <button
            onClick={onClose}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
              theme === 'dark'
                ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Cancel
          </button>
          <button
            disabled={isSending || sentSuccess}
            onClick={handleSend}
            className="px-5 py-2 text-xs font-bold rounded-lg bg-[#d4af37] text-[#3c2f00] hover:bg-[#e7c55a] shadow-lg flex items-center gap-1.5 transition-all"
          >
            {isSending ? (
              <>
                <span className="material-symbols-outlined text-base animate-spin">sync</span>
                <span>Broadcasting...</span>
              </>
            ) : sentSuccess ? (
              <>
                <span className="material-symbols-outlined text-base">check</span>
                <span>Dispatched</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-base">send</span>
                <span>Transmit Broadcast</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

interface HandbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
}

export const HandbookModal: React.FC<HandbookModalProps> = ({ isOpen, onClose, theme }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className={`w-full max-w-2xl rounded-2xl p-6 shadow-2xl border transition-all max-h-[90vh] overflow-y-auto ${
        theme === 'dark'
          ? 'bg-[#1c1b1d] border-[#353437] text-[#e5e1e4]'
          : 'bg-[#ffffff] border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center justify-between pb-3 border-b border-inherit">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#d4af37] text-2xl">policy</span>
            <div>
              <h3 className="font-display font-bold text-lg">Pathshala Faculty Handbook</h3>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600 font-medium'}`}>
                Institutional Governance & Protocol §4.2
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-gray-700/30' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-4 text-xs leading-relaxed">
          <div className={`p-4 rounded-xl border ${
            theme === 'dark' ? 'bg-[#131315] border-[#2a2a2c]' : 'bg-amber-50/70 border-amber-200 text-slate-900'
          }`}>
            <h4 className={`font-bold text-sm mb-1 font-display ${theme === 'dark' ? 'text-[#d4af37]' : 'text-[#855800]'}`}>
              §4.2 Roll Call & Ledger Commitment Protocol
            </h4>
            <p className={theme === 'dark' ? 'text-gray-200' : 'text-slate-800'}>
              Official classroom rolls must be finalized and cryptographically committed to the Central Registrar within <strong className="font-bold">20 minutes of the period bell</strong>. Unmarked scholars automatically escalate to the Office of the Dean of Students for an automated campus security sweep.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <h5 className={`font-bold text-sm mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-950'}`}>
                1. Tardy Categorization & Thresholds
              </h5>
              <p className={theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}>
                Arrivals between 1 and 15 minutes after the morning bell require a <em>Tardy Flag</em>. Delays verified by regional transit dispatch or campus shuttle logs are marked as transit-excused without disciplinary demerit.
              </p>
            </div>

            <div>
              <h5 className={`font-bold text-sm mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-950'}`}>
                2. Dean-Approved Absences
              </h5>
              <p className={theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}>
                Scholars with authenticated medical slips from certified physicians or formal athletic/interscholastic delegations (e.g. Model UN, Olympiad teams) are recorded as <em>Excused</em> and bypass dean disciplinary workflows.
              </p>
            </div>

            <div>
              <h5 className={`font-bold text-sm mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-950'}`}>
                3. Gradebook Ledger Synchrony
              </h5>
              <p className={theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}>
                All formative assessments and summative exam marks must be committed with AES-256 digital faculty signatures. Curving algorithms must comply with standard statistical tolerances (+2.0 standard baseline).
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end pt-3 border-t border-inherit">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold rounded-lg bg-[#d4af37] text-[#3c2f00] hover:bg-[#e7c55a] shadow-md"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};

interface AbsenceDocModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
  doc?: {
    scholarName: string;
    rollNumber: string;
    title: string;
    authBy: string;
    details: string;
    verified: boolean;
    type: 'medical' | 'delegation';
  } | null;
}

export const AbsenceDocModal: React.FC<AbsenceDocModalProps> = ({ isOpen, onClose, theme, doc }) => {
  if (!isOpen || !doc) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className={`w-full max-w-lg rounded-2xl p-6 shadow-2xl border transition-all ${
        theme === 'dark'
          ? 'bg-[#1c1b1d] border-[#353437] text-[#e5e1e4]'
          : 'bg-[#ffffff] border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center justify-between pb-3 border-b border-inherit">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#d4af37] text-2xl">
              {doc.type === 'medical' ? 'health_and_safety' : 'emoji_events'}
            </span>
            <div>
              <h3 className="font-display font-bold text-base">{doc.title}</h3>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600 font-medium'}`}>
                {doc.scholarName} ({doc.rollNumber})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-gray-700/30' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-3 text-xs leading-relaxed">
          <div className={`p-4 rounded-xl border flex flex-col gap-2 ${
            theme === 'dark' ? 'bg-[#131315] border-[#2a2a2c]' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`font-mono text-[10px] uppercase tracking-wider font-bold ${
                theme === 'dark' ? 'text-[#d4af37]' : 'text-[#855800]'
              }`}>
                OFFICIAL CLEARANCE SLIP
              </span>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                <span className="material-symbols-outlined text-sm">verified</span>
                DEAN ENDORSED
              </span>
            </div>
            <div className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{doc.title}</div>
            <div className={`text-[11px] font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>{doc.authBy}</div>
            <p className={`mt-2 text-xs italic border-l-2 border-[#d4af37] pl-3 py-1 ${
              theme === 'dark' ? 'text-gray-300' : 'text-slate-800'
            }`}>
              "{doc.details}"
            </p>
          </div>

          <div className={`flex items-center justify-between text-[11px] px-1 font-semibold ${
            theme === 'dark' ? 'text-gray-400' : 'text-slate-600'
          }`}>
            <span>Automated sync with Aetheria Health & Travel Ledger</span>
            <span className="font-mono">HASH: #882B-MED</span>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between pt-3 border-t border-inherit">
          <button
            onClick={() => alert('Document dossier downloaded to faculty vault.')}
            className={`px-3 py-1.5 rounded-lg border font-bold text-xs flex items-center gap-1 transition-colors ${
              theme === 'dark'
                ? 'border-gray-700 hover:bg-gray-800 text-gray-300'
                : 'border-slate-300 hover:bg-slate-100 text-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-sm">download</span>
            Download PDF Slip
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold rounded-lg bg-[#d4af37] text-[#3c2f00] hover:bg-[#e7c55a]"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};

interface InteractiveBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
}

export const InteractiveBoardModal: React.FC<InteractiveBoardModalProps> = ({ isOpen, onClose, theme }) => {
  const [slide, setSlide] = useState(1);
  const totalSlides = 5;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className={`w-full max-w-4xl rounded-2xl shadow-2xl border overflow-hidden transition-all ${
        theme === 'dark'
          ? 'bg-[#131315] border-[#353437] text-[#e5e1e4]'
          : 'bg-[#ffffff] border-slate-200 text-slate-900'
      }`}>
        <div className={`p-4 border-b flex items-center justify-between ${
          theme === 'dark' ? 'bg-black/20 border-gray-700/30' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#d4af37]">co_present</span>
            <div>
              <h3 className="font-display font-bold text-base">Period 3: Honors Classical Mechanics Seminar</h3>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600 font-medium'}`}>
                Lecture Amphitheater 401 · Lagrangian Formalisms & D’Alembert Principle
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-mono font-bold px-2 py-1 rounded ${
              theme === 'dark' ? 'bg-[#d4af37]/20 text-[#d4af37]' : 'bg-amber-100 text-amber-900'
            }`}>
              SLIDE {slide} OF {totalSlides}
            </span>
            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg transition-colors ${
                theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-gray-700/30' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </div>

        {/* Board content */}
        <div className={`p-8 min-h-95 flex flex-col justify-between ${
          theme === 'dark'
            ? 'bg-linear-to-b from-[#1c1b1d]/50 to-[#0e0e10]'
            : 'bg-linear-to-b from-slate-50 to-white'
        }`}>
          {slide === 1 && (
            <div className="space-y-4">
              <div className={`text-xs font-mono font-bold uppercase tracking-widest ${
                theme === 'dark' ? 'text-[#d4af37]' : 'text-[#855800]'
              }`}>
                Seminar Module IV · Slide 1
              </div>
              <h2 className="text-2xl font-bold font-display">Generalized Coordinates & The Principle of Least Action</h2>
              <p className={`text-sm leading-relaxed max-w-2xl ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
                Given a mechanical system with <span className="font-mono font-bold text-[#d4af37]">N</span> particles constrained by holonomic conditions, the motion between times <span className="font-mono font-bold">t₁</span> and <span className="font-mono font-bold">t₂</span> extremizes the action functional:
              </p>
              <div className={`p-4 rounded-xl font-mono text-center text-lg my-4 shadow-inner border font-bold ${
                theme === 'dark'
                  ? 'bg-black/40 border-[#d4af37]/30 text-[#f2ca50]'
                  : 'bg-amber-50 border-amber-300 text-amber-950'
              }`}>
                S = ∫ [T(q, q̇, t) - V(q, t)] dt = ∫ L(q, q̇, t) dt
              </div>
              <p className={`text-xs font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                Connected Pads: 28 Scholars live synced. Real-time telemetry open.
              </p>
            </div>
          )}
          {slide === 2 && (
            <div className="space-y-4">
              <div className={`text-xs font-mono font-bold uppercase tracking-widest ${
                theme === 'dark' ? 'text-[#d4af37]' : 'text-[#855800]'
              }`}>
                Seminar Module IV · Slide 2
              </div>
              <h2 className="text-2xl font-bold font-display">Euler-Lagrange Equations of Motion</h2>
              <p className={`text-sm leading-relaxed max-w-2xl ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
                By setting the functional variation <span className="font-mono font-bold text-[#d4af37]">δS = 0</span>, we arrive at the foundational equation for each generalized degree of freedom:
              </p>
              <div className={`p-4 rounded-xl font-mono text-center text-lg my-4 shadow-inner border font-bold ${
                theme === 'dark'
                  ? 'bg-black/40 border-[#d4af37]/30 text-[#f2ca50]'
                  : 'bg-amber-50 border-amber-300 text-amber-950'
              }`}>
                d/dt ( ∂L / ∂q̇ᵢ ) - ∂L / ∂qᵢ = 0 , &nbsp; ∀ i ∈ &#123;1, ..., n&#125;
              </div>
              <p className={`text-xs font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                Notice the complete elimination of normal reaction forces!
              </p>
            </div>
          )}
          {slide >= 3 && (
            <div className="space-y-4">
              <div className={`text-xs font-mono font-bold uppercase tracking-widest ${
                theme === 'dark' ? 'text-[#d4af37]' : 'text-[#855800]'
              }`}>
                Seminar Module IV · Slide {slide}
              </div>
              <h2 className="text-2xl font-bold font-display">Laboratory Verification: Torsion Pendulum Experiment</h2>
              <p className={`text-sm leading-relaxed max-w-2xl ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
                Comparing analytical tensor predictions against telemetry streams from Cavendish Torsion Sensor Suite in Faraday Hall.
              </p>
              <div className="grid grid-cols-2 gap-4 my-2">
                <div className={`p-3 rounded-lg border text-xs ${
                  theme === 'dark' ? 'bg-black/30 border-gray-700/40' : 'bg-white border-slate-200'
                }`}>
                  <div className={`font-bold mb-1 ${theme === 'dark' ? 'text-[#d4af37]' : 'text-[#855800]'}`}>Theoretical Period (τ)</div>
                  <div className="font-mono text-lg font-bold">2.4182 s</div>
                </div>
                <div className={`p-3 rounded-lg border text-xs ${
                  theme === 'dark' ? 'bg-black/30 border-gray-700/40' : 'bg-white border-slate-200'
                }`}>
                  <div className="font-bold text-emerald-600 dark:text-emerald-400 mb-1">Sensor Reading Live</div>
                  <div className="font-mono text-lg font-bold">2.4179 s (Δ = 0.012%)</div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-inherit">
            <div className="flex items-center gap-2">
              <button
                disabled={slide === 1}
                onClick={() => setSlide(s => Math.max(1, s - 1))}
                className={`px-3 py-1.5 rounded-lg border text-xs font-bold disabled:opacity-30 flex items-center gap-1 transition-colors ${
                  theme === 'dark'
                    ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                    : 'border-slate-300 text-slate-800 hover:bg-slate-100'
                }`}
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Previous
              </button>
              <button
                disabled={slide === totalSlides}
                onClick={() => setSlide(s => Math.min(totalSlides, s + 1))}
                className={`px-3 py-1.5 rounded-lg border text-xs font-bold disabled:opacity-30 flex items-center gap-1 transition-colors ${
                  theme === 'dark'
                    ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                    : 'border-slate-300 text-slate-800 hover:bg-slate-100'
                }`}
              >
                Next
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
            <button
              onClick={() => alert('Broadcasting slide annotations to 28 scholar terminals.')}
              className="px-4 py-1.5 rounded-lg bg-[#d4af37] text-[#3c2f00] text-xs font-bold shadow hover:bg-[#e7c55a] flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">sync</span>
              Sync Board to Student Pads
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface BellCurveModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
}

export const BellCurveModal: React.FC<BellCurveModalProps> = ({ isOpen, onClose, theme }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className={`w-full max-w-xl rounded-2xl p-6 shadow-2xl border transition-all ${
        theme === 'dark'
          ? 'bg-[#1c1b1d] border-[#353437] text-[#e5e1e4]'
          : 'bg-[#ffffff] border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center justify-between pb-3 border-b border-inherit">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#d4af37] text-2xl">analytics</span>
            <div>
              <h3 className="font-display font-bold text-lg">Statistical Bell Curve Analysis</h3>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600 font-medium'}`}>
                Unit 4: Rotational Dynamics Exam · AP Physics C
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-gray-700/30' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-4 text-xs">
          <div className="grid grid-cols-3 gap-3">
            <div className={`p-3 rounded-xl border ${
              theme === 'dark' ? 'bg-[#2a2a2c] border-[#353437]' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className={`text-[10px] uppercase font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                Mean Score
              </div>
              <div className={`font-display text-xl font-bold mt-0.5 ${
                theme === 'dark' ? 'text-[#d4af37]' : 'text-[#855800]'
              }`}>
                89.2%
              </div>
            </div>
            <div className={`p-3 rounded-xl border ${
              theme === 'dark' ? 'bg-[#2a2a2c] border-[#353437]' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className={`text-[10px] uppercase font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                Std Deviation (σ)
              </div>
              <div className="font-display text-xl font-bold mt-0.5">5.14 Pts</div>
            </div>
            <div className={`p-3 rounded-xl border ${
              theme === 'dark' ? 'bg-[#2a2a2c] border-[#353437]' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className={`text-[10px] uppercase font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                Kurtosis
              </div>
              <div className="font-display text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">+0.42</div>
            </div>
          </div>

          {/* SVG Gaussian Bell curve diagram */}
          <div className={`p-4 rounded-xl border ${
            theme === 'dark' ? 'bg-[#131315] border-[#2a2a2c]' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className={`text-[11px] font-bold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-700'}`}>
              GAUSSIAN DISTRIBUTION MATRIX
            </div>
            <svg viewBox="0 0 400 120" className="w-full h-28 overflow-visible">
              <path
                d="M 20,110 Q 140,110 180,60 T 200,15 T 220,60 Q 260,110 380,110"
                fill="none"
                stroke={theme === 'dark' ? '#d4af37' : '#996515'}
                strokeWidth="2.5"
              />
              <path
                d="M 20,110 Q 140,110 180,60 T 200,15 T 220,60 Q 260,110 380,110 L 380,115 L 20,115 Z"
                fill={theme === 'dark' ? '#d4af37' : '#996515'}
                fillOpacity="0.14"
              />
              {/* Mean marker line */}
              <line x1="200" y1="15" x2="200" y2="115" stroke={theme === 'dark' ? '#f2ca50' : '#855800'} strokeDasharray="3,3" strokeWidth="1.5" />
              <text x="200" y="10" fill={theme === 'dark' ? '#f2ca50' : '#855800'} fontSize="10" textAnchor="middle" fontWeight="bold">μ = 89.2%</text>
            </svg>
            <div className={`flex justify-between text-[10px] font-mono font-bold mt-1 ${
              theme === 'dark' ? 'text-gray-400' : 'text-slate-600'
            }`}>
              <span>70% (-3σ)</span>
              <span>80% (-1.8σ)</span>
              <span>89.2% (Mean)</span>
              <span>95% (+1.1σ)</span>
              <span>100% (+2.1σ)</span>
            </div>
          </div>

          <p className={`text-[11px] font-medium leading-relaxed ${
            theme === 'dark' ? 'text-gray-300' : 'text-slate-700'
          }`}>
            Cohort performance is strictly within standard IB & AP CollegeBoard tolerances. No algorithmic grade compression is indicated.
          </p>
        </div>

        <div className="mt-6 flex justify-end pt-3 border-t border-inherit">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold rounded-lg bg-[#d4af37] text-[#3c2f00] hover:bg-[#e7c55a]"
          >
            Close Analysis
          </button>
        </div>
      </div>
    </div>
  );
};

interface FlagStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
  scholar?: Scholar | null;
  onSaveNote: (scholarId: string, note: string) => void;
}

export const FlagStudentModal: React.FC<FlagStudentModalProps> = ({ isOpen, onClose, theme, scholar, onSaveNote }) => {
  const [note, setNote] = useState('');

  if (!isOpen || !scholar) return null;

  const handleSave = () => {
    onSaveNote(scholar.id, note || scholar.notes || scholar.remarks || '');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className={`w-full max-w-md rounded-2xl p-6 shadow-2xl border transition-all ${
        theme === 'dark'
          ? 'bg-[#1c1b1d] border-[#353437] text-[#e5e1e4]'
          : 'bg-[#ffffff] border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center justify-between pb-3 border-b border-inherit">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#d4af37] text-2xl">flag</span>
            <div>
              <h3 className="font-display font-bold text-base">Flag Scholar Note</h3>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600 font-medium'}`}>
                {scholar.name} ({scholar.rollNumber})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-gray-700/30' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-3 text-xs">
          <div>
            <label className={`font-bold block mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
              Official Attendance & Conduct Note
            </label>
            <textarea
              rows={3}
              defaultValue={scholar.notes !== '—' ? scholar.notes : ''}
              placeholder="e.g. Excused early for laboratory prep, late bus arrival, medical note..."
              onChange={(e) => setNote(e.target.value)}
              className={`w-full p-3 rounded-lg focus:outline-none resize-none text-xs border font-medium ${
                theme === 'dark'
                  ? 'bg-[#2a2a2c] border-[#353437] text-white focus:bg-[#353437]'
                  : 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white'
              }`}
            />
          </div>
          <div className={`flex items-center gap-2 text-[11px] font-medium ${
            theme === 'dark' ? 'text-gray-400' : 'text-slate-600'
          }`}>
            <span className="material-symbols-outlined text-sm">lock</span>
            <span>Recorded in official Faculty Roll Call Register for today.</span>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2 pt-3 border-t border-inherit">
          <button
            onClick={onClose}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
              theme === 'dark'
                ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-xs font-bold rounded-lg bg-[#d4af37] text-[#3c2f00] hover:bg-[#e7c55a]"
          >
            Save Note
          </button>
        </div>
      </div>
    </div>
  );
};
