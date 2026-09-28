import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, ArrowRight } from 'lucide-react';

export interface DesignationItem {
  id: string;
  name: string;
  code: string;
}

export interface DepartmentItem {
  id: string;
  name: string;
  code: string;
  description: string;
}

export const DESIGNATIONS: DesignationItem[] = [
  { id: 'uduhd', name: 'UDUHD Official', code: 'UDUHD' },
  { id: 'state', name: 'State Office', code: 'STATE' },
  { id: 'district', name: 'District office', code: 'DISTRICT' },
  { id: 'block', name: 'Block Office', code: 'BLOCK' }
];

export const DEPARTMENTS: DepartmentItem[] = [
  {
    id: 'tpvd',
    code: 'TPVD',
    name: 'TPVD',
    description: 'Town Planning & Valuation Department (TPVD)'
  },
  {
    id: 'gudc',
    code: 'GUDC',
    name: 'GUDC',
    description: 'Gujarat Urban Development Company (GUDC)'
  },
  {
    id: 'gudm',
    code: 'GUDM',
    name: 'GUDM',
    description: 'Gujarat Urban Development Mission (GUDM)'
  },
  {
    id: 'coma',
    code: 'CoMA',
    name: 'CoMA',
    description: 'Commissioner of Municipalities Administration (CoMA)'
  },
  {
    id: 'gulm',
    code: 'GULM',
    name: 'GULM',
    description: 'Gujarat Urban Livelihood Mission (GULM)'
  },
  {
    id: 'ghb',
    code: 'GHB',
    name: 'GHB',
    description: 'Gujarat Housing Board (GHB)'
  },
  {
    id: 'ahm',
    code: 'AHM',
    name: 'AHM',
    description: 'Affordable Housing Mission (AHM)'
  },
  {
    id: 'sbmu',
    code: 'SBM-U',
    name: 'SBM-U',
    description: 'Swachh Bharat Mission Urban Gujarat'
  },
  {
    id: 'gift',
    code: 'GIFT',
    name: 'GIFT',
    description: 'Gujarat International Finance Tec-City (GIFT)'
  },
  {
    id: 'gmrc',
    code: 'GMRC',
    name: 'GMRC',
    description: 'Gujarat Metro Rail Corporation (GMRC) Limited'
  },
  {
    id: 'gsfps',
    code: 'GSFPS',
    name: 'GSFPS',
    description: 'Gujarat State Fire Prevention Service (GSFPS)'
  },
  {
    id: 'gmfb',
    code: 'GMFB',
    name: 'GMFB',
    description: 'Gujarat Municipal Finance Board (GMFB)'
  }
];

interface DepartmentSelectionPageProps {
  onConfirm: (designation: string, department: string) => void;
  initialDesignation?: string;
  initialDepartment?: string;
}

