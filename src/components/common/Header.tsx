import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Check,
  AlertTriangle,
  ChevronDown,
  Lock,
  ArrowLeft
} from 'lucide-react';
import { DESIGNATIONS, DEPARTMENTS } from '../auth/DepartmentSelectionPage';

interface HeaderProps {
  onLock?: () => void;
  onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLock, onBack }) => {
  const {
    fiscalYear,
    setFiscalYear,
    notifications,
    markNotificationRead,
    setCurrentNav,
    selectedDesignation,
    setSelectedDesignation,
    selectedDepartment,
    setSelectedDepartment,
    setCurrentRole
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [isDesignationOpen, setIsDesignationOpen] = useState(false);
  const [isDepartmentOpen, setIsDepartmentOpen] = useState(false);

  const designationDropdownRef = useRef<HTMLDivElement>(null);
  const departmentDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
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

  const handleSelectDesignation = (name: string) => {
    setSelectedDesignation(name);
    try {
      sessionStorage.setItem('gudm_plms_designation', name);
    } catch {
      // ignore
    }
    // Sync corresponding role
    if (name.toLowerCase().includes('uduhd') || name.toLowerCase().includes('udhdd')) {
      setCurrentRole('Super Administrator');
    } else if (name.toLowerCase().includes('nodal')) {
      setCurrentRole('Mission Director');
    } else if (name.toLowerCase().includes('state')) {
      setCurrentRole('Chief Engineer');
    } else if (name.toLowerCase().includes('district')) {
      setCurrentRole('Project Manager');
    } else if (name.toLowerCase().includes('block')) {
      setCurrentRole('Engineering Officer');
    }
    setIsDesignationOpen(false);
  };

  const handleSelectDepartment = (name: string) => {
    setSelectedDepartment(name);
    try {
      sessionStorage.setItem('gudm_plms_department', name);
    } catch {
      // ignore
    }
    setIsDepartmentOpen(false);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Government Bar */}
      <div className="bg-[#0b2b4d] text-slate-200 text-xs px-4 py-1 flex items-center justify-between border-b border-[#071f38]">
        {/* Back and Lock symbols on the far left corner */}
        <div className="flex items-center space-x-2">
          {onBack && (
            <button
              onClick={onBack}
              title="Back to Department Selection"
              aria-label="Back to Department Selection"
              className="flex items-center space-x-1 px-1.5 py-0.5 rounded text-slate-300 hover:text-white hover:bg-[#123e6b]/70 transition-colors text-[11px] font-medium cursor-pointer"
            >
              <ArrowLeft className="w-3 h-3 stroke-[2]" />
              <span>Back</span>
            </button>
          )}
          {onLock && (
            <button
              onClick={onLock}
              title="Lock gate"
              aria-label="Lock gate"
              className="flex items-center justify-center p-0.5 rounded text-slate-400/80 hover:text-amber-300 hover:bg-[#123e6b]/60 transition-colors cursor-pointer"
            >
              <Lock className="w-3 h-3 stroke-[1.6]" />
            </button>
          )}
        </div>

        {/* Fiscal Year on the right corner */}
        <div className="flex items-center space-x-1.5 text-[11px]">
          <span className="text-slate-300">Fiscal Year:</span>
          <select
            value={fiscalYear}
            onChange={e => setFiscalYear(e.target.value)}
            className="bg-[#071f38] text-white border border-slate-600 rounded px-1.5 py-0.5 font-medium focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
          >
            <option value="FY 2026-27">FY 2026-27</option>
            <option value="FY 2025-26">FY 2025-26</option>
            <option value="FY 2024-25">FY 2024-25</option>
          </select>
        </div>
      </div>

      {/* Main Official Header Bar */}
      <div className="px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Portal Title */}
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl font-bold text-[#0E355C] tracking-tight leading-snug truncate">
            Urban Development &amp; Urban Housing Department, Govt. of Gujarat
          </h1>
          <div className="text-sm font-semibold text-slate-700 tracking-tight flex items-center mt-0.5">
            <span>Gujarat Urban Development Mission</span>
            <span className="ml-2.5 px-2 py-0.5 text-xs font-semibold bg-blue-50 text-blue-800 rounded border border-blue-200">
              PLMS Portal
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">
            Project Lifecycle Management System
          </p>
        </div>

        {/* Right Controls: Designation & Department Dropdown Boxes + Notifications */}
        <div className="flex items-center space-x-2.5 shrink-0">
          {/* Box 1: Designation Dropdown */}
          <div ref={designationDropdownRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setIsDesignationOpen(!isDesignationOpen);
                setIsDepartmentOpen(false);
              }}
              className="flex items-center justify-between space-x-2 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs rounded-lg border border-slate-300 hover:border-slate-400 transition-colors shadow-2xs cursor-pointer min-w-[130px] sm:min-w-[155px]"
            >
              <div className="text-left truncate pr-1">
                <span className="block text-[9px] uppercase tracking-wider font-bold text-slate-500 leading-tight">
                  Designation
                </span>
                <span className="font-semibold text-[#0E355C] truncate block leading-tight">
                  {selectedDesignation || 'UDUHD official'}
                </span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-500 shrink-0 transition-transform duration-200 ${
                  isDesignationOpen ? 'rotate-180 text-[#0E355C]' : ''
                }`}
              />
            </button>

            {isDesignationOpen && (
              <div className="absolute right-0 mt-1.5 w-60 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-50 animate-in fade-in slide-in-from-top-1">
                <div className="px-3 py-1.5 border-b border-slate-100 bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Select Designation
                </div>
                <div className="py-1">
                  {DESIGNATIONS.map(desig => {
                    const isSelected = (selectedDesignation || 'UDUHD official') === desig.name;
                    return (
                      <button
                        key={desig.id}
                        type="button"
                        onClick={() => handleSelectDesignation(desig.name)}
                        className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-blue-50 transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50 text-[#0E355C] font-bold border-l-4 border-[#0E355C]'
                            : 'text-slate-700'
                        }`}
                      >
                        <span className="truncate mr-2">{desig.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#0E355C] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Box 2: Department Dropdown */}
          <div ref={departmentDropdownRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setIsDepartmentOpen(!isDepartmentOpen);
                setIsDesignationOpen(false);
              }}
              className="flex items-center justify-between space-x-2 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs rounded-lg border border-slate-300 hover:border-slate-400 transition-colors shadow-2xs cursor-pointer min-w-[120px] sm:min-w-[155px]"
            >
              <div className="text-left truncate pr-1">
                <span className="block text-[9px] uppercase tracking-wider font-bold text-slate-500 leading-tight">
                  Department
                </span>
                <span className="font-semibold text-blue-900 truncate block leading-tight">
                  {selectedDepartment || 'GUDM'}
                </span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-500 shrink-0 transition-transform duration-200 ${
                  isDepartmentOpen ? 'rotate-180 text-blue-900' : ''
                }`}
              />
            </button>

            {isDepartmentOpen && (
              <div className="absolute right-0 mt-1.5 w-72 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-50 animate-in fade-in slide-in-from-top-1">
                <div className="px-3 py-1.5 border-b border-slate-100 bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Select Department
                </div>
                <div className="max-h-72 overflow-y-auto py-1">
                  {DEPARTMENTS.map(dept => {
                    const isSelected = (selectedDepartment || 'GUDM') === dept.name;
                    return (
                      <button
                        key={dept.id}
                        type="button"
                        onClick={() => handleSelectDepartment(dept.name)}
                        className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-blue-50 transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50 text-[#0E355C] font-bold border-l-4 border-[#0E355C]'
                            : 'text-slate-700'
                        }`}
                      >
                        <div className="truncate mr-2">
                          <span className="font-bold text-slate-900 mr-1.5">{dept.name}</span>
                          <span className="text-slate-500 text-[11px]">({dept.description})</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#0E355C] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-600 hover:text-[#0E355C] hover:bg-slate-100 rounded-md transition-colors"
              title="Notifications & Escalation Alerts"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-84 sm:w-96 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-1">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Alerts & System Escalations ({unreadCount} New)
                  </span>
                  <button
                    onClick={() => {
                      setCurrentNav('Notifications');
                      setShowNotifications(false);
                    }}
                    className="text-xs text-blue-700 hover:underline font-medium"
                  >
                    View All
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.slice(0, 5).map(n => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationRead(n.id);
                        if (n.category === 'Pending Approval') setCurrentNav('Approvals');
                        else if (n.category === 'Delayed Project') setCurrentNav('Progress Monitoring');
                        else setCurrentNav('Notifications');
                        setShowNotifications(false);
                      }}
                      className={`p-3 text-left hover:bg-slate-50 cursor-pointer transition-colors ${
                        !n.read ? 'bg-blue-50/40' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        <AlertTriangle
                          className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                            n.severity === 'Critical'
                              ? 'text-rose-600'
                              : n.severity === 'High'
                              ? 'text-amber-600'
                              : 'text-blue-600'
                          }`}
                        />
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-slate-900 leading-snug">{n.title}</p>
                          <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">{n.description}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">{n.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
