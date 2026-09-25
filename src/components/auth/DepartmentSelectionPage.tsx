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
  { id: 'uduhd', name: 'UDUHD official', code: 'UDUHD' },
  { id: 'nodal', name: 'Nodal Officer', code: 'NODAL' },
  { id: 'state', name: 'State Office', code: 'STATE' },
  { id: 'district', name: 'District office', code: 'DISTRICT' },
  { id: 'block', name: 'Block Office', code: 'BLOCK' }
];

export const DEPARTMENTS: DepartmentItem[] = [
  { id: 'gudm', code: 'GUDM', name: 'GUDM', description: 'Gujarat Urban Development Mission' },
  { id: 'tpvd', code: 'TPVD', name: 'TPVD', description: 'Town Planning & Valuation Department' },
  { id: 'gmrc', code: 'GMRC', name: 'GMRC', description: 'Gujarat Metro Rail Corporation' },
  { id: 'gudc', code: 'GUDC', name: 'GUDC', description: 'Gujarat Urban Development Company' },
  { id: 'dom', code: 'DoM', name: 'DoM', description: 'Directorate of Municipalities' },
  { id: 'gwssb', code: 'GWSSB', name: 'GWSSB', description: 'Gujarat Water Supply & Sewerage Board' },
  { id: 'gwil', code: 'GWIL', name: 'GWIL', description: 'Gujarat Water Infrastructure Limited' },
  { id: 'ghb', code: 'GHB', name: 'GHB', description: 'Gujarat Housing Board' }
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
    if (selectedDesignation && selectedDepartment) {
      onConfirm(selectedDesignation.name, selectedDepartment.name);
    }
  };

  const canContinue = Boolean(selectedDesignation && selectedDepartment);

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-100 font-sans select-none">
      {/* Centered Minimal Box Container: Screen is otherwise clean and blank */}
      <div className="w-full max-w-2xl">
        {/* Two Adjacent Dropdown Boxes: Designation and Department */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
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
                  ? 'border-slate-500 bg-slate-900 ring-2 ring-slate-700/60 shadow-lg'
                  : selectedDesignation
                  ? 'border-slate-700 bg-slate-900/90 text-white hover:border-slate-600'
                  : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700 hover:bg-slate-900/80'
              }`}
            >
              <div className="truncate pr-2">
                <span className="block text-[10px] uppercase font-semibold tracking-wider text-slate-500">
                  Designation
                </span>
                <span
                  className={`text-sm font-medium truncate block ${
                    selectedDesignation ? 'text-white' : 'text-slate-400'
                  }`}
                >
                  {selectedDesignation ? selectedDesignation.name : 'Select Designation'}
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                  isDesignationOpen ? 'rotate-180 text-white' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu - only appears when opened */}
            {isDesignationOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden max-h-72 overflow-y-auto">
                <div className="p-1.5 space-y-0.5">
                  {DESIGNATIONS.map(desig => {
                    const isSelected = selectedDesignation?.id === desig.id;
                    return (
                      <button
                        key={desig.id}
                        type="button"
                        onClick={() => handleSelectDesignation(desig)}
                        className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-slate-800 text-white font-semibold'
                            : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                        }`}
                      >
                        <span className="truncate mr-2">{desig.name}</span>
                        {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
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
                  ? 'border-slate-500 bg-slate-900 ring-2 ring-slate-700/60 shadow-lg'
                  : selectedDepartment
                  ? 'border-slate-700 bg-slate-900/90 text-white hover:border-slate-600'
                  : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700 hover:bg-slate-900/80'
              }`}
            >
              <div className="truncate pr-2">
                <span className="block text-[10px] uppercase font-semibold tracking-wider text-slate-500">
                  Department
                </span>
                <span
                  className={`text-sm font-medium truncate block ${
                    selectedDepartment ? 'text-white' : 'text-slate-400'
                  }`}
                >
                  {selectedDepartment
                    ? `${selectedDepartment.name} - ${selectedDepartment.description}`
                    : 'Select Department'}
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                  isDepartmentOpen ? 'rotate-180 text-white' : ''
                }`}
              />
            </button>

            {/* Department Dropdown Menu - only appears when opened */}
            {isDepartmentOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden max-h-72 overflow-y-auto">
                <div className="p-1.5 space-y-0.5">
                  {DEPARTMENTS.map(dept => {
                    const isSelected = selectedDepartment?.id === dept.id;
                    return (
                      <button
                        key={dept.id}
                        type="button"
                        onClick={() => handleSelectDepartment(dept)}
                        className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-slate-800 text-white font-semibold'
                            : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                        }`}
                      >
                        <div className="truncate mr-2">
                          <span className="font-bold text-white mr-1.5">{dept.name}</span>
                          <span className="text-slate-400 text-xs">({dept.description})</span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Minimal Submit / Continue Button - cleanly displayed below the boxes */}
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={handleContinue}
            disabled={!canContinue}
            className={`h-11 px-7 rounded-xl font-semibold text-xs sm:text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 ${
              canContinue
                ? 'bg-white text-slate-950 hover:bg-slate-200 shadow-lg cursor-pointer'
                : 'bg-slate-900 text-slate-600 border border-slate-800/80 cursor-not-allowed opacity-50'
            }`}
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
