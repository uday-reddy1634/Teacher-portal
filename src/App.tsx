import { useState, useEffect, useCallback } from 'react';
import { Info, X } from 'lucide-react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { OverviewView } from './components/OverviewView';
import { AttendanceView } from './components/AttendanceView';
import { GradebookView } from './components/GradebookView';
import { CurriculumView } from './components/CurriculumView';
import { LibraryView } from './components/LibraryView';
import { FeedbackView } from './components/FeedbackView';
import {
  BroadcastModal,
  HandbookModal,
  AbsenceDocModal,
  InteractiveBoardModal,
  BellCurveModal,
  FlagStudentModal,
} from './components/Modals';
import { INITIAL_CURRICULUM, INITIAL_FEEDBACK, INITIAL_LIBRARY_BOOKS } from './data/mockData';
import { Scholar, StudentStatus, CurricularModule, FeedbackItem, LibraryBook } from './types';
import {
  fetchScholarsFromApi,
  updateScholarStatusApi,
  updateScholarGradeApi,
  getActiveApiUrl,
} from './services/api';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('attendance'); // default directly to attendance registry
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Cohort Selection 3-Dropdown State
  const [selectedGrade, setSelectedGrade] = useState<string>('Grade 11');
  const [selectedSubject, setSelectedSubject] = useState<string>('AP Physics C');
  const [selectedSection, setSelectedSection] = useState<string>('Section A');
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-21');

  // Loading State
  const [isLoadingApi, setIsLoadingApi] = useState<boolean>(false);

  // Scholars & Marks Data loaded from API
  const [scholars, setScholars] = useState<Scholar[]>([]);
  const [curriculum, setCurriculum] = useState<CurricularModule[]>(INITIAL_CURRICULUM);
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>(INITIAL_FEEDBACK);
  const [books, setBooks] = useState<LibraryBook[]>(INITIAL_LIBRARY_BOOKS);

  // Modals
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [isHandbookOpen, setIsHandbookOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);
  const [isInteractiveBoardOpen, setIsInteractiveBoardOpen] = useState(false);
  const [isBellCurveOpen, setIsBellCurveOpen] = useState(false);
  const [selectedScholarForFlag, setSelectedScholarForFlag] = useState<Scholar | null>(null);

  // Toast notice
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Synchronize document element class for dark/light mode
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#131315';
      document.body.style.color = '#e5e1e4';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#faf8ff';
      document.body.style.color = '#131b2e';
    }
  }, [theme]);

  // Load scholars and marks whenever Grade, Subject, Section, or Date changes
  const loadDataFromApi = useCallback(async (customUrl?: string) => {
    const urlToUse = customUrl || getActiveApiUrl();
    setIsLoadingApi(true);
    try {
      const data = await fetchScholarsFromApi({
        grade: selectedGrade,
        subject: selectedSubject,
        section: selectedSection,
        date: selectedDate,
        customApiUrl: urlToUse,
      });
      setScholars(data);
      showToast(`Loaded ${data.length} scholars & marks successfully.`);
    } catch {
      showToast(`Unable to synchronize records. Local store active.`);
    } finally {
      setIsLoadingApi(false);
    }
  }, [selectedGrade, selectedSubject, selectedSection, selectedDate]);

  // Initial load and reload on cohort parameter changes
  useEffect(() => {
    loadDataFromApi();
  }, [loadDataFromApi]);

  // Handlers for Attendance
  const handleUpdateStatus = async (scholarId: string, status: StudentStatus) => {
    // Optimistic local update
    setScholars(prev =>
      prev.map(s => (s.id === scholarId ? { ...s, status } : s))
    );
    // Background sync call
    await updateScholarStatusApi(scholarId, status);
  };

  const handleMarkAllPresent = async () => {
    setScholars(prev =>
      prev.map(s => ({ ...s, status: 'present' as StudentStatus }))
    );
    showToast(`All ${scholars.length} scholars marked Present.`);
  };

  const handleMarkAllAbsent = async () => {
    setScholars(prev =>
      prev.map(s => ({ ...s, status: 'absent' as StudentStatus }))
    );
    showToast(`All ${scholars.length} scholars marked Absent.`);
  };

  // Handlers for Gradebook
  const handleUpdateUnit4Score = async (scholarId: string, score: number) => {
    const clamped = Math.max(0, Math.min(100, score));
    setScholars(prev =>
      prev.map(s => {
        if (s.id === scholarId) {
          return {
            ...s,
            grades: {
              ...s.grades,
              unit4Exam: clamped,
            },
          };
        }
        return s;
      })
    );
    await updateScholarGradeApi(scholarId, 'unit4Exam', clamped);
  };

  const handleApplyCurve = (offset: number) => {
    setScholars(prev =>
      prev.map(s => ({
        ...s,
        grades: {
          ...s.grades,
          unit4Exam: Math.max(0, Math.min(100, s.grades.unit4Exam + offset)),
        },
      }))
    );
    if (offset > 0) {
      showToast(`Standard statistical curve applied: +${offset} Pts added to active unit marks.`);
    } else {
      showToast('Marks baseline restored.');
    }
  };

  const handleSaveNote = (scholarId: string, note: string) => {
    setScholars(prev =>
      prev.map(s => (s.id === scholarId ? { ...s, remarks: note } : s))
    );
    showToast('Official scholar conduct note saved to registry.');
  };

  // Handlers for Curriculum
  const handleAddModule = (module: CurricularModule) => {
    setCurriculum(prev => [module, ...prev]);
    showToast(`Published "${module.title}" to ${selectedGrade} • ${selectedSection} terminals.`);
  };

  // Handlers for Feedback
  const handleAddFeedback = (feedback: FeedbackItem) => {
    setFeedbackList(prev => [feedback, ...prev]);
    showToast(`Feedback dispatched for ${feedback.scholarName}.`);
  };

  const handleBroadcastSend = (_msg: string, targets: string[]) => {
    showToast(`Broadcast dispatched to ${targets.join(' & ')}.`);
  };

  const handleAddBook = (newBook: LibraryBook) => {
    setBooks(prev => [newBook, ...prev]);
    showToast(`Deposited "${newBook.title}" to Library archives.`);
  };

  const handleUpdateBookStatus = (
    bookId: string,
    status: 'available' | 'reserved' | 'borrowed',
    borrower?: { scholarName: string; rollNumber: string; dueDate: string }
  ) => {
    setBooks(prev =>
      prev.map(b => (b.id === bookId ? { ...b, status, borrower: status === 'borrowed' ? borrower : undefined } : b))
    );
    if (status === 'borrowed' && borrower) {
      showToast(`Checked out to ${borrower.scholarName}. Due: ${borrower.dueDate}`);
    } else if (status === 'available') {
      showToast(`Volume checked in and returned to central stacks.`);
    } else if (status === 'reserved') {
      showToast(`Volume placed on cohort holding reserve.`);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      theme === 'dark' ? 'bg-[#131315] text-[#e5e1e4]' : 'bg-[#faf8ff] text-[#131b2e]'
    }`}>
      
      {/* Aside Navigation Sidebar (Permanent docked on Desktop, closable drawer on Mobile & Tablet) */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          setIsSidebarOpen(false);
        }}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        theme={theme}
        onToggleTheme={() => setTheme(t => (t === 'dark' ? 'light' : 'dark'))}
        onOpenBroadcast={() => setIsBroadcastOpen(true)}
        onOpenHandbook={() => setIsHandbookOpen(true)}
        onOpenBellCurve={() => setIsBellCurveOpen(true)}
        selectedGrade={selectedGrade}
        selectedSubject={selectedSubject}
        selectedSection={selectedSection}
        scholarCount={scholars.length}
      />

      {/* Main Content Column with Desktop Sidebar Offset (lg:pl-64) */}
      <div className="flex flex-col grow min-h-screen lg:pl-64">
        
        {/* Top Header Bar */}
        <Header
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          selectedGrade={selectedGrade}
          onChangeGrade={setSelectedGrade}
          selectedSubject={selectedSubject}
          onChangeSubject={setSelectedSubject}
          selectedSection={selectedSection}
          onChangeSection={setSelectedSection}
          theme={theme}
          onToggleTheme={() => setTheme(t => (t === 'dark' ? 'light' : 'dark'))}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          unreadCount={2}
        />

        {/* Dynamic View Router */}
        <main className="w-full pt-20 grow">
          {currentTab === 'overview' && (
            <OverviewView
              theme={theme}
              onNavigate={setCurrentTab}
              onOpenBroadcast={() => setIsBroadcastOpen(true)}
              onOpenInteractiveBoard={() => setIsInteractiveBoardOpen(true)}
            />
          )}

          {currentTab === 'attendance' && (
            <AttendanceView
              theme={theme}
              scholars={scholars}
              onUpdateStatus={handleUpdateStatus}
              onMarkAllPresent={handleMarkAllPresent}
              onMarkAllAbsent={handleMarkAllAbsent}
              selectedGrade={selectedGrade}
              onChangeGrade={setSelectedGrade}
              selectedSubject={selectedSubject}
              onChangeSubject={setSelectedSubject}
              selectedSection={selectedSection}
              onChangeSection={setSelectedSection}
              selectedDate={selectedDate}
              onChangeDate={setSelectedDate}
              isLoading={isLoadingApi}
              onReload={() => loadDataFromApi()}
            />
          )}

          {currentTab === 'gradebook' && (
            <GradebookView
              theme={theme}
              scholars={scholars}
              onOpenBellCurve={() => setIsBellCurveOpen(true)}
              onUpdateUnit4Score={handleUpdateUnit4Score}
              onApplyCurve={handleApplyCurve}
              selectedGrade={selectedGrade}
              onChangeGrade={setSelectedGrade}
              selectedSubject={selectedSubject}
              onChangeSubject={setSelectedSubject}
              selectedSection={selectedSection}
              onChangeSection={setSelectedSection}
              isLoading={isLoadingApi}
              onReload={() => loadDataFromApi()}
            />
          )}

          {currentTab === 'curriculum' && (
            <CurriculumView
              theme={theme}
              curriculum={curriculum}
              onAddModule={handleAddModule}
              onNavigateToFeedback={() => setCurrentTab('feedback')}
            />
          )}

          {currentTab === 'library' && (
            <LibraryView
              theme={theme}
              books={books}
              scholars={scholars}
              onAddBook={handleAddBook}
              onUpdateBookStatus={handleUpdateBookStatus}
              selectedSubject={selectedSubject}
              selectedGrade={selectedGrade}
            />
          )}

          {currentTab === 'feedback' && (
            <FeedbackView
              theme={theme}
              scholars={scholars}
              feedbackList={feedbackList}
              onAddFeedback={handleAddFeedback}
            />
          )}
        </main>

        {/* Institutional Governance Footer */}
        <Footer
          theme={theme}
          onOpenPolicyModal={() => setIsHandbookOpen(true)}
        />
      </div>

      {/* Interactive Modals */}
      <BroadcastModal
        isOpen={isBroadcastOpen}
        onClose={() => setIsBroadcastOpen(false)}
        theme={theme}
        onSend={handleBroadcastSend}
      />

      <HandbookModal
        isOpen={isHandbookOpen}
        onClose={() => setIsHandbookOpen(false)}
        theme={theme}
      />

      <AbsenceDocModal
        isOpen={!!selectedDoc}
        onClose={() => setSelectedDoc(null)}
        theme={theme}
        doc={selectedDoc}
      />

      <InteractiveBoardModal
        isOpen={isInteractiveBoardOpen}
        onClose={() => setIsInteractiveBoardOpen(false)}
        theme={theme}
      />

      <BellCurveModal
        isOpen={isBellCurveOpen}
        onClose={() => setIsBellCurveOpen(false)}
        theme={theme}
      />

      <FlagStudentModal
        isOpen={!!selectedScholarForFlag}
        onClose={() => setSelectedScholarForFlag(null)}
        theme={theme}
        scholar={selectedScholarForFlag}
        onSaveNote={handleSaveNote}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-2xl animate-in slide-in-from-bottom-4 duration-200 ${
          theme === 'dark'
            ? 'bg-[#201f22] border-[#d4af37] text-white'
            : 'bg-white border-amber-400 text-slate-900'
        }`}>
          <Info className="w-4 h-4 text-[#d4af37] shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className={`ml-2 transition-colors ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </div>
  );
}
