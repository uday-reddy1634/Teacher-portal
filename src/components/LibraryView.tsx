import React, { useState, useRef } from 'react';
import { LibraryBook, Scholar } from '../types';
import {
  Library,
  Upload,
  Plus,
  Search,
  ChevronDown,
  LayoutGrid,
  List,
  SearchX,
  User,
  MapPin,
  BookOpen,
  Undo2,
  UserCheck,
  Bookmark,
  BookmarkCheck,
  Download,
  FileText,
  X,
  ShieldCheck,
  FolderOpen,
} from 'lucide-react';

interface LibraryViewProps {
  theme: 'dark' | 'light';
  books: LibraryBook[];
  scholars: Scholar[];
  onAddBook: (newBook: LibraryBook) => void;
  onUpdateBookStatus: (bookId: string, status: 'available' | 'reserved' | 'borrowed', borrower?: { scholarName: string; rollNumber: string; dueDate: string }) => void;
  selectedSubject?: string;
  selectedGrade?: string;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  theme,
  books,
  scholars,
  onAddBook,
  onUpdateBookStatus,
  selectedSubject = 'AP Physics C',
  selectedGrade = 'Grade 11',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'digital' | 'physical' | 'reserves'>('all');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Modals state
  const [readingBook, setReadingBook] = useState<LibraryBook | null>(null);
  const [borrowingBook, setBorrowingBook] = useState<LibraryBook | null>(null);
  const [selectedBorrowerId, setSelectedBorrowerId] = useState<string>(scholars[0]?.id || '');
  const [loanDurationDays, setLoanDurationDays] = useState<number>(14);