export const DepartmentSelectionPage: React.FC<DepartmentSelectionPageProps> = ({
  onConfirm,
  initialDesignation,
  initialDepartment
}) => {
  // By default designation and department have no input, let user select from dropdown
  const [selectedDesignation, setSelectedDesignation] = useState<DesignationItem | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentItem | null>(null);
  const [username, setUsername] = useState<string>('abhishek');
  const [password, setPassword] = useState<string>('1111');
  const [authError, setAuthError] = useState<string>('');

  const [isDesignationOpen, setIsDesignationOpen] = useState(false);
  const [isDepartmentOpen, setIsDepartmentOpen] = useState(false);

  const designationDropdownRef = useRef<HTMLDivElement>(null);
  const departmentDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        designationDropdownRef.current &&
        !designationDropdownRef.current.contains(event.target as Node)
      ) {
        setIsDesignationOpen(false);
      }
      if (
        departmentDropdownRef.current &&
        !departmentDropdownRef.current.contains(event.target as Node)
      ) {
        setIsDepartmentOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectDesignation = (desig: DesignationItem) => {
    setSelectedDesignation(desig);
    setIsDesignationOpen(false);
  };

  const handleSelectDepartment = (dept: DepartmentItem) => {
    setSelectedDepartment(dept);
    setIsDepartmentOpen(false);
  };

  const handleContinue = () => {
    if (!selectedDesignation || !selectedDepartment) return;
    if (username.trim().toLowerCase() !== 'abhishek' || password !== '1111') {
      setAuthError('Invalid credentials. Please enter the authorized username and password.');
      return;
    }
    setAuthError('');
    onConfirm(selectedDesignation.name, selectedDepartment.name);
  };

  const [emblemError, setEmblemError] = useState(false);

  const canContinue = Boolean(
    selectedDesignation && selectedDepartment && username.trim().length > 0 && password.length > 0
  );

  return (
    <div className="min-h-screen w-full bg-[#F4F7FA] flex flex-col justify-between text-slate-900 font-sans select-none">
      {/* Top Official Government Accent Strip */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#0E355C] via-blue-700 to-amber-500" />

      {/* Main Full-Width 50/50 Split: Left Side (Centered in Left Half) | Right Side (Centered in Right Half) */}
      <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2">
        {/* LEFT HALF: Centered in the Left 50% of the Screen */}
        <div className="w-full flex flex-col items-center justify-center text-center px-6 py-10 md:px-12 border-b md:border-b-0 md:border-r border-slate-200/90">
          <div className="max-w-lg w-full flex flex-col items-center justify-center text-center space-y-4">
            {/* State Emblem of India */}
            <div className="w-24 h-28 sm:w-28 sm:h-32 flex items-center justify-center">
              {!emblemError ? (
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
                  alt="State Emblem of India"
                  className="h-full w-auto object-contain"
                  onError={() => setEmblemError(true)}
                />
              ) : (
                <svg
                  viewBox="0 0 120 145"
                  className="h-full w-auto"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-label="State Emblem of India"
                >
                  <path d="M52 24C52 17 68 17 68 24V44H52V24Z" fill="#0E355C" />
                  <path
                    d="M36 34C36 27 50 28 50 36V58H36V34ZM70 36C70 28 84 27 84 34V58H70V36Z"
                    fill="#0E355C"
                  />
                  <rect x="38" y="56" width="44" height="26" rx="3" fill="#0E355C" />
                  <rect x="28" y="82" width="64" height="16" rx="2" fill="#0E355C" />
                  <circle cx="60" cy="90" r="6" stroke="#F8FAFC" strokeWidth="1.8" />
                  <circle cx="60" cy="90" r="1.5" fill="#F8FAFC" />
                  <path d="M32 98L26 114H94L88 98H32Z" fill="#0E355C" />
                  <text
                    x="60"
                    y="130"
                    textAnchor="middle"
                    fill="#0E355C"
                    fontSize="11"
                    fontWeight="700"
                  >
                    सत्यमेव जयते
                  </text>
                </svg>
              )}
            </div>

            {/* Center-Aligned Government of Gujarat & Department Full Title */}
            <div className="space-y-2">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-700 block">
                Government of Gujarat
              </span>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0E355C] tracking-tight leading-snug">
                Urban Development &amp; Urban Housing Department
              </h1>
              <p className="text-sm sm:text-base font-semibold text-slate-700">
                Project Lifecycle Management System (PLMS)
              </p>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed pt-1">
                33 Districts &bull; 17 Municipal Corporations &bull; 157 Municipalities
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT HALF: Centered in the Right 50% of the Screen */}
        <div className="w-full flex flex-col items-center justify-center px-6 py-10 md:px-12">
          <div className="w-full max-w-lg">
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
              <div className="mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-[#0E355C] tracking-tight">
                  Officer Designation &amp; Department
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Select your designation and department from the dropdowns below to proceed
                </p>
              </div>

              {/* Designation and Department Dropdown Boxes */}
              <div className="space-y-4">
                {/* Box 1: Designation Dropdown */}
                <div ref={designationDropdownRef} className="relative w-full">
                  <button
                    type="button"
                    onClick={() => {
                      setIsDesignationOpen(!isDesignationOpen);
                      setIsDepartmentOpen(false);
                    }}
                    className={`w-full h-14 px-4 rounded-xl border flex items-center justify-between text-left transition-all duration-200 cursor-pointer ${
                      isDesignationOpen
                        ? 'border-[#0E355C] bg-blue-50/30 ring-2 ring-[#0E355C]/15 shadow-xs'
                        : selectedDesignation
                        ? 'border-slate-300 bg-white text-slate-900 hover:border-[#0E355C]/60'
                        : 'border-slate-200 bg-slate-50/70 text-slate-500 hover:border-slate-300 hover:bg-white'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-500">
                        Designation
                      </span>
                      <span
                        className={`text-sm font-semibold truncate block ${
                          selectedDesignation ? 'text-[#0E355C]' : 'text-slate-400'
                        }`}
                      >
                        {selectedDesignation ? selectedDesignation.name : 'Select Designation'}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${
                        isDesignationOpen ? 'rotate-180 text-[#0E355C]' : ''
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isDesignationOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden max-h-48 overflow-y-auto">
                      <div className="p-1.5 space-y-0.5">
                        {DESIGNATIONS.map(desig => {
                          const isSelected = selectedDesignation?.id === desig.id;
                          return (
                            <button
                              key={desig.id}
                              type="button"
                              onClick={() => handleSelectDesignation(desig)}
                              className={`w-full text-left px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center justify-between cursor-pointer ${
                                isSelected
                                  ? 'bg-blue-50 text-[#0E355C] font-bold'
                                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                              }`}
                            >
                              <span className="truncate mr-2">{desig.name}</span>
                              {isSelected && <Check className="w-4 h-4 text-[#0E355C] shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Box 2: Department Dropdown */}
                <div ref={departmentDropdownRef} className="relative w-full">
                  <button
                    type="button"
                    onClick={() => {
                      setIsDepartmentOpen(!isDepartmentOpen);
                      setIsDesignationOpen(false);
                    }}
                    className={`w-full h-14 px-4 rounded-xl border flex items-center justify-between text-left transition-all duration-200 cursor-pointer ${
                      isDepartmentOpen
                        ? 'border-[#0E355C] bg-blue-50/30 ring-2 ring-[#0E355C]/15 shadow-xs'
                        : selectedDepartment
                        ? 'border-slate-300 bg-white text-slate-900 hover:border-[#0E355C]/60'
                        : 'border-slate-200 bg-slate-50/70 text-slate-500 hover:border-slate-300 hover:bg-white'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-500">
                        Department
                      </span>
                      <span
                        className={`text-sm font-semibold truncate block ${
                          selectedDepartment ? 'text-[#0E355C]' : 'text-slate-400'
                        }`}
                      >
                        {selectedDepartment
                          ? selectedDepartment.description
                          : 'Select Department'}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${
                        isDepartmentOpen ? 'rotate-180 text-[#0E355C]' : ''
                      }`}
                    />
                  </button>

                  {/* Department Dropdown Menu */}
                  {isDepartmentOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden max-h-48 overflow-y-auto">
                      <div className="p-1.5 space-y-0.5">
                        {DEPARTMENTS.map(dept => {
                          const isSelected = selectedDepartment?.id === dept.id;
                          return (
                            <button
                              key={dept.id}
                              type="button"
                              onClick={() => handleSelectDepartment(dept)}
                              className={`w-full text-left px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center justify-between cursor-pointer ${
                                isSelected
                                  ? 'bg-blue-50 text-[#0E355C] font-bold'
                                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                              }`}
                            >
                              <div className="truncate mr-2">
                                <span className="font-semibold text-[#0E355C]">{dept.description}</span>
                              </div>
                              {isSelected && <Check className="w-4 h-4 text-[#0E355C] shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Outside of the Box: Username & Password Row (appears once Department is selected) */}
            {selectedDepartment && (
              <div className="mt-5">
                <div className="grid grid-cols-2 gap-4">
                  {/* Column 1: Username */}
                  <div>
                    <label className="block text-xs font-bold text-[#0E355C] mb-1.5 pl-1">
                      Username
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={e => {
                        setUsername(e.target.value);
                        if (authError) setAuthError('');
                      }}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && canContinue) {
                          handleContinue();
                        }
                      }}
                      placeholder="Enter Username"
                      className={`w-full h-12 px-4 rounded-xl border bg-white text-sm font-semibold text-[#0E355C] placeholder:text-slate-400 placeholder:font-normal shadow-2xs focus:outline-none transition-all ${
                        authError
                          ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15'
                          : 'border-slate-300 focus:border-[#0E355C] focus:ring-2 focus:ring-[#0E355C]/15'
                      }`}
                    />
                  </div>

                  {/* Column 2: Password */}
                  <div>
                    <label className="block text-xs font-bold text-[#0E355C] mb-1.5 pl-1">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={e => {
                        setPassword(e.target.value);
                        if (authError) setAuthError('');
                      }}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && canContinue) {
                          handleContinue();
                        }
                      }}
                      placeholder="Enter Password"
                      className={`w-full h-12 px-4 rounded-xl border bg-white text-sm font-semibold text-[#0E355C] placeholder:text-slate-400 placeholder:font-normal shadow-2xs focus:outline-none transition-all ${
                        authError
                          ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15'
                          : 'border-slate-300 focus:border-[#0E355C] focus:ring-2 focus:ring-[#0E355C]/15'
                      }`}
                    />
                  </div>
                </div>

                {authError && (
                  <p className="mt-2 text-xs font-semibold text-rose-600 pl-1">
                    {authError}
                  </p>
                )}
              </div>
            )}

            {/* Submit / Continue Button */}
            <div className="mt-5">
              <button
                type="button"
                onClick={handleContinue}
                disabled={!canContinue}
                className={`w-full h-11 px-8 rounded-xl font-semibold text-xs sm:text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 ${
                  canContinue
                    ? 'bg-[#0E355C] text-white hover:bg-[#092644] shadow-sm cursor-pointer'
                    : 'bg-slate-200/80 text-slate-400 border border-slate-300/80 cursor-not-allowed'
                }`}
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Official Footer */}
      <footer className="bg-white border-t border-slate-200 py-3 px-6 text-center text-xs text-slate-500">
        Urban Development &amp; Urban Housing Department, Government of Gujarat
      </footer>
    </div>
  );
};
