import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, ArrowRight } from 'lucide-react';

export interface DesignationItem {
  id: string;
  name: string;
  code: string;
  usernameInitials: string;
  levelLabel?: string;
}

export interface DepartmentItem {
  id: string;
  name: string;
  code: string;
  description: string;
}

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

export const DEPARTMENT_DESIGNATION_HIERARCHY: Record<string, DesignationItem[]> = {
  tpvd: [
    { id: 'tpvd_1', name: 'Chief Town Planner (CTP)', code: 'L1', usernameInitials: 'ctp', levelLabel: 'Level 1 · Head of Department' },
    { id: 'tpvd_2', name: 'Additional Chief Town Planner', code: 'L2', usernameInitials: 'actp', levelLabel: 'Level 2 · State HQ' },
    { id: 'tpvd_3', name: 'Senior Town Planner (Regional)', code: 'L3', usernameInitials: 'stp', levelLabel: 'Level 3 · Regional Zone' },
    { id: 'tpvd_4', name: 'Town Planner (District Branch)', code: 'L4', usernameInitials: 'tp', levelLabel: 'Level 4 · District Level' },
    { id: 'tpvd_5', name: 'Town Planning Officer (TPO)', code: 'L5', usernameInitials: 'tpo', levelLabel: 'Level 5 · Scheme Level' },
    { id: 'tpvd_6', name: 'Junior Town Planner / Planning Assistant', code: 'L6', usernameInitials: 'jtp', levelLabel: 'Level 6 · Field Unit' }
  ],
  gudc: [
    { id: 'gudc_1', name: 'Managing Director (MD), GUDC', code: 'L1', usernameInitials: 'md', levelLabel: 'Level 1 · Apex Executive' },
    { id: 'gudc_2', name: 'Joint Managing Director (JMD)', code: 'L2', usernameInitials: 'jmd', levelLabel: 'Level 2 · State HQ' },
    { id: 'gudc_3', name: 'Chief Engineer / VP (Technical)', code: 'L3', usernameInitials: 'ce', levelLabel: 'Level 3 · Engineering Head' },
    { id: 'gudc_4', name: 'General Manager (Projects)', code: 'L4', usernameInitials: 'gm', levelLabel: 'Level 4 · Project Wing' },
    { id: 'gudc_5', name: 'Project Manager (Divisional)', code: 'L5', usernameInitials: 'pm', levelLabel: 'Level 5 · Division' },
    { id: 'gudc_6', name: 'Assistant Project Engineer', code: 'L6', usernameInitials: 'ape', levelLabel: 'Level 6 · Site Execution' }
  ],
  gudm: [
    { id: 'gudm_1', name: 'Principal Secretary (UDUHD) & Chairman', code: 'L1', usernameInitials: 'ps', levelLabel: 'Level 1 · Department Head' },
    { id: 'gudm_2', name: 'Mission Director / CEO, GUDM', code: 'L2', usernameInitials: 'md', levelLabel: 'Level 2 · Mission Head' },
    { id: 'gudm_3', name: 'Additional Mission Director', code: 'L3', usernameInitials: 'amd', levelLabel: 'Level 3 · State Mission' },
    { id: 'gudm_4', name: 'Chief Engineer (GUDM)', code: 'L4', usernameInitials: 'ce', levelLabel: 'Level 4 · Technical Head' },
    { id: 'gudm_5', name: 'General Manager (Projects & Appraisal)', code: 'L5', usernameInitials: 'gm', levelLabel: 'Level 5 · Sector Cell' },
    { id: 'gudm_6', name: 'Zonal Project Officer / Nodal Engineer', code: 'L6', usernameInitials: 'zpo', levelLabel: 'Level 6 · Zonal Desk' }
  ],
  coma: [
    { id: 'coma_1', name: 'Commissioner of Municipalities Administration (CoMA)', code: 'L1', usernameInitials: 'coma', levelLabel: 'Level 1 · State Commissionerate' },
    { id: 'coma_2', name: 'Additional Commissioner of Municipalities', code: 'L2', usernameInitials: 'acm', levelLabel: 'Level 2 · State HQ' },
    { id: 'coma_3', name: 'Regional Commissioner of Municipalities (RCM)', code: 'L3', usernameInitials: 'rcm', levelLabel: 'Level 3 · Zonal Circle' },
    { id: 'coma_4', name: 'Municipal Commissioner / Chief Officer', code: 'L4', usernameInitials: 'mc', levelLabel: 'Level 4 · ULB Head' },
    { id: 'coma_5', name: 'Chief Engineer / Superintending Engineer', code: 'L5', usernameInitials: 'ce', levelLabel: 'Level 5 · Technical Wing' },
    { id: 'coma_6', name: 'Executive Engineer / Municipal Engineer', code: 'L6', usernameInitials: 'ee', levelLabel: 'Level 6 · Field Division' }
  ],
  gulm: [
    { id: 'gulm_1', name: 'Mission Director, GULM', code: 'L1', usernameInitials: 'md', levelLabel: 'Level 1 · Mission Head' },
    { id: 'gulm_2', name: 'Additional Mission Director', code: 'L2', usernameInitials: 'amd', levelLabel: 'Level 2 · State HQ' },
    { id: 'gulm_3', name: 'State Mission Manager (NULM)', code: 'L3', usernameInitials: 'smm', levelLabel: 'Level 3 · State Cell' },
    { id: 'gulm_4', name: 'City Mission Manager (ULB Level)', code: 'L4', usernameInitials: 'cmm', levelLabel: 'Level 4 · Municipal Unit' },
    { id: 'gulm_5', name: 'Community Organizer / Field Officer', code: 'L5', usernameInitials: 'co', levelLabel: 'Level 5 · Ward Field' }
  ],
  ghb: [
    { id: 'ghb_1', name: 'Housing Commissioner, GHB', code: 'L1', usernameInitials: 'hc', levelLabel: 'Level 1 · Board Head' },
    { id: 'ghb_2', name: 'Chief Engineer, GHB', code: 'L2', usernameInitials: 'ce', levelLabel: 'Level 2 · State HQ' },
    { id: 'ghb_3', name: 'Superintending Engineer (Housing Circle)', code: 'L3', usernameInitials: 'se', levelLabel: 'Level 3 · Circle Office' },
    { id: 'ghb_4', name: 'Executive Engineer (Housing Division)', code: 'L4', usernameInitials: 'ee', levelLabel: 'Level 4 · Division' },
    { id: 'ghb_5', name: 'Deputy Executive Engineer / Estate Manager', code: 'L5', usernameInitials: 'dee', levelLabel: 'Level 5 · Sub-Division' },
    { id: 'ghb_6', name: 'Assistant Engineer (Site)', code: 'L6', usernameInitials: 'ae', levelLabel: 'Level 6 · Site Unit' }
  ],
  ahm: [
    { id: 'ahm_1', name: 'Mission Director (Affordable Housing / PMAY-U)', code: 'L1', usernameInitials: 'md', levelLabel: 'Level 1 · Mission Head' },
    { id: 'ahm_2', name: 'Joint Director (Affordable Housing)', code: 'L2', usernameInitials: 'jd', levelLabel: 'Level 2 · State HQ' },
    { id: 'ahm_3', name: 'Chief Engineer (Housing Cell)', code: 'L3', usernameInitials: 'ce', levelLabel: 'Level 3 · Technical Cell' },
    { id: 'ahm_4', name: 'State Nodal Officer (PMAY-Urban)', code: 'L4', usernameInitials: 'sno', levelLabel: 'Level 4 · Appraisal Wing' },
    { id: 'ahm_5', name: 'Municipal Housing Engineer / Nodal Officer', code: 'L5', usernameInitials: 'mhe', levelLabel: 'Level 5 · ULB Cell' }
  ],
  sbmu: [
    { id: 'sbmu_1', name: 'Mission Director (Swachh Bharat Mission - Urban)', code: 'L1', usernameInitials: 'md', levelLabel: 'Level 1 · Mission Head' },
    { id: 'sbmu_2', name: 'Additional Mission Director (SBM-U)', code: 'L2', usernameInitials: 'amd', levelLabel: 'Level 2 · State HQ' },
    { id: 'sbmu_3', name: 'Superintending Engineer (SWM & Sanitation)', code: 'L3', usernameInitials: 'se', levelLabel: 'Level 3 · Technical Wing' },
    { id: 'sbmu_4', name: 'Executive Engineer (Solid Waste Management)', code: 'L4', usernameInitials: 'ee', levelLabel: 'Level 4 · Division' },
    { id: 'sbmu_5', name: 'ULB Sanitation Nodal / Health Officer', code: 'L5', usernameInitials: 'sho', levelLabel: 'Level 5 · Municipal Field' }
  ],
  gift: [
    { id: 'gift_1', name: 'Managing Director & Group CEO, GIFTCL', code: 'L1', usernameInitials: 'md', levelLabel: 'Level 1 · Apex Head' },
    { id: 'gift_2', name: 'Senior Vice President (Infrastructure)', code: 'L2', usernameInitials: 'svp', levelLabel: 'Level 2 · Infra Head' },
    { id: 'gift_3', name: 'Vice President (Urban Engineering & Utilities)', code: 'L3', usernameInitials: 'vp', levelLabel: 'Level 3 · Engineering' },
    { id: 'gift_4', name: 'Assistant Vice President (Projects)', code: 'L4', usernameInitials: 'avp', levelLabel: 'Level 4 · Project Management' },
    { id: 'gift_5', name: 'Senior Manager (Civil & Smart Infra)', code: 'L5', usernameInitials: 'sm', levelLabel: 'Level 5 · Site Execution' }
  ],
  gmrc: [
    { id: 'gmrc_1', name: 'Managing Director, GMRC', code: 'L1', usernameInitials: 'md', levelLabel: 'Level 1 · Corporation Head' },
    { id: 'gmrc_2', name: 'Director (Projects & Planning)', code: 'L2', usernameInitials: 'dpp', levelLabel: 'Level 2 · Board Director' },
    { id: 'gmrc_3', name: 'Chief General Manager (Civil / Track)', code: 'L3', usernameInitials: 'cgm', levelLabel: 'Level 3 · Corridor Head' },
    { id: 'gmrc_4', name: 'General Manager / Deputy General Manager', code: 'L4', usernameInitials: 'gm', levelLabel: 'Level 4 · Package Head' },
    { id: 'gmrc_5', name: 'Resident / Section Metro Engineer', code: 'L5', usernameInitials: 'rme', levelLabel: 'Level 5 · Site Section' }
  ],
  gsfps: [
    { id: 'gsfps_1', name: 'Director, Gujarat State Fire Prevention Services', code: 'L1', usernameInitials: 'dfps', levelLabel: 'Level 1 · State Director' },
    { id: 'gsfps_2', name: 'Joint / Deputy Director (Fire Services)', code: 'L2', usernameInitials: 'jdd', levelLabel: 'Level 2 · State HQ' },
    { id: 'gsfps_3', name: 'Regional Fire Officer (RFO)', code: 'L3', usernameInitials: 'rfo', levelLabel: 'Level 3 · Regional Zone' },
    { id: 'gsfps_4', name: 'Chief Fire Officer (CFO - Municipal)', code: 'L4', usernameInitials: 'cfo', levelLabel: 'Level 4 · ULB Fire Wing' },
    { id: 'gsfps_5', name: 'Divisional / Station Fire Officer', code: 'L5', usernameInitials: 'sfo', levelLabel: 'Level 5 · Station Level' }
  ],
  gmfb: [
    { id: 'gmfb_1', name: 'Chief Executive Officer (CEO), GMFB', code: 'L1', usernameInitials: 'ceo', levelLabel: 'Level 1 · Board Head' },
    { id: 'gmfb_2', name: 'Joint CEO (Grants & Municipal Finance)', code: 'L2', usernameInitials: 'jceo', levelLabel: 'Level 2 · State HQ' },
    { id: 'gmfb_3', name: 'Chief Accounts Officer / Financial Advisor', code: 'L3', usernameInitials: 'cao', levelLabel: 'Level 3 · Finance Wing' },
    { id: 'gmfb_4', name: 'Executive Engineer (Grant Appraisal)', code: 'L4', usernameInitials: 'ee', levelLabel: 'Level 4 · Technical Audit' },
    { id: 'gmfb_5', name: 'Zonal Grant Inspection Officer', code: 'L5', usernameInitials: 'zgio', levelLabel: 'Level 5 · Zonal Desk' }
  ]
};

