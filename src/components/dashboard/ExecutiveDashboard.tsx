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
  Building2
} from 'lucide-react';

export const ExecutiveDashboard: React.FC = () => {
  const {
    projects,
    approvals,
    setCurrentNav,
    setSelectedProjectId
  } = useApp();

  // Metrics calculations
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

  const criticalAndHighRisks = projects.filter(
    p => p.riskLevel === 'Critical' || p.riskLevel === 'High'
  );

  const delayedProjects = projects
    .filter(p => p.delayDays > 0)
    .sort((a, b) => b.delayDays - a.delayDays);

  // Category-wise budget breakdown
  const categorySummary: { [cat: string]: { approved: number; spent: number } } = {};
  projects.forEach(p => {
    if (!categorySummary[p.category]) {
      categorySummary[p.category] = { approved: 0, spent: 0 };
    }
    categorySummary[p.category].approved += Number(p.approvedCost) || 0;
    categorySummary[p.category].spent += Number(p.expenditure) || 0;
  });

  const categories = Object.keys(categorySummary).slice(0, 5);

  const pendingApprovals = approvals.filter(a => a.status === 'Pending');

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Bar */}
      <div>
        <Breadcrumbs currentModule="Executive Dashboard" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-slate-200 gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-semibold tracking-wider uppercase bg-slate-100 text-slate-700 border border-slate-200">
                <Activity className="w-3.5 h-3.5 text-slate-600" />
                State Command Center
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                Live Portfolio Sync
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              State Urban Infrastructure Command Center
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
              Real-time portfolio analytics across 33 Districts &bull; 17 Municipal Corporations &bull; 157 Municipalities
            </p>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => setCurrentNav('Projects')}
              className="inline-flex items-center px-4 py-2 text-xs font-semibold rounded-lg bg-[#0E355C] text-white hover:bg-[#092644] shadow-2xs transition-colors"
            >
              <FolderGit2 className="w-3.5 h-3.5 mr-1.5 text-slate-200" />
              Project Registry
            </button>
            <button
              onClick={() => setCurrentNav('Reports')}
              className="inline-flex items-center px-4 py-2 text-xs font-medium rounded-lg bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 shadow-2xs transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
              Generate State Report
            </button>
          </div>
        </div>
      </div>

      {/* Row 1: Primary KPI Stat Cards - Project Lifecycle Progression */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Projects - Anchor Card */}
        <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all duration-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold uppercase tracking-wider text-slate-800">Total Projects</span>
            <div className="p-2 rounded-lg bg-slate-100 text-slate-700 ring-1 ring-slate-200/70">
              <FolderGit2 className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2.5">
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">{totalProjects}</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">Active Portfolio</div>
          </div>
          <div className="pt-2.5 border-t border-slate-100 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-medium">8 Urban Sectors</span>
              <span className="px-2 py-0.5 rounded-md text-xs sm:text-sm font-bold font-mono bg-slate-100 text-slate-700 border border-slate-200">100%</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#0E355C] h-full rounded-full w-full" />
            </div>
          </div>
        </div>

        {/* Planning & Sanction */}
        <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all duration-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold uppercase tracking-wider text-slate-800">In Planning</span>
            <div className="p-2 rounded-lg bg-slate-100 text-slate-600 ring-1 ring-slate-200/70">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2.5">
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">{inPlanning}</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">DPR / AS / TS Pipeline</div>
          </div>
          <div className="pt-2.5 border-t border-slate-100 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Share of Total</span>
              <span className="px-2 py-0.5 rounded-md text-xs sm:text-sm font-bold font-mono bg-slate-100 text-slate-700 border border-slate-200">
                {totalProjects > 0 ? ((inPlanning / totalProjects) * 100).toFixed(0) : 0}%
              </span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#0E355C] h-full rounded-full transition-all duration-500"
                style={{ width: `${totalProjects > 0 ? (inPlanning / totalProjects) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Under Tendering */}
        <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all duration-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold uppercase tracking-wider text-slate-800">Under RFP</span>
            <div className="p-2 rounded-lg bg-slate-100 text-slate-600 ring-1 ring-slate-200/70">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2.5">
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">{underRfp}</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">Tenders &amp; Evaluation</div>
          </div>
          <div className="pt-2.5 border-t border-slate-100 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Share of Total</span>
              <span className="px-2 py-0.5 rounded-md text-xs sm:text-sm font-bold font-mono bg-slate-100 text-slate-700 border border-slate-200">
                {totalProjects > 0 ? ((underRfp / totalProjects) * 100).toFixed(0) : 0}%
              </span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#0E355C] h-full rounded-full transition-all duration-500"
                style={{ width: `${totalProjects > 0 ? (underRfp / totalProjects) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Awarded / WO */}
        <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all duration-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold uppercase tracking-wider text-slate-800">Awarded</span>
            <div className="p-2 rounded-lg bg-slate-100 text-slate-600 ring-1 ring-slate-200/70">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2.5">
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">{awarded}</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">Work Orders Issued</div>
          </div>
          <div className="pt-2.5 border-t border-slate-100 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Share of Total</span>
              <span className="px-2 py-0.5 rounded-md text-xs sm:text-sm font-bold font-mono bg-slate-100 text-slate-700 border border-slate-200">
                {totalProjects > 0 ? ((awarded / totalProjects) * 100).toFixed(0) : 0}%
              </span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#0E355C] h-full rounded-full transition-all duration-500"
                style={{ width: `${totalProjects > 0 ? (awarded / totalProjects) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Under Execution */}
        <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all duration-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold uppercase tracking-wider text-slate-800">In Execution</span>
            <div className="p-2 rounded-lg bg-slate-100 text-slate-600 ring-1 ring-slate-200/70">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2.5">
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">{inExecution}</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">Active Construction</div>
          </div>
          <div className="pt-2.5 border-t border-slate-100 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Share of Total</span>
              <span className="px-2 py-0.5 rounded-md text-xs sm:text-sm font-bold font-mono bg-slate-100 text-slate-700 border border-slate-200">
                {totalProjects > 0 ? ((inExecution / totalProjects) * 100).toFixed(0) : 0}%
              </span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#0E355C] h-full rounded-full transition-all duration-500"
                style={{ width: `${totalProjects > 0 ? (inExecution / totalProjects) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Completed */}
        <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all duration-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold uppercase tracking-wider text-slate-800">Completed</span>
            <div className="p-2 rounded-lg bg-slate-100 text-slate-600 ring-1 ring-slate-200/70">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2.5">
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">{completed}</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">Handed Over to ULBs</div>
          </div>
          <div className="pt-2.5 border-t border-slate-100 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Share of Total</span>
              <span className="px-2 py-0.5 rounded-md text-xs sm:text-sm font-bold font-mono bg-slate-100 text-slate-700 border border-slate-200">
                {totalProjects > 0 ? ((completed / totalProjects) * 100).toFixed(0) : 0}%
              </span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#0E355C] h-full rounded-full transition-all duration-500"
                style={{ width: `${totalProjects > 0 ? (completed / totalProjects) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Financial Envelope & Outlay Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Approved Outlay */}
        <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between hover:border-slate-300 hover:shadow-xs transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Total Approved Outlay</span>
            <div className="p-2 rounded-lg bg-slate-100 text-slate-600 ring-1 ring-slate-200/70">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2.5">
            <div className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
              ₹ {(Number(totalApprovedCost) || 0).toFixed(1)} <span className="text-sm font-bold text-slate-500 font-sans">Cr</span>
            </div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">SJMMSVY, AMRUT 2.0 &amp; World Bank</div>
          </div>
          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Committed:</span>
            <span className="font-bold text-slate-800 font-mono">₹ {(Number(totalCommitted) || 0).toFixed(1)} Cr</span>
          </div>
        </div>

        {/* Total Expenditure */}
        <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between hover:border-slate-300 hover:shadow-xs transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Total Expenditure</span>
            <div className="p-2 rounded-lg bg-slate-100 text-slate-600 ring-1 ring-slate-200/70">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2.5">
            <div className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
              ₹ {(Number(totalExpenditure) || 0).toFixed(1)} <span className="text-sm font-bold text-slate-500 font-sans">Cr</span>
            </div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">Verified via Treasury &amp; RA Bills</div>
          </div>
          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Disbursed Share:</span>
            <span className="font-bold text-slate-800 font-mono">
              {(Number(budgetUtilisation) || 0).toFixed(1)}% of Outlay
            </span>
          </div>
        </div>

        {/* Budget Utilisation */}
        <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between hover:border-slate-300 hover:shadow-xs transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Budget Utilisation</span>
            <span className="px-2.5 py-0.5 text-xs font-bold font-mono rounded-md bg-slate-100 text-slate-700 border border-slate-200">
              {(Number(budgetUtilisation) || 0).toFixed(1)}%
            </span>
          </div>
          <div className="my-2.5">
            <div className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
              {(Number(budgetUtilisation) || 0).toFixed(1)}%
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full mt-2.5 overflow-hidden border border-slate-200/60">
              <div
                className="bg-[#0E355C] h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, Number(budgetUtilisation) || 0))}%` }}
              />
            </div>
          </div>
          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Remaining Balance:</span>
            <span className="font-bold text-slate-800 font-mono">
              ₹ {Math.max(0, totalApprovedCost - totalExpenditure).toFixed(1)} Cr
            </span>
          </div>
        </div>

        {/* Projects At Risk / Delayed */}
        <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between hover:border-slate-300 hover:shadow-xs transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Projects At Risk</span>
            <div className="p-2 rounded-lg bg-slate-100 text-slate-600 ring-1 ring-slate-200/70">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2.5">
            <div className="flex items-center gap-3">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl lg:text-3xl font-extrabold text-slate-900 font-mono tracking-tight">{delayed}</span>
                <span className="text-xs font-medium text-slate-500 uppercase">Delayed</span>
              </div>
              <span className="text-slate-300 font-light text-lg">|</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl lg:text-3xl font-extrabold text-slate-900 font-mono tracking-tight">{criticalAndHighRisks.length}</span>
                <span className="text-xs font-medium text-slate-500 uppercase">Critical</span>
              </div>
            </div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">Slippage &amp; clearance issues flagged</div>
          </div>
          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Risk Status:</span>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200/80">
              Action Required
            </span>
          </div>
        </div>
      </div>

      {/* Row 3: Sector-wise Allocation vs Expenditure */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-100 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Sector-wise Financial Allocation vs Expenditure
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                5 Major Sectors
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-normal">
              Sector financial utilization and budget progress in ₹ Crores
            </p>
          </div>
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 bg-slate-300 rounded-xs" />
              <span className="text-slate-600 font-medium text-xs">Approved Outlay</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 bg-[#0E355C] rounded-xs" />
              <span className="text-slate-600 font-medium text-xs">Expenditure Released</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-3.5">
          {categories.map(cat => {
            const data = categorySummary[cat];
            const approvedVal = Number(data?.approved) || 0;
            const spentVal = Number(data?.spent) || 0;
            const utilPct = approvedVal > 0 ? (spentVal / approvedVal) * 100 : 0;

            return (
              <div key={cat} className="p-3.5 bg-slate-50/50 hover:bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-all duration-200 space-y-2.5 min-w-0 shadow-2xs hover:shadow-xs">
                <div className="flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="font-bold text-slate-900 text-xs truncate" title={cat}>{cat}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-700 whitespace-nowrap px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 font-mono">
                    {utilPct.toFixed(1)}%
                  </span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="font-medium text-slate-500">Spent:</span>
                    <span className="font-bold text-slate-800 font-mono">₹{spentVal.toFixed(1)} Cr</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="font-medium text-slate-500">Outlay:</span>
                    <span className="font-bold text-slate-700 font-mono">₹{approvedVal.toFixed(1)} Cr</span>
                  </div>
                </div>
                <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#0E355C] h-full rounded-full transition-all duration-300"
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
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs lg:col-span-2 overflow-hidden flex flex-col">
          <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-slate-600 shrink-0" />
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Delayed Schemes Requiring Corrective Action ({delayedProjects.length})
                </h3>
                <span className="text-[11px] text-slate-500 font-normal">Prioritized by longest execution slippage</span>
              </div>
            </div>
            <button
              onClick={() => setCurrentNav('Progress Monitoring')}
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1 hover:underline"
            >
              Progress Tracker <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-600 text-[11px] font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Project ID &amp; Title</th>
                  <th className="py-2.5 px-3">District</th>
                  <th className="py-2.5 px-3 text-center whitespace-nowrap">No. of Days Delay</th>
                  <th className="py-2.5 px-3">Progress</th>
                  <th className="py-2.5 px-3">Root Cause</th>
                  <th className="py-2.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {delayedProjects.slice(0, 5).map(prj => (
                  <tr key={prj.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-4">
                      <span className="font-mono text-xs text-slate-800 font-bold block">{prj.id}</span>
                      <span className="font-medium text-slate-900 line-clamp-1">{prj.name}</span>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-600 whitespace-nowrap">{prj.district}</td>
                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      <span className="inline-flex items-center justify-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium font-mono border border-slate-200 bg-slate-100 text-slate-700">
                        <Clock className="w-3 h-3 shrink-0 text-slate-500" />
                        <span className="font-bold tracking-tight">+{prj.delayDays}</span>
                        <span className="text-[10px] opacity-80 font-sans">Days</span>
                      </span>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-[#0E355C] h-full rounded-full"
                            style={{ width: `${prj.physicalProgress}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-slate-700 font-mono">{prj.physicalProgress}%</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-xs text-slate-500 line-clamp-1 max-w-xs">
                      {prj.delayReason || 'Clearances in progress'}
                    </td>
                    <td className="py-2.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedProjectId(prj.id);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded border border-slate-200 transition-colors"
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
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col">
          <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Pending Approvals ({pendingApprovals.length})
            </h3>
            <button
              onClick={() => setCurrentNav('Approvals')}
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1 hover:underline"
            >
              Open Inbox <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-3.5 divide-y divide-slate-100 flex-1 overflow-y-auto max-h-80">
            {pendingApprovals.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500 font-medium">
                <CheckCircle2 className="w-8 h-8 text-slate-400 mx-auto mb-1.5" />
                No pending workflow items requiring your action.
              </div>
            ) : (
              pendingApprovals.slice(0, 4).map(app => (
                <div key={app.id} className="py-2.5 text-xs space-y-1 hover:bg-slate-50/70 p-2 rounded-lg transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-slate-700 font-bold">{app.id}</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-medium font-mono">
                      Due: {app.dueDate}
                    </span>
                  </div>
                  <p className="font-semibold text-slate-900 text-xs leading-snug">{app.approvalType}</p>
                  <p className="text-xs text-slate-500 line-clamp-1">{app.projectName}</p>
                  <div className="flex items-center justify-between pt-0.5 text-xs">
                    <span className="text-slate-500 font-normal">From: {app.submittedBy}</span>
                    {app.amount ? (
                      <span className="font-bold text-slate-800 font-mono">₹{app.amount} Cr</span>
                    ) : null}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
            <button
              onClick={() => setCurrentNav('Approvals')}
              className="w-full py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200/70 rounded-lg border border-slate-200 transition-colors inline-flex items-center justify-center gap-1.5"
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