  // Add Book Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newIsbn, setNewIsbn] = useState('');
  const [newCallNumber, setNewCallNumber] = useState('');
  const [newSubject, setNewSubject] = useState(selectedSubject);
  const [newCategory, setNewCategory] = useState<LibraryBook['category']>('Textbook');
  const [newFormat, setNewFormat] = useState<LibraryBook['format']>('Dual (Digital & Print)');
  const [newShelfLocation, setNewShelfLocation] = useState('Wing B · Stacks 3 · Shelf 06');
  const [newSynopsis, setNewSynopsis] = useState('');
  const [newPages, setNewPages] = useState<number>(350);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [uploadedFileSize, setUploadedFileSize] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter books
  const filteredBooks = books.filter((book) => {
    // Search query
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      const matchTitle = book.title.toLowerCase().includes(q);
      const matchAuthor = book.author.toLowerCase().includes(q);
      const matchIsbn = book.isbn.toLowerCase().includes(q);
      const matchCall = book.callNumber.toLowerCase().includes(q);
      const matchSubject = book.subject.toLowerCase().includes(q);
      if (!matchTitle && !matchAuthor && !matchIsbn && !matchCall && !matchSubject) {
        return false;
      }
    }

    // Tab filter
    if (activeTab === 'digital') {
      if (!book.format.includes('Digital')) return false;
    } else if (activeTab === 'physical') {
      if (!book.format.includes('Print') && !book.format.includes('Hardcover')) return false;
    } else if (activeTab === 'reserves') {
      if (book.status !== 'reserved') return false;
    }

    // Subject filter
    if (subjectFilter !== 'all' && book.subject !== subjectFilter) {
      return false;
    }

    // Status filter
    if (statusFilter !== 'all' && book.status !== statusFilter) {
      return false;
    }

    return true;
  });

  // KPI stats
  const totalHoldings = books.length;
  const digitalVolumes = books.filter(b => b.format.includes('Digital')).length;
  const activeLoans = books.filter(b => b.status === 'borrowed').length;
  const reservedCount = books.filter(b => b.status === 'reserved').length;

  // File upload trigger
  const handleTriggerUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setUploadedFileSize(`${sizeMB} MB`);
      if (!newTitle) {
        // Derive clean title from filename
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setNewTitle(cleanName);
      }
    }
  };

  const handleCreateBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAuthor.trim()) return;

    const generatedId = `lib-${Date.now()}`;
    const generatedCall = newCallNumber.trim() || `ATH-${Math.floor(100 + Math.random() * 900)} .A26`;

    const bookItem: LibraryBook = {
      id: generatedId,
      title: newTitle.trim(),
      author: newAuthor.trim(),
      isbn: newIsbn.trim() || `ISBN-ATH-${Math.floor(100000 + Math.random() * 900000)}`,
      callNumber: generatedCall,
      subject: newSubject,
      level: selectedGrade,
      category: newCategory,
      format: newFormat,
      status: 'available',
      shelfLocation: newShelfLocation.trim() || 'Athenaeum Central Stacks',
      copiesAvailable: 5,
      totalCopies: 5,
      synopsis: newSynopsis.trim() || 'Faculty deposited scholarly volume for the academic department archive.',
      publishYear: 2026,
      pages: newPages || 300,
      fileName: uploadedFileName || 'digital-resource.pdf',
      fileSize: uploadedFileSize || '14.2 MB',
      coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
    };

    onAddBook(bookItem);
    setIsAddModalOpen(false);

    // Reset fields
    setNewTitle('');
    setNewAuthor('');
    setNewIsbn('');
    setNewCallNumber('');
    setNewSynopsis('');
    setUploadedFileName('');
    setUploadedFileSize('');
  };

  // Borrow handler
  const handleConfirmBorrow = () => {
    if (!borrowingBook) return;
    const scholar = scholars.find(s => s.id === selectedBorrowerId) || scholars[0];
    if (!scholar) return;

    const dueDateObj = new Date();
    dueDateObj.setDate(dueDateObj.getDate() + loanDurationDays);
    const dueDateStr = dueDateObj.toISOString().split('T')[0];

    onUpdateBookStatus(borrowingBook.id, 'borrowed', {
      scholarName: scholar.name,
      rollNumber: scholar.rollNumber,
      dueDate: dueDateStr,
    });

    setBorrowingBook(null);
  };

  // Return handler
  const handleReturnBook = (bookId: string) => {
    onUpdateBookStatus(bookId, 'available');
  };

  // Toggle reserve handler
  const handleToggleReserve = (book: LibraryBook) => {
    if (book.status === 'reserved') {
      onUpdateBookStatus(book.id, 'available');
    } else {
      onUpdateBookStatus(book.id, 'reserved');
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Hidden File Input for Native File Manager Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.epub,.djvu,.txt,.docx"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Top Banner / Heading */}
      <div className={`p-6 sm:p-8 rounded-2xl border transition-all ${
        theme === 'dark'
          ? 'bg-[#1c1b1d] border-[#2a2a2c] text-[#e5e1e4]'
          : 'bg-[#ffffff] border-slate-200 text-slate-900 shadow-sm'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono font-medium text-slate-500 dark:text-gray-400">
              <Library className="w-4 h-4 text-[#d4af37]" />
              <span>ATHENAEUM CENTRAL ARCHIVE</span>
              <span aria-hidden="true">·</span>
              <span>CATALOG YEAR 2026–2027</span>
            </div>

            <h1 className={`font-display text-2xl sm:text-3xl font-extrabold tracking-tight ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              Academic Library & Research Manuscript Vault
            </h1>

            <p className={`text-xs sm:text-sm leading-relaxed ${
              theme === 'dark' ? 'text-gray-300' : 'text-slate-600'
            }`}>
              Comprehensive repository of accredited textbooks, classical mechanics treatises, digital course reserves, and examination past papers curated for faculty instruction and scholar checkout.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <button
              onClick={() => {
                setIsAddModalOpen(true);
                handleTriggerUpload();
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md ${
                theme === 'dark'
                  ? 'bg-[#d4af37] hover:bg-[#ffe088] text-[#3c2f00]'
                  : 'bg-[#996515] hover:bg-[#7b4e00] text-white'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Upload Book / Manuscript</span>
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all border shadow-sm ${
                theme === 'dark'
                  ? 'bg-[#2a2a2c] hover:bg-[#353437] border-[#353437] text-white'
                  : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Add Resource Details</span>
            </button>
          </div>
        </div>

        {/* 4 Metadata Metrics (Clean, Zero-Pill Design) */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t ${
          theme === 'dark' ? 'border-[#2a2a2c]' : 'border-slate-200'
        }`}>
          <div className="flex flex-col">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">
              Total Catalog Holdings
            </span>
            <span className={`text-2xl font-display font-extrabold mt-1 ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              {totalHoldings} Titles
            </span>
            <span className="text-[11px] font-medium text-slate-500 dark:text-gray-400 mt-0.5">
              Physical & digital formats
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">
              Digital E-Books
            </span>
            <span className="text-2xl font-display font-extrabold mt-1 text-[#d4af37] dark:text-[#f2ca50]">
              {digitalVolumes} Volumes
            </span>
            <span className="text-[11px] font-medium text-slate-500 dark:text-gray-400 mt-0.5">
              Available for immediate read
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">
              Active Scholar Loans
            </span>
            <span className={`text-2xl font-display font-extrabold mt-1 ${
              activeLoans > 0
                ? theme === 'dark' ? 'text-amber-400' : 'text-amber-700'
                : theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              {activeLoans} Borrowed
            </span>
            <span className="text-[11px] font-medium text-slate-500 dark:text-gray-400 mt-0.5">
              Tracked with return dates
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">
              Course Reserves
            </span>
            <span className="text-2xl font-display font-extrabold mt-1 text-emerald-600 dark:text-emerald-400">
              {reservedCount} Reserved
            </span>
            <span className="text-[11px] font-medium text-slate-500 dark:text-gray-400 mt-0.5">
              Reserved for {selectedGrade}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Navigation Bar */}
      <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 ${
        theme === 'dark' ? 'bg-[#1c1b1d] border-[#2a2a2c]' : 'bg-[#ffffff] border-slate-200 shadow-sm'
      }`}>
        {/* Segmented Filter Tabs (Zero-pill, Functional Interactive Buttons) */}
        <div className={`flex items-center p-1 rounded-xl gap-1 border self-start md:self-auto overflow-x-auto ${
          theme === 'dark' ? 'bg-[#131315] border-[#2a2a2c]' : 'bg-slate-100 border-slate-200'
        }`}>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'all'
                ? theme === 'dark' ? 'bg-[#2a2a2c] text-white shadow-sm' : 'bg-white text-slate-900 shadow-sm'
                : theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Holdings ({books.length})
          </button>

          <button
            onClick={() => setActiveTab('digital')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'digital'
                ? theme === 'dark' ? 'bg-[#2a2a2c] text-white shadow-sm' : 'bg-white text-slate-900 shadow-sm'
                : theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Digital E-Books ({digitalVolumes})
          </button>

          <button
            onClick={() => setActiveTab('physical')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'physical'
                ? theme === 'dark' ? 'bg-[#2a2a2c] text-white shadow-sm' : 'bg-white text-slate-900 shadow-sm'
                : theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Physical Stacks
          </button>

          <button
            onClick={() => setActiveTab('reserves')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'reserves'
                ? theme === 'dark' ? 'bg-[#2a2a2c] text-white shadow-sm' : 'bg-white text-slate-900 shadow-sm'
                : theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Course Reserves ({reservedCount})
          </button>
        </div>

        {/* Right side controls: Search, Dropdowns, View Switcher */}
        <div className="flex items-center gap-2.5 flex-wrap flex-1 md:flex-initial justify-end">
          {/* Live Search */}
          <div className="relative min-w-50 flex-1 sm:flex-initial">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search title, author, ISBN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-3 py-1.5 rounded-xl text-xs font-medium border focus:outline-none transition-colors ${
                theme === 'dark'
                  ? 'bg-[#131315] border-[#353437] text-white focus:border-[#d4af37]'
                  : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#996515]'
              }`}
            />
          </div>

          {/* Subject Dropdown */}
          <div className="relative">
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className={`appearance-none text-xs font-bold pl-3 pr-7 py-1.5 rounded-xl cursor-pointer border transition-colors ${
                theme === 'dark'
                  ? 'bg-[#2a2a2c] border-[#353437] text-white hover:bg-[#353437]'
                  : 'bg-slate-50 border-slate-300 text-slate-900 hover:bg-white'
              }`}
            >
              <option value="all">All Subjects</option>
              <option value="AP Physics C">AP Physics C</option>
              <option value="AP Calculus BC">AP Calculus BC</option>
              <option value="Quantum Mechanics">Quantum Mechanics</option>
              <option value="Computer Science">Computer Science</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
          </div>

          {/* Status Dropdown */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`appearance-none text-xs font-bold pl-3 pr-7 py-1.5 rounded-xl cursor-pointer border transition-colors ${
                theme === 'dark'
                  ? 'bg-[#2a2a2c] border-[#353437] text-white hover:bg-[#353437]'
                  : 'bg-slate-50 border-slate-300 text-slate-900 hover:bg-white'
              }`}
            >
              <option value="all">All Statuses</option>
              <option value="available">Available Now</option>
              <option value="borrowed">Borrowed / On Loan</option>
              <option value="reserved">Course Reserved</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
          </div>

          {/* Grid vs List toggle */}
          <div className={`flex items-center p-0.5 rounded-xl border ${
            theme === 'dark' ? 'bg-[#131315] border-[#353437]' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              onClick={() => setViewMode('grid')}
              title="Grid Catalog View"
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? theme === 'dark' ? 'bg-[#2a2a2c] text-[#d4af37]' : 'bg-white text-slate-900 shadow-sm'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              title="List Table View"
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? theme === 'dark' ? 'bg-[#2a2a2c] text-[#d4af37]' : 'bg-white text-slate-900 shadow-sm'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Books Grid or List View */}
      {filteredBooks.length === 0 ? (
        <div className={`p-12 rounded-2xl border text-center flex flex-col items-center justify-center gap-3 ${
          theme === 'dark' ? 'bg-[#1c1b1d] border-[#2a2a2c]' : 'bg-white border-slate-200'
        }`}>
          <SearchX className="w-10 h-10 text-slate-400" />
          <span className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            No library resources found
          </span>
          <p className="text-xs text-slate-500 max-w-sm">
            Try adjusting your search terms, changing the format filter, or uploading a new volume to the archive.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveTab('all');
              setSubjectFilter('all');
              setStatusFilter('all');
            }}
            className={`mt-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              theme === 'dark' ? 'bg-[#2a2a2c] text-[#d4af37] border-[#353437]' : 'bg-slate-100 text-slate-800 border-slate-300'
            }`}
          >
            Reset All Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredBooks.map((book) => {
            const isDigital = book.format.includes('Digital');
            const isBorrowed = book.status === 'borrowed';
            const isReserved = book.status === 'reserved';

            return (
              <div
                key={book.id}
                className={`p-5 rounded-2xl border flex flex-col justify-between transition-all group ${
                  theme === 'dark'
                    ? 'bg-[#1c1b1d] hover:bg-[#201f22] border-[#2a2a2c]'
                    : 'bg-[#ffffff] hover:bg-slate-50 border-slate-200 shadow-sm'
                }`}
              >
                {/* Book Header: Call Number, Category, and Status Text (Zero-pill) */}
                <div>
                  <div className="flex items-start justify-between gap-3 text-xs">
                    <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-slate-500 dark:text-gray-400">
                      <span>{book.callNumber}</span>
                      <span aria-hidden="true">·</span>
                      <span>{book.category}</span>
                    </div>

                    {/* Unboxed status text with indicator dot */}
                    <div className="flex items-center gap-1.5 shrink-0 text-xs font-bold">
                      {isBorrowed ? (
                        <span className="text-red-500 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                          On Loan
                        </span>
                      ) : isReserved ? (
                        <span className="text-amber-500 dark:text-amber-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          Cohort Reserve
                        </span>
                      ) : (
                        <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Available
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Author */}
                  <h3 className={`font-display font-bold text-base mt-2.5 transition-colors line-clamp-2 ${
                    theme === 'dark'
                      ? 'text-white group-hover:text-[#d4af37]'
                      : 'text-slate-900 group-hover:text-[#996515]'
                  }`}>
                    {book.title}
                  </h3>

                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-gray-400">
                    <span className="font-semibold text-slate-700 dark:text-gray-300">{book.author}</span>
                    <span aria-hidden="true">·</span>
                    <span>{book.publishYear}</span>
                    <span aria-hidden="true">·</span>
                    <span>{book.pages} pp</span>
                  </div>

                  {/* Synopsis Excerpt */}
                  <p className={`mt-3 text-xs leading-relaxed line-clamp-3 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-slate-600'
                  }`}>
                    {book.synopsis}
                  </p>

                  {/* Physical Shelf or Borrower Information */}
                  <div className={`mt-3.5 pt-3 border-t text-xs ${
                    theme === 'dark' ? 'border-[#2a2a2c] text-gray-400' : 'border-slate-100 text-slate-600'
                  }`}>
                    {isBorrowed && book.borrower ? (
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5 text-red-500 dark:text-red-400 font-semibold">
                          <span className="material-symbols-outlined text-sm">person</span>
                          <span>Borrowed by {book.borrower.scholarName} ({book.borrower.rollNumber})</span>
                        </div>
                        <span className="text-[11px] font-mono text-slate-400">
                          Due Date: {book.borrower.dueDate}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 font-mono text-[11px]">
                        <span className="material-symbols-outlined text-sm text-[#d4af37]">pin_drop</span>
                        <span className="truncate">{book.shelfLocation}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Actions Bar */}
                <div className={`mt-4 pt-3 border-t flex items-center justify-between gap-2 flex-wrap ${
                  theme === 'dark' ? 'border-[#2a2a2c]' : 'border-slate-100'
                }`}>
                  <div className="flex items-center gap-2">
                    {/* Read Digital Copy Button */}
                    {isDigital && (
                      <button
                        onClick={() => setReadingBook(book)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
                          theme === 'dark'
                            ? 'bg-[#d4af37] text-[#3c2f00] hover:bg-[#ffe088]'
                            : 'bg-[#996515] text-white hover:bg-[#7b4e00]'
                        }`}
                        title="Open interactive digital reader"
                      >
                        <span className="material-symbols-outlined text-sm">menu_book</span>
                        <span>Read Online</span>
                      </button>
                    )}

                    {/* Borrow / Return Button */}
                    {isBorrowed ? (
                      <button
                        onClick={() => handleReturnBook(book.id)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                          theme === 'dark'
                            ? 'bg-[#2a2a2c] hover:bg-[#353437] border-[#353437] text-emerald-400'
                            : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-300 text-emerald-900'
                        }`}
                        title="Mark as returned to stacks"
                      >
                        <span className="material-symbols-outlined text-sm">assignment_return</span>
                        <span>Check In</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setBorrowingBook(book)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                          theme === 'dark'
                            ? 'bg-[#2a2a2c] hover:bg-[#353437] border-[#353437] text-white'
                            : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800'
                        }`}
                        title="Assign checkout to scholar"
                      >
                        <span className="material-symbols-outlined text-sm">how_to_reg</span>
                        <span>Check Out</span>
                      </button>
                    )}
                  </div>

                  {/* Reserve / Download Toggle */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleReserve(book)}
                      title={isReserved ? 'Remove cohort reserve' : 'Reserve for active cohort'}
                      className={`p-1.5 rounded-lg transition-colors border ${
                        isReserved
                          ? theme === 'dark' ? 'bg-[#d4af37]/20 border-[#d4af37]/40 text-[#d4af37]' : 'bg-amber-100 border-amber-300 text-amber-900'
                          : theme === 'dark' ? 'border-transparent text-gray-400 hover:text-white hover:bg-[#2a2a2c]' : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <span className="material-symbols-outlined text-base">
                        {isReserved ? 'bookmark_added' : 'bookmark_add'}
                      </span>
                    </button>

                    {book.fileName && (
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setReadingBook(book);
                        }}
                        title={`Download ${book.fileName} (${book.fileSize || 'PDF'})`}
                        className={`p-1.5 rounded-lg transition-colors border ${
                          theme === 'dark'
                            ? 'border-transparent text-gray-400 hover:text-white hover:bg-[#2a2a2c]'
                            : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                      >
                        <span className="material-symbols-outlined text-base">download</span>
                      </a>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* List / Table Catalog View */
        <div className={`w-full rounded-2xl border overflow-hidden shadow-xl ${
          theme === 'dark' ? 'bg-[#1c1b1d] border-[#2a2a2c]' : 'bg-[#ffffff] border-slate-200'
        }`}>
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className={`text-[10px] font-bold uppercase tracking-wider ${
                  theme === 'dark' ? 'bg-[#2a2a2c]/60 text-gray-400' : 'bg-slate-100 text-slate-700'
                }`}>
                  <th className="py-3 px-5">Call No. / ISBN</th>
                  <th className="py-3 px-5">Title & Author</th>
                  <th className="py-3 px-5">Subject & Category</th>
                  <th className="py-3 px-5">Shelf Location</th>
                  <th className="py-3 px-5 text-center">Status</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-700/30' : 'divide-slate-200'}`}>
                {filteredBooks.map((book) => {
                  const isDigital = book.format.includes('Digital');
                  const isBorrowed = book.status === 'borrowed';
                  const isReserved = book.status === 'reserved';

                  return (
                    <tr
                      key={book.id}
                      className={`transition-colors ${
                        theme === 'dark' ? 'hover:bg-gray-500/10' : 'hover:bg-slate-50'
                      }`}
                    >
                      {/* 1. Call No / ISBN */}
                      <td className="py-3.5 px-5 font-mono text-[11px]">
                        <div className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                          {book.callNumber}
                        </div>
                        <span className="text-slate-400 text-[10px]">{book.isbn}</span>
                      </td>

                      {/* 2. Title & Author */}
                      <td className="py-3.5 px-5">
                        <div className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                          {book.title}
                        </div>
                        <div className="text-slate-500 dark:text-gray-400 text-[11px] font-medium mt-0.5">
                          {book.author} · {book.publishYear}
                        </div>
                      </td>

                      {/* 3. Subject & Category */}
                      <td className="py-3.5 px-5">
                        <div className={`font-semibold ${theme === 'dark' ? 'text-[#d4af37]' : 'text-[#855800]'}`}>
                          {book.subject}
                        </div>
                        <div className="text-slate-500 dark:text-gray-400 text-[11px]">
                          {book.category} · {book.format}
                        </div>
                      </td>

                      {/* 4. Shelf Location */}
                      <td className="py-3.5 px-5 font-mono text-[11px] text-slate-500 dark:text-gray-400">
                        {book.shelfLocation}
                      </td>

                      {/* 5. Status */}
                      <td className="py-3.5 px-5 text-center">
                        <div className="flex items-center justify-center gap-1.5 font-bold text-xs">
                          {isBorrowed ? (
                            <span className="text-red-500 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                              On Loan
                            </span>
                          ) : isReserved ? (
                            <span className="text-amber-500 dark:text-amber-400 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                              Reserve
                            </span>
                          ) : (
                            <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Available
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 6. Actions */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isDigital && (
                            <button
                              onClick={() => setReadingBook(book)}
                              className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all ${
                                theme === 'dark'
                                  ? 'bg-[#d4af37] text-[#3c2f00] hover:bg-[#ffe088]'
                                  : 'bg-[#996515] text-white hover:bg-[#7b4e00]'
                              }`}
                            >
                              Read
                            </button>
                          )}

                          {isBorrowed ? (
                            <button
                              onClick={() => handleReturnBook(book.id)}
                              className="px-2 py-1 rounded-lg text-xs font-bold text-emerald-500 hover:bg-emerald-500/10 border border-emerald-500/30"
                            >
                              Check In
                            </button>
                          ) : (
                            <button
                              onClick={() => setBorrowingBook(book)}
                              className={`px-2 py-1 rounded-lg text-xs font-bold transition-all border ${
                                theme === 'dark'
                                  ? 'bg-[#2a2a2c] text-gray-300 hover:text-white border-[#353437]'
                                  : 'bg-slate-100 text-slate-800 hover:bg-slate-200 border-slate-300'
                              }`}
                            >
                              Check Out
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: Digital Reader / Manuscript Viewer */}
      {readingBook && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setReadingBook(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-4xl max-h-[90vh] rounded-2xl flex flex-col shadow-2xl border overflow-hidden animate-in fade-in zoom-in-95 duration-200 ${
              theme === 'dark' ? 'bg-[#18181a] border-[#2a2a2c] text-[#e5e1e4]' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            {/* Modal Header */}
            <div className={`p-5 border-b flex items-center justify-between gap-4 ${
              theme === 'dark' ? 'bg-[#201f22] border-[#2a2a2c]' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-3 min-w-0">
                <span className="material-symbols-outlined text-[#d4af37] text-2xl shrink-0">menu_book</span>
                <div className="flex flex-col min-w-0">
                  <span className={`font-display font-bold text-base truncate ${
                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}>
                    {readingBook.title}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-gray-400 truncate">
                    {readingBook.author} · {readingBook.callNumber} · {readingBook.pages} Pages
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => alert(`Synchronized ${readingBook.title} with Class Syllabus.`)}
                  className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    theme === 'dark'
                      ? 'bg-[#2a2a2c] hover:bg-[#353437] border-[#353437] text-white'
                      : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm text-[#d4af37]">assignment</span>
                  <span>Assign to Class</span>
                </button>

                <button
                  onClick={() => setReadingBook(null)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    theme === 'dark'
                      ? 'text-gray-400 hover:text-white hover:bg-[#2a2a2c]'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
              </div>
            </div>

            {/* Modal Body / Reader View */}
            <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6 text-sm">
              <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                theme === 'dark' ? 'bg-[#201f22] border-[#353437]' : 'bg-amber-50/50 border-amber-200'
              }`}>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-gray-400">
                    Curricular Standard Alignment
                  </span>
                  <span className={`font-bold text-xs mt-0.5 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    {readingBook.subject} · {readingBook.level} Recommended Core Reference
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono">
                  <span>File: {readingBook.fileName || 'volume-spec.pdf'}</span>
                  <span>Size: {readingBook.fileSize || '18.4 MB'}</span>
                </div>
              </div>

              {/* Synopsis and Overview */}
              <div>
                <h4 className="font-display font-bold text-sm uppercase tracking-wider text-[#d4af37] mb-2">
                  Academic Synopsis & Abstract
                </h4>
                <p className={`leading-relaxed text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
                  {readingBook.synopsis}
                </p>
              </div>

              {/* Table of Contents Sample */}
              <div>
                <h4 className="font-display font-bold text-sm uppercase tracking-wider text-[#d4af37] mb-3">
                  Volume Table of Contents
                </h4>
                <div className={`divide-y rounded-xl border overflow-hidden ${
                  theme === 'dark' ? 'divide-[#2a2a2c] border-[#2a2a2c] bg-[#1c1b1d]' : 'divide-slate-200 border-slate-200 bg-white'
                }`}>
                  <div className="p-3 flex items-center justify-between text-xs hover:bg-amber-500/5 transition-colors cursor-pointer">
                    <span className="font-semibold">Chapter 01: Formal Foundations & Coordinate Systems</span>
                    <span className="font-mono text-slate-400">pp. 1–48</span>
                  </div>
                  <div className="p-3 flex items-center justify-between text-xs hover:bg-amber-500/5 transition-colors cursor-pointer">
                    <span className="font-semibold">Chapter 02: Variational Principles & Generalized Momenta</span>
                    <span className="font-mono text-slate-400">pp. 49–112</span>
                  </div>
                  <div className="p-3 flex items-center justify-between text-xs hover:bg-amber-500/5 transition-colors cursor-pointer">
                    <span className="font-semibold">Chapter 03: Oscillations, Resonance & Normal Modes</span>
                    <span className="font-mono text-slate-400">pp. 113–188</span>
                  </div>
                  <div className="p-3 flex items-center justify-between text-xs hover:bg-amber-500/5 transition-colors cursor-pointer">
                    <span className="font-semibold">Chapter 04: Rigid Body Kinematics & Euler Equations</span>
                    <span className="font-mono text-slate-400">pp. 189–274</span>
                  </div>
                  <div className="p-3 flex items-center justify-between text-xs hover:bg-amber-500/5 transition-colors cursor-pointer">
                    <span className="font-semibold">Chapter 05: Hamiltonian Dynamics & Canonical Transforms</span>
                    <span className="font-mono text-slate-400">pp. 275–380</span>
                  </div>
                </div>
              </div>

              {/* Digital Reader Note */}
              <div className={`p-4 rounded-xl border text-xs flex items-center gap-3 ${
                theme === 'dark' ? 'bg-[#201f22] border-[#2a2a2c] text-gray-400' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}>
                <span className="material-symbols-outlined text-[#d4af37] text-xl">verified_user</span>
                <span>
                  This digital masterwork is licensed under the Aetheria Institutional Library Covenant. Scholars in {selectedGrade} have simultaneous multi-reader clearance.
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className={`p-4 border-t flex items-center justify-between gap-3 text-xs ${
              theme === 'dark' ? 'bg-[#201f22] border-[#2a2a2c]' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className="font-mono text-[11px] text-slate-400">
                Shelf: {readingBook.shelfLocation}
              </span>
              <button
                onClick={() => setReadingBook(null)}
                className={`px-4 py-2 rounded-xl font-bold transition-all ${
                  theme === 'dark' ? 'bg-[#2a2a2c] hover:bg-[#353437] text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-900'
                }`}
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Check Out / Borrow Book to Scholar */}
      {borrowingBook && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setBorrowingBook(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-lg rounded-2xl flex flex-col shadow-2xl border overflow-hidden animate-in fade-in zoom-in-95 duration-200 ${
              theme === 'dark' ? 'bg-[#18181a] border-[#2a2a2c] text-[#e5e1e4]' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className={`p-5 border-b flex items-center justify-between ${
              theme === 'dark' ? 'bg-[#201f22] border-[#2a2a2c]' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#d4af37] text-xl">how_to_reg</span>
                <span className="font-display font-bold text-sm sm:text-base">
                  Assign Scholar Book Check-Out
                </span>
              </div>
              <button
                onClick={() => setBorrowingBook(null)}
                className="text-gray-400 hover:text-white"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4 text-xs">
              <div className={`p-3.5 rounded-xl border ${
                theme === 'dark' ? 'bg-[#201f22] border-[#353437]' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className="font-bold text-sm block mb-1 text-slate-900 dark:text-white">
                  {borrowingBook.title}
                </span>
                <span className="text-slate-500 dark:text-gray-400">
                  {borrowingBook.author} · Call No: {borrowingBook.callNumber}
                </span>
              </div>

              {/* Select Scholar */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-700 dark:text-gray-300">
                  Select Scholar from {selectedGrade} ({scholars.length} Enrolled):
                </label>
                <select
                  value={selectedBorrowerId}
                  onChange={(e) => setSelectedBorrowerId(e.target.value)}
                  className={`w-full p-2.5 rounded-xl font-bold text-xs border cursor-pointer focus:outline-none ${
                    theme === 'dark'
                      ? 'bg-[#2a2a2c] border-[#353437] text-white'
                      : 'bg-white border-slate-300 text-slate-900'
                  }`}
                >
                  {scholars.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.rollNumber} — {s.name} ({s.track})
                    </option>
                  ))}
                </select>
              </div>

              {/* Loan Duration */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-700 dark:text-gray-300">
                  Loan Period Duration:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[7, 14, 28].map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setLoanDurationDays(days)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        loanDurationDays === days
                          ? theme === 'dark' ? 'bg-[#d4af37] text-[#3c2f00] border-[#d4af37]' : 'bg-[#996515] text-white border-[#996515]'
                          : theme === 'dark' ? 'bg-[#2a2a2c] text-gray-300 border-[#353437]' : 'bg-slate-100 text-slate-700 border-slate-300'
                      }`}
                    >
                      {days} Days
                    </button>
                  ))}
                </div>
              </div>

              <div className={`p-3 rounded-xl border text-[11px] font-medium ${
                theme === 'dark' ? 'bg-[#201f22] border-[#2a2a2c] text-gray-400' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}>
                Due date will be logged in the faculty registrar ledger. An automated reminder is scheduled 48 hours prior to expiration.
              </div>
            </div>

            <div className={`p-4 border-t flex items-center justify-end gap-3 ${
              theme === 'dark' ? 'bg-[#201f22] border-[#2a2a2c]' : 'bg-slate-50 border-slate-200'
            }`}>
              <button
                type="button"
                onClick={() => setBorrowingBook(null)}
                className={`px-4 py-2 rounded-xl text-xs font-bold border ${
                  theme === 'dark' ? 'bg-[#2a2a2c] text-gray-300 border-[#353437]' : 'bg-white text-slate-800 border-slate-300'
                }`}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmBorrow}
                className={`px-5 py-2 rounded-xl text-xs font-bold shadow-md transition-all ${
                  theme === 'dark'
                    ? 'bg-[#d4af37] text-[#3c2f00] hover:bg-[#ffe088]'
                    : 'bg-[#996515] text-white hover:bg-[#7b4e00]'
                }`}
              >
                Confirm Loan & Generate Slip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Add / Upload New Book or Manuscript */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-xl max-h-[90vh] rounded-2xl flex flex-col shadow-2xl border overflow-hidden animate-in fade-in zoom-in-95 duration-200 ${
              theme === 'dark' ? 'bg-[#18181a] border-[#2a2a2c] text-[#e5e1e4]' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className={`p-5 border-b flex items-center justify-between ${
              theme === 'dark' ? 'bg-[#201f22] border-[#2a2a2c]' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#d4af37] text-xl">upload_file</span>
                <span className="font-display font-bold text-sm sm:text-base">
                  Deposit Academic Volume to Athenaeum
                </span>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateBook} className="p-6 overflow-y-auto flex-1 flex flex-col gap-4 text-xs">
              {/* File Upload Drop Zone (Direct File Manager Trigger) */}
              <div
                onClick={handleTriggerUpload}
                className={`p-4 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
                  uploadedFileName
                    ? theme === 'dark' ? 'border-[#d4af37] bg-[#d4af37]/10' : 'border-[#996515] bg-amber-50'
                    : theme === 'dark' ? 'border-gray-700 hover:border-[#d4af37] bg-[#201f22]' : 'border-slate-300 hover:border-[#996515] bg-slate-50'
                }`}
              >
                <span className="material-symbols-outlined text-2xl text-[#d4af37]">folder_open</span>
                <div className="text-center">
                  <span className={`font-bold block ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    {uploadedFileName ? `Attached: ${uploadedFileName} (${uploadedFileSize})` : 'Click to select e-book file from File Manager'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Supports PDF, EPUB, DJVU, DOCX (Up to 100 MB)
                  </span>
                </div>
              </div>

              {/* Title */}
              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-700 dark:text-gray-300">
                  Book / Manuscript Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Classical Mechanics: Variational Dynamics"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className={`p-2.5 rounded-xl border font-medium focus:outline-none ${
                    theme === 'dark' ? 'bg-[#2a2a2c] border-[#353437] text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              {/* Author & ISBN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-700 dark:text-gray-300">
                    Author(s) / Editors *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Prof. H. Goldstein"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    className={`p-2.5 rounded-xl border font-medium focus:outline-none ${
                      theme === 'dark' ? 'bg-[#2a2a2c] border-[#353437] text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-700 dark:text-gray-300">
                    ISBN or Archival ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 978-0201657029"
                    value={newIsbn}
                    onChange={(e) => setNewIsbn(e.target.value)}
                    className={`p-2.5 rounded-xl border font-medium focus:outline-none ${
                      theme === 'dark' ? 'bg-[#2a2a2c] border-[#353437] text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              {/* Subject & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-700 dark:text-gray-300">
                    Discipline / Subject
                  </label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className={`p-2.5 rounded-xl border font-bold cursor-pointer focus:outline-none ${
                      theme === 'dark' ? 'bg-[#2a2a2c] border-[#353437] text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="AP Physics C">AP Physics C</option>
                    <option value="AP Calculus BC">AP Calculus BC</option>
                    <option value="Quantum Mechanics">Quantum Mechanics</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="General Science">General Science</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-700 dark:text-gray-300">
                    Category Classification
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className={`p-2.5 rounded-xl border font-bold cursor-pointer focus:outline-none ${
                      theme === 'dark' ? 'bg-[#2a2a2c] border-[#353437] text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="Textbook">Textbook</option>
                    <option value="Reference">Reference</option>
                    <option value="Research Journal">Research Journal</option>
                    <option value="Past Paper">Past Paper</option>
                    <option value="Lab Manual">Lab Manual</option>
                    <option value="Thesis Archive">Thesis Archive</option>
                  </select>
                </div>
              </div>

              {/* Format & Shelf Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-700 dark:text-gray-300">
                    Format Medium
                  </label>
                  <select
                    value={newFormat}
                    onChange={(e) => setNewFormat(e.target.value as any)}
                    className={`p-2.5 rounded-xl border font-bold cursor-pointer focus:outline-none ${
                      theme === 'dark' ? 'bg-[#2a2a2c] border-[#353437] text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="Dual (Digital & Print)">Dual (Digital & Print)</option>
                    <option value="Digital E-Book">Digital E-Book</option>
                    <option value="Physical Hardcover">Physical Hardcover</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-700 dark:text-gray-300">
                    Physical Stacks Coordinates
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Wing B · Stacks 3 · Shelf 06"
                    value={newShelfLocation}
                    onChange={(e) => setNewShelfLocation(e.target.value)}
                    className={`p-2.5 rounded-xl border font-medium focus:outline-none ${
                      theme === 'dark' ? 'bg-[#2a2a2c] border-[#353437] text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              {/* Synopsis */}
              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-700 dark:text-gray-300">
                  Volume Synopsis / Curricular Scope
                </label>
                <textarea
                  rows={3}
                  placeholder="Outline topics covered, key formulas, target examination objectives..."
                  value={newSynopsis}
                  onChange={(e) => setNewSynopsis(e.target.value)}
                  className={`p-2.5 rounded-xl border font-medium focus:outline-none resize-none ${
                    theme === 'dark' ? 'bg-[#2a2a2c] border-[#353437] text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className={`p-4 border-t flex items-center justify-end gap-3 mt-2 ${
                theme === 'dark' ? 'border-[#2a2a2c]' : 'border-slate-100'
              }`}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border ${
                    theme === 'dark' ? 'bg-[#2a2a2c] text-gray-300 border-[#353437]' : 'bg-white text-slate-800 border-slate-300'
                  }`}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className={`px-5 py-2 rounded-xl text-xs font-bold shadow-md transition-all ${
                    theme === 'dark'
                      ? 'bg-[#d4af37] text-[#3c2f00] hover:bg-[#ffe088]'
                      : 'bg-[#996515] text-white hover:bg-[#7b4e00]'
                  }`}
                >
                  Deposit to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