export const DESIGNATIONS: DesignationItem[] = DEPARTMENT_DESIGNATION_HIERARCHY.coma;

interface DepartmentSelectionPageProps {
  onConfirm: (designation: string, department: string) => void;
  initialDesignation?: string;
  initialDepartment?: string;
}

export const DepartmentSelectionPage: React.FC<DepartmentSelectionPageProps> = ({
  onConfirm
}) => {
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentItem | null>(null);
  const [selectedDesignation, setSelectedDesignation] = useState<DesignationItem | null>(null);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('1111');
  const [authError, setAuthError] = useState<string>('');

  const [isDepartmentOpen, setIsDepartmentOpen] = useState(false);
  const [isDesignationOpen, setIsDesignationOpen] = useState(false);

  const departmentDropdownRef = useRef<HTMLDivElement>(null);
  const designationDropdownRef = useRef<HTMLDivElement>(null);

  const availableDesignations: DesignationItem[] = selectedDepartment
    ? DEPARTMENT_DESIGNATION_HIERARCHY[selectedDepartment.id] || []
    : [];

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        departmentDropdownRef.current &&
        !departmentDropdownRef.current.contains(event.target as Node)
      ) {
        setIsDepartmentOpen(false);
      }
      if (
        designationDropdownRef.current &&
        !designationDropdownRef.current.contains(event.target as Node)
      ) {
        setIsDesignationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectDepartment = (dept: DepartmentItem) => {
    if (selectedDepartment?.id !== dept.id) {
      setSelectedDesignation(null);
      setUsername('');
    }
    setSelectedDepartment(dept);
    setIsDepartmentOpen(false);
  };

  const handleSelectDesignation = (desig: DesignationItem) => {
    setSelectedDesignation(desig);
    setUsername(desig.usernameInitials);
    setAuthError('');
    setIsDesignationOpen(false);
  };

  const handleContinue = () => {
    if (!selectedDepartment || !selectedDesignation) return;
    const expectedUser = selectedDesignation.usernameInitials.toLowerCase();
    const enteredUser = username.trim().toLowerCase();
    if ((enteredUser !== expectedUser && enteredUser !== 'abhishek') || password !== '1111') {
      setAuthError('Invalid credentials. Please enter the authorized username and password.');
      return;
    }
    setAuthError('');
    onConfirm(selectedDesignation.name, selectedDepartment.name);
  };

  const [emblemError, setEmblemError] = useState(false);

  const canContinue = Boolean(
    selectedDepartment && selectedDesignation && username.trim().length > 0 && password.length > 0
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
                33 Districts &bull; 17 Municipal Corporations &bull; 152 Municipalities
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT HALF: Centered in the Right 50% of the Screen */}
        <div className="w-full flex flex-col items-center justify-center px-6 py-8 md:px-12">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6">
              <div className="mb-4">
                <h2 className="text-base sm:text-lg font-bold text-[#0E355C] tracking-tight">
                  Department &amp; Officer Designation
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select your department first, then choose your designation from its hierarchy
                </p>
              </div>

              {/* Department First, Then Designation Dropdown Boxes */}
              <div className="space-y-3">
                {/* Box 1: Department Dropdown */}
                <div ref={departmentDropdownRef} className="relative w-full">
                  <button
                    type="button"
                    onClick={() => {
                      setIsDepartmentOpen(!isDepartmentOpen);
                      setIsDesignationOpen(false);
                    }}
                    className={`w-full h-12 px-3.5 rounded-xl border flex items-center justify-between text-left transition-all duration-200 cursor-pointer ${
                      isDepartmentOpen
                        ? 'border-[#0E355C] bg-blue-50/30 ring-2 ring-[#0E355C]/15 shadow-xs'
                        : selectedDepartment
                        ? 'border-slate-300 bg-white text-slate-900 hover:border-[#0E355C]/60'
                        : 'border-slate-200 bg-slate-50/70 text-slate-500 hover:border-slate-300 hover:bg-white'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <span className="block text-[9px] uppercase font-bold tracking-wider text-slate-500">
                        Department
                      </span>
                      <span
                        className={`text-xs sm:text-sm font-semibold truncate block ${
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
                    <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden max-h-52 overflow-y-auto">
                      <div className="p-1.5 space-y-0.5">
                        {DEPARTMENTS.map(dept => {
                          const isSelected = selectedDepartment?.id === dept.id;
                          return (
                            <button
                              key={dept.id}
                              type="button"
                              onClick={() => handleSelectDepartment(dept)}
                              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                                isSelected
                                  ? 'bg-blue-50 text-[#0E355C] font-bold'
                                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                              }`}
                            >
                              <div className="truncate mr-2">
                                <span className="font-semibold text-[#0E355C]">
                                  {dept.description}
                                </span>
                              </div>
                              {isSelected && (
                                <Check className="w-3.5 h-3.5 text-[#0E355C] shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Box 2: Designation Dropdown (Populated by Selected Department's Hierarchy) */}
                <div ref={designationDropdownRef} className="relative w-full">
                  <button
                    type="button"
                    disabled={!selectedDepartment}
                    onClick={() => {
                      if (!selectedDepartment) return;
                      setIsDesignationOpen(!isDesignationOpen);
                      setIsDepartmentOpen(false);
                    }}
                    className={`w-full h-12 px-3.5 rounded-xl border flex items-center justify-between text-left transition-all duration-200 ${
                      !selectedDepartment
                        ? 'border-slate-200 bg-slate-100/70 text-slate-400 cursor-not-allowed'
                        : isDesignationOpen
                        ? 'border-[#0E355C] bg-blue-50/30 ring-2 ring-[#0E355C]/15 shadow-xs cursor-pointer'
                        : selectedDesignation
                        ? 'border-slate-300 bg-white text-slate-900 hover:border-[#0E355C]/60 cursor-pointer'
                        : 'border-slate-200 bg-slate-50/70 text-slate-500 hover:border-slate-300 hover:bg-white cursor-pointer'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <span className="block text-[9px] uppercase font-bold tracking-wider text-slate-500">
                        Designation
                      </span>
                      <span
                        className={`text-xs sm:text-sm font-semibold truncate block ${
                          selectedDesignation ? 'text-[#0E355C]' : 'text-slate-400'
                        }`}
                      >
                        {selectedDesignation
                          ? selectedDesignation.name
                          : selectedDepartment
                          ? 'Select Designation'
                          : 'Select Department First'}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${
                        isDesignationOpen ? 'rotate-180 text-[#0E355C]' : ''
                      }`}
                    />
                  </button>

                  {/* Department-Specific Designation Hierarchy Menu */}
                  {isDesignationOpen && selectedDepartment && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden max-h-56 overflow-y-auto">
                      <div className="p-1.5 space-y-0.5">
                        {availableDesignations.map(desig => {
                          const isSelected = selectedDesignation?.id === desig.id;
                          return (
                            <button
                              key={desig.id}
                              type="button"
                              onClick={() => handleSelectDesignation(desig)}
                              className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between cursor-pointer ${
                                isSelected
                                  ? 'bg-blue-50 text-[#0E355C] font-bold'
                                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                              }`}
                            >
                              <div className="min-w-0 pr-2">
                                <div className="font-semibold text-[#0E355C] truncate">
                                  {desig.name}
                                </div>
                              </div>
                              {isSelected && (
                                <Check className="w-3.5 h-3.5 text-[#0E355C] shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Outside of the Box: Username & Password Row (appears once Department & Designation are selected) */}
            {selectedDepartment && selectedDesignation && (
              <div className="mt-4">
                <div className="grid grid-cols-2 gap-3">
                  {/* Column 1: Username */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1 pl-1">
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
                      className={`w-full h-10 px-3.5 rounded-xl border bg-white text-xs sm:text-sm font-normal text-slate-400 placeholder:text-slate-300 shadow-2xs focus:outline-none transition-all ${
                        authError
                          ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15'
                          : 'border-slate-300 focus:border-[#0E355C] focus:ring-2 focus:ring-[#0E355C]/15'
                      }`}
                    />
                  </div>

                  {/* Column 2: Password */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1 pl-1">
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
                      className={`w-full h-10 px-3.5 rounded-xl border bg-white text-xs sm:text-sm font-normal text-slate-400 placeholder:text-slate-300 shadow-2xs focus:outline-none transition-all ${
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
            <div className="mt-4">
              <button
                type="button"
                onClick={handleContinue}
                disabled={!canContinue}
                className={`w-full h-10 px-6 rounded-xl font-semibold text-xs sm:text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 ${
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
