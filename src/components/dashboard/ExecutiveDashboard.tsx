import React from 'react';
import { useApp } from '../../context/AppContext';
import { Breadcrumbs } from '../common/Breadcrumbs';
import {
  FolderGit2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  IndianRupee,
  TrendingUp,
  FileText,
  Briefcase,
  Layers,
  ArrowUpRight,
  ArrowRight,
  Activity,
  FileSpreadsheet,
  Building2,
  Calendar,
  ShieldCheck,
  CheckCircle,
  PieChart,
  Landmark
} from 'lucide-react';

export const ExecutiveDashboard: React.FC = () => {
  const {
    projects,
    approvals,
    setCurrentNav,
    setSelectedProjectId,
    selectedDepartment,
    selectedDesignation,
    fiscalYear
  } = useApp();

  // Metrics calculations (Preserving exact format)
  const totalProjects = projects.length;
  const inPlanning = projects.filter(p => p.currentStatus === 'Planning').length;
  const underRfp = projects.filter(p => p.currentStatus === 'Under RFP').length;
  const awarded = projects.filter(p => p.currentStatus === 'Awarded').length;
  const inExecution = projects.filter(p => p.currentStatus === 'In Execution').length;
  const completed = projects.filter(p => p.currentStatus === 'Completed').length;
  const delayed = projects.filter(p => p.currentStatus === 'Delayed' || p.delayDays > 0).length;

  const totalApprovedCost = projects.reduce((acc, p) => acc + (Number(p.approvedCost) || 0), 0);
  const totalExpenditure = projects.reduce((acc, p) => acc + (Number(p.expenditure) || 0), 0);
  const totalCommitted = projects.reduce((acc, p) => acc + (Number(p.committedCost) || 0), 0);
  const budgetUtilisation = totalApprovedCost > 0 ? (totalExpenditure / totalApprovedCost) * 100 : 0;
  const unspentBalance = Math.max(0, totalApprovedCost - totalExpenditure);

  const criticalAndHighRisks = projects.filter(
    p => p.riskLevel === 'Critical' || p.riskLevel === 'High'
  );

  const delayedProjects = projects
    .filter(p => p.delayDays > 0)
    .sort((a, b) => b.delayDays - a.delayDays);

  // Category-wise budget breakdown
  const categorySummary: { [cat: string]: { approved: number; spent: number; count: number } } = {};
  projects.forEach(p => {
    if (!categorySummary[p.category]) {
      categorySummary[p.category] = { approved: 0, spent: 0, count: 0 };
    }
    categorySummary[p.category].approved += Number(p.approvedCost) || 0;
    categorySummary[p.category].spent += Number(p.expenditure) || 0;
    categorySummary[p.category].count += 1;
  });

  const categories = Object.keys(categorySummary).slice(0, 5);
  const pendingApprovals = approvals.filter(a => a.status === 'Pending');

  // Sector color mapping for rich visualization
  const getSectorAccent = (index: number) => {
    const accents = [
      { border: 'border-blue-200', bg: 'bg-blue-500', lightBg: 'bg-blue-50/70', text: 'text-blue-700', bar: 'bg-blue-600' },
      { border: 'border-teal-200', bg: 'bg-teal-500', lightBg: 'bg-teal-50/70', text: 'text-teal-700', bar: 'bg-teal-600' },
      { border: 'border-indigo-200', bg: 'bg-indigo-500', lightBg: 'bg-indigo-50/70', text: 'text-indigo-700', bar: 'bg-indigo-600' },
      { border: 'border-amber-200', bg: 'bg-amber-500', lightBg: 'bg-amber-50/70', text: 'text-amber-700', bar: 'bg-amber-600' },
      { border: 'border-purple-200', bg: 'bg-purple-500', lightBg: 'bg-purple-50/70', text: 'text-purple-700', bar: 'bg-purple-600' }
    ];
    return accents[index % accents.length];
  };

  return (
    <div className="space-y-6 font-sans text-slate-900 pb-10">
      {/* Top Banner & Control Bar: Realistic & Authentic Government Dashboard Title */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs relative overflow-hidden">
        {/* Subtle decorative top border accent in Government of Gujarat Deep Navy */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0E355C] via-blue-600 to-amber-500" />

        <Breadcrumbs currentModule="Executive Dashboard" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mt-3 gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#0E355C] text-white shadow-2xs">
                <Building2 className="w-3.5 h-3.5 text-amber-300" />
                {selectedDepartment || 'GUDM'}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0E355C]" />
                {selectedDesignation || 'UDHDD official'}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold font-mono bg-blue-50 text-blue-900 border border-blue-200">
                <Calendar className="w-3.5 h-3.5 text-blue-700" />
                {fiscalYear || 'FY 2026-27'}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                Active Schemes Live Sync
              </span>
            </div>

            {/* Authentic Real Gujarat Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0E355C] tracking-tight">
              Gujarat Urban Infrastructure Project Monitoring
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
              33 Districts &bull; 17 Municipal Corporations &bull; 157 Municipalities
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setCurrentNav('Projects')}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl bg-[#0E355C] text-white hover:bg-[#08223c] shadow-xs hover:shadow-sm transition-all cursor-pointer"
            >
              <FolderGit2 className="w-4 h-4 text-amber-300" />
              <span>Project Registry ({totalProjects})</span>
            </button>
            <button
              onClick={() => setCurrentNav('Reports')}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 hover:border-slate-400 shadow-2xs transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
              <span>Generate State Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Row 1: Primary KPI Stat Cards - Project Lifecycle Progression with Rich, Crisp Colors */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Total Projects - Deep Navy Anchor */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#0E355C]" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Total Projects</span>
            <div className="p-2 rounded-xl bg-blue-50 text-[#0E355C] ring-1 ring-blue-100 group-hover:scale-105 transition-transform">
              <FolderGit2 className="w-4 h-4 text-[#0E355C]" />
            </div>
          </div>
          <div className="my-2.5">
            <div className="text-3xl font-extrabold text-[#0E355C] tracking-tight font-mono tabular-nums">{totalProjects}</div>
            <div className="text-xs text-slate-600 font-semibold mt-0.5">Active Portfolio</div>
          </div>
          <div className="pt-2.5 border-t border-slate-100 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-700 font-medium">
              <span>8 Urban Sectors</span>
              <span className="px-2 py-0.5 rounded-md text-xs font-bold font-mono bg-blue-50 text-[#0E355C] border border-blue-200">100%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
              <div className="bg-[#0E355C] h-full rounded-full w-full" />
            </div>
          </div>
        </div>

        {/* Planning & Sanction - Warm Amber */}
        <div className="bg-white p-4.5 rounded-2xl border border-amber-200/80 shadow-xs hover:shadow-md hover:border-amber-300 transition-all flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900">In Planning</span>
            <div className="p-2 rounded-xl bg-amber-100/70 text-amber-800 ring-1 ring-amber-200 group-hover:scale-105 transition-transform">
              <Clock className="w-4 h-4 text-amber-700" />
            </div>
          </div>
          <div className="my-2.5">
            <div className="text-3xl font-extrabold text-amber-950 tracking-tight font-mono tabular-nums">{inPlanning}</div>
            <div className="text-xs text-amber-800 font-semibold mt-0.5">DPR / AS / TS Pipeline</div>
          </div>
          <div className="pt-2.5 border-t border-amber-100/60 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-700 font-medium">
              <span>Share of Total</span>
              <span className="px-2 py-0.5 rounded-md text-xs font-bold font-mono bg-amber-50 text-amber-900 border border-amber-200">
                {totalProjects > 0 ? ((inPlanning / totalProjects) * 100).toFixed(0) : 0}%
              </span>
            </div>
            <div className="w-full bg-amber-50 h-2 rounded-full overflow-hidden border border-amber-200">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${totalProjects > 0 ? (inPlanning / totalProjects) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Under Tendering - Vibrant Blue */}
        <div className="bg-white p-4.5 rounded-2xl border border-blue-200/80 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-blue-600" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-900">Under RFP</span>
            <div className="p-2 rounded-xl bg-blue-100/70 text-blue-800 ring-1 ring-blue-200 group-hover:scale-105 transition-transform">
              <FileText className="w-4 h-4 text-blue-700" />
            </div>
          </div>
          <div className="my-2.5">
            <div className="text-3xl font-extrabold text-blue-950 tracking-tight font-mono tabular-nums">{underRfp}</div>
            <div className="text-xs text-blue-800 font-semibold mt-0.5">Tenders &amp; Evaluation</div>
          </div>
          <div className="pt-2.5 border-t border-blue-100/60 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-700 font-medium">
              <span>Share of Total</span>
              <span className="px-2 py-0.5 rounded-md text-xs font-bold font-mono bg-blue-50 text-blue-900 border border-blue-200">
                {totalProjects > 0 ? ((underRfp / totalProjects) * 100).toFixed(0) : 0}%
              </span>
            </div>
            <div className="w-full bg-blue-50 h-2 rounded-full overflow-hidden border border-blue-200">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${totalProjects > 0 ? (underRfp / totalProjects) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Awarded / WO - Royal Indigo */}
        <div className="bg-white p-4.5 rounded-2xl border border-indigo-200/80 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-600" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-900">Awarded</span>
            <div className="p-2 rounded-xl bg-indigo-100/70 text-indigo-800 ring-1 ring-indigo-200 group-hover:scale-105 transition-transform">
              <Briefcase className="w-4 h-4 text-indigo-700" />
            </div>
          </div>
          <div className="my-2.5">
            <div className="text-3xl font-extrabold text-indigo-950 tracking-tight font-mono tabular-nums">{awarded}</div>
            <div className="text-xs text-indigo-800 font-semibold mt-0.5">Work Orders Issued</div>
          </div>
          <div className="pt-2.5 border-t border-indigo-100/60 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-700 font-medium">
              <span>Share of Total</span>
              <span className="px-2 py-0.5 rounded-md text-xs font-bold font-mono bg-indigo-50 text-indigo-900 border border-indigo-200">
                {totalProjects > 0 ? ((awarded / totalProjects) * 100).toFixed(0) : 0}%
              </span>
            </div>
            <div className="w-full bg-indigo-50 h-2 rounded-full overflow-hidden border border-indigo-200">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${totalProjects > 0 ? (awarded / totalProjects) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Under Execution - Modern Teal */}
        <div className="bg-white p-4.5 rounded-2xl border border-teal-200/80 shadow-xs hover:shadow-md hover:border-teal-300 transition-all flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-teal-600" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-900">In Execution</span>
            <div className="p-2 rounded-xl bg-teal-100/70 text-teal-800 ring-1 ring-teal-200 group-hover:scale-105 transition-transform">
              <Layers className="w-4 h-4 text-teal-700" />
            </div>
          </div>
          <div className="my-2.5">
            <div className="text-3xl font-extrabold text-teal-950 tracking-tight font-mono tabular-nums">{inExecution}</div>
            <div className="text-xs text-teal-800 font-semibold mt-0.5">Active Construction</div>
          </div>
          <div className="pt-2.5 border-t border-teal-100/60 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-700 font-medium">
              <span>Share of Total</span>
              <span className="px-2 py-0.5 rounded-md text-xs font-bold font-mono bg-teal-50 text-teal-900 border border-teal-200">
                {totalProjects > 0 ? ((inExecution / totalProjects) * 100).toFixed(0) : 0}%
              </span>
            </div>
            <div className="w-full bg-teal-50 h-2 rounded-full overflow-hidden border border-teal-200">
              <div
                className="bg-teal-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${totalProjects > 0 ? (inExecution / totalProjects) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Completed - Rich Forest Emerald */}
        <div className="bg-white p-4.5 rounded-2xl border border-emerald-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-600" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">Completed</span>
            <div className="p-2 rounded-xl bg-emerald-100/70 text-emerald-800 ring-1 ring-emerald-200 group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            </div>
          </div>
          <div className="my-2.5">
            <div className="text-3xl font-extrabold text-emerald-950 tracking-tight font-mono tabular-nums">{completed}</div>
            <div className="text-xs text-emerald-800 font-semibold mt-0.5">Handed Over to ULBs</div>
          </div>
          <div className="pt-2.5 border-t border-emerald-100/60 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-700 font-medium">
              <span>Share of Total</span>
              <span className="px-2 py-0.5 rounded-md text-xs font-bold font-mono bg-emerald-50 text-emerald-900 border border-emerald-200">
                {totalProjects > 0 ? ((completed / totalProjects) * 100).toFixed(0) : 0}%
              </span>
            </div>
            <div className="w-full bg-emerald-50 h-2 rounded-full overflow-hidden border border-emerald-200">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${totalProjects > 0 ? (completed / totalProjects) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Financial Envelope & Outlay Cards with Enhanced Gradient Elegance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Approved Outlay */}
        <div className="bg-gradient-to-br from-white to-blue-50/50 p-5 rounded-2xl border border-blue-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-blue-100/80">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-900">Total Approved Outlay</span>
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs font-bold">
              <IndianRupee className="w-4.5 h-4.5 stroke-[2.5]" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#0E355C] tracking-tight font-mono tabular-nums">
              ₹{(Number(totalApprovedCost) || 0).toFixed(1)} <span className="text-sm font-bold text-slate-600 font-sans">Cr</span>
            </div>
            <div className="text-xs text-slate-600 font-semibold mt-1">SJMMSVY, AMRUT 2.0 &amp; World Bank</div>
          </div>
          <div className="pt-3 border-t border-blue-100/80 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">Committed Contracts:</span>
            <span className="font-bold text-[#0E355C] font-mono tabular-nums">₹{(Number(totalCommitted) || 0).toFixed(1)} Cr</span>
          </div>
        </div>

        {/* Total Expenditure */}
        <div className="bg-gradient-to-br from-white to-emerald-50/50 p-5 rounded-2xl border border-emerald-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-100/80">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">Total Expenditure</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs font-bold">
              <TrendingUp className="w-4.5 h-4.5 stroke-[2.5]" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-950 tracking-tight font-mono tabular-nums">
              ₹{(Number(totalExpenditure) || 0).toFixed(1)} <span className="text-sm font-bold text-emerald-800 font-sans">Cr</span>
            </div>
            <div className="text-xs text-slate-600 font-semibold mt-1">Verified via Treasury &amp; RA Bills</div>
          </div>
          <div className="pt-3 border-t border-emerald-100/80 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">Disbursed Share:</span>
            <span className="font-bold text-emerald-900 font-mono tabular-nums">
              {(Number(budgetUtilisation) || 0).toFixed(1)}% of Outlay
            </span>
          </div>
        </div>

        {/* Budget Utilisation */}
        <div className="bg-gradient-to-br from-white to-indigo-50/50 p-5 rounded-2xl border border-indigo-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-indigo-100/80">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-900">Budget Utilisation</span>
            <span className="px-2.5 py-0.5 text-xs font-bold font-mono rounded-lg bg-indigo-600 text-white shadow-2xs">
              {(Number(budgetUtilisation) || 0).toFixed(1)}%
            </span>
          </div>
          <div className="my-3">
            <div className="text-3xl sm:text-4xl font-extrabold text-indigo-950 tracking-tight font-mono tabular-nums">
              {(Number(budgetUtilisation) || 0).toFixed(1)}%
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full mt-2.5 overflow-hidden border border-slate-200">
              <div
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, Number(budgetUtilisation) || 0))}%` }}
              />
            </div>
          </div>
          <div className="pt-3 border-t border-indigo-100/80 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">Remaining Balance:</span>
            <span className="font-bold text-indigo-950 font-mono tabular-nums">
              ₹{unspentBalance.toFixed(1)} Cr
            </span>
          </div>
        </div>

        {/* Projects At Risk / Delayed */}
        <div className="bg-gradient-to-br from-white to-rose-50/60 p-5 rounded-2xl border border-rose-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-rose-100">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-900">Projects At Risk</span>
            <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs font-bold">
              <AlertTriangle className="w-4.5 h-4.5 stroke-[2.5]" />
            </div>
          </div>
          <div className="my-3">
            <div className="flex items-center gap-3">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-extrabold text-rose-700 font-mono tracking-tight tabular-nums">{delayed}</span>
                <span className="text-xs font-bold text-rose-800 uppercase">Delayed</span>
              </div>
              <span className="text-slate-300 font-light text-2xl">|</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono tracking-tight tabular-nums">{criticalAndHighRisks.length}</span>
                <span className="text-xs font-bold text-slate-700 uppercase">Critical</span>
              </div>
            </div>
            <div className="text-xs text-rose-800 font-semibold mt-1">Slippage &amp; clearance issues flagged</div>
          </div>
          <div className="pt-3 border-t border-rose-100 flex items-center justify-between text-xs">
            <span className="text-rose-900 font-medium">Risk Action:</span>
            <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
              Expedite Approvals
            </span>
          </div>
        </div>
      </div>

      {/* Row 3: Sector-wise Allocation vs Expenditure with Visual Accents */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#0E355C]">
                Sector-wise Financial Allocation vs Expenditure
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-md bg-blue-50 text-[#0E355C] font-bold border border-blue-200">
                5 Major Sectors
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5 font-medium">
              Sector financial utilization and budget progress in ₹ Crores
            </p>
          </div>
          <div className="flex items-center space-x-4 text-xs font-semibold text-slate-700">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 bg-slate-200 border border-slate-300 rounded-xs" />
              <span>Approved Outlay</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 bg-[#0E355C] rounded-xs" />
              <span>Expenditure Released</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 pt-4">
          {categories.map((cat, index) => {
            const data = categorySummary[cat];
            const approvedVal = Number(data?.approved) || 0;
            const spentVal = Number(data?.spent) || 0;
            const utilPct = approvedVal > 0 ? (spentVal / approvedVal) * 100 : 0;
            const accent = getSectorAccent(index);

            return (
              <div
                key={cat}
                className={`p-4 ${accent.lightBg} hover:bg-white rounded-xl border ${accent.border} hover:border-slate-300 transition-all space-y-3 min-w-0 shadow-2xs hover:shadow-xs`}
              >
                <div className="flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Building2 className={`w-3.5 h-3.5 ${accent.text} shrink-0`} />
                    <span className="font-bold text-slate-950 text-xs truncate" title={cat}>{cat}</span>
                  </div>
                  <span className={`text-xs font-bold ${accent.text} whitespace-nowrap px-2 py-0.5 rounded-md bg-white border ${accent.border} font-mono shadow-2xs`}>
                    {utilPct.toFixed(1)}%
                  </span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-medium">Spent:</span>
                    <span className="font-bold text-slate-950 font-mono tabular-nums">₹{spentVal.toFixed(1)} Cr</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-medium">Outlay:</span>
                    <span className="font-bold text-slate-700 font-mono tabular-nums">₹{approvedVal.toFixed(1)} Cr</span>
                  </div>
                </div>
                <div className="w-full bg-slate-200/90 h-2 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className={`${accent.bar} h-full rounded-full transition-all duration-300`}
                    style={{ width: `${Math.min(100, Math.max(0, utilPct))}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Row 4: Operational Tables: Delayed & High Risk Projects + Pending Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Delayed & Overdue Projects */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs lg:col-span-2 overflow-hidden flex flex-col">
          <div className="px-5 py-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 bg-rose-100 text-rose-700 rounded-lg">
                <AlertTriangle className="w-4 h-4 shrink-0" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-950 uppercase tracking-wider">
                  Delayed Schemes Requiring Corrective Action ({delayedProjects.length})
                </h3>
                <span className="text-xs text-slate-600 font-medium">Prioritized by longest execution slippage</span>
              </div>
            </div>
            <button
              onClick={() => setCurrentNav('Progress Monitoring')}
              className="text-xs font-bold text-[#0E355C] hover:text-blue-900 flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>Progress Tracker</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs text-slate-900">
              <thead className="bg-slate-100/90 text-slate-700 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Project ID &amp; Title</th>
                  <th className="py-3 px-3">District</th>
                  <th className="py-3 px-3 text-center whitespace-nowrap">No. of Days Delay</th>
                  <th className="py-3 px-3">Progress</th>
                  <th className="py-3 px-3">Root Cause</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {delayedProjects.slice(0, 5).map(prj => (
                  <tr key={prj.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-mono text-xs text-[#0E355C] font-bold block">{prj.id}</span>
                      <span className="font-semibold text-slate-950 line-clamp-1">{prj.name}</span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-800 whitespace-nowrap">{prj.district}</td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <span className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold font-mono border border-rose-200 bg-rose-50 text-rose-700">
                        <Clock className="w-3 h-3 shrink-0 text-rose-600" />
                        <span className="font-bold tracking-tight">+{prj.delayDays}</span>
                        <span className="text-[10px] font-sans">Days</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-slate-200 h-2 rounded-full overflow-hidden border border-slate-200">
                          <div
                            className="bg-[#0E355C] h-full rounded-full"
                            style={{ width: `${prj.physicalProgress}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-900 font-mono">{prj.physicalProgress}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-xs text-slate-700 font-medium line-clamp-1 max-w-xs">
                      {prj.delayReason || 'Clearances in progress'}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedProjectId(prj.id);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-[#0E355C] hover:bg-[#08223c] rounded-lg shadow-2xs transition-colors cursor-pointer"
                        title="View Project Master Record"
                      >
                        <span>View</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Actions & Approvals Inbox Preview */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col">
          <div className="px-5 py-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-950 uppercase tracking-wider">
              Pending Approvals ({pendingApprovals.length})
            </h3>
            <button
              onClick={() => setCurrentNav('Approvals')}
              className="text-xs font-bold text-[#0E355C] hover:text-blue-900 flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>Open Inbox</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-4 divide-y divide-slate-100 flex-1 overflow-y-auto max-h-80 space-y-1">
            {pendingApprovals.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-600 font-medium">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                No pending workflow items requiring your action.
              </div>
            ) : (
              pendingApprovals.slice(0, 4).map(app => (
                <div key={app.id} className="py-2.5 text-xs space-y-1 hover:bg-slate-50/80 p-2.5 rounded-xl transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-[#0E355C] font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {app.id}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold font-mono">
                      Due: {app.dueDate}
                    </span>
                  </div>
                  <p className="font-bold text-slate-950 text-xs leading-snug">{app.approvalType}</p>
                  <p className="text-xs text-slate-600 line-clamp-1 font-medium">{app.projectName}</p>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                    <span className="text-slate-600 font-medium">From: {app.submittedBy}</span>
                    {app.amount ? (
                      <span className="font-bold text-[#0E355C] font-mono text-xs">₹{app.amount} Cr</span>
                    ) : null}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-3 bg-slate-50/80 border-t border-slate-200 text-center">
            <button
              onClick={() => setCurrentNav('Approvals')}
              className="w-full py-2.5 text-xs font-bold text-[#0E355C] bg-white hover:bg-slate-100 rounded-xl border border-slate-300 transition-colors inline-flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <span>Review All Action Items</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
