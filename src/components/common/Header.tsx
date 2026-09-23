import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  ChevronDown,
  Lock,
  ArrowLeft
} from 'lucide-react';

interface HeaderProps {
  onLock?: () => void;
  onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLock, onBack }) => {
  const {
    currentRole,
    setCurrentRole,
    fiscalYear,
    setFiscalYear,
    notifications,
    markNotificationRead,
    setCurrentNav
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleSelector, setShowRoleSelector] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const rolesList: UserRole[] = [
    'Super Administrator',
    'GUDM Department Administrator',
    'Project Manager',
    'Engineering Officer',
    'Procurement Officer',
    'Finance Officer',
    'Senior Management',
    'Contractor / Implementing Agency',
    'Field Inspection Officer'
  ];

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
              className="flex items-center justify-center p-0.5 rounded text-slate-400/80 hover:text-amber-300 hover:bg-[#123e6b]/60 transition-colors"
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
      <div className="px-4 sm:px-6 py-2.5 flex items-center justify-between">
        {/* Portal Title */}
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-[#0E355C] tracking-tight leading-snug">
            Urban Development &amp; Urban Housing Department, Govt. of Gujarat
          </h1>
          <div className="text-sm font-semibold text-slate-700 tracking-tight flex items-center mt-0.5">
            <span>Gujarat Urban Development Mission</span>
            <span className="ml-2.5 px-2 py-0.5 text-xs font-semibold bg-blue-50 text-blue-800 rounded border border-blue-200">
              PLMS Portal
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Project Lifecycle Management System
          </p>
        </div>

        {/* Right Controls: Role Switcher & Notifications & User Profile */}
        <div className="flex items-center space-x-3">
          {/* Role Switcher Pill - Crucial for Prototype Demo */}
          <div className="relative">
            <button
              onClick={() => setShowRoleSelector(!showRoleSelector)}
              className="flex items-center space-x-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium rounded-md border border-slate-300 transition-colors"
            >
              <UserCheck className="w-4 h-4 text-blue-700" />
              <div className="text-left">
                <span className="block text-[10px] text-slate-500 font-normal uppercase leading-tight">
                  Simulated User Role
                </span>
                <span className="font-semibold text-blue-900">{currentRole}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 ml-1" />
            </button>

            {showRoleSelector && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-1">
                <div className="px-3 py-1.5 border-b border-slate-100 bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                  Switch Active Role (Prototype Demo)
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {rolesList.map(role => (
                    <button
                      key={role}
                      onClick={() => {
                        setCurrentRole(role);
                        setShowRoleSelector(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-blue-50 transition-colors ${
                        currentRole === role ? 'bg-blue-50 text-blue-800 font-bold border-l-4 border-blue-700' : 'text-slate-700'
                      }`}
                    >
                      <span>{role}</span>
                      {currentRole === role && <CheckCircle2 className="w-3.5 h-3.5 text-blue-700" />}
                    </button>
                  ))}
                </div>
                <div className="px-3 py-1.5 border-t border-slate-100 text-[10px] text-slate-500 bg-slate-50">
                  Controls visible actions, approval permissions & dashboard metrics.
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
