import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { Breadcrumbs } from '../common/Breadcrumbs';
import {
  FolderGit2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  IndianRupee,
  TrendingUp,
  AlertOctagon,
  FileText,
  Briefcase,
  Layers,
  ArrowUpRight,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export const ExecutiveDashboard: React.FC = () => {
  const {
    projects,
    approvals,
    issuesRisks,
    notifications,
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

  // Status chart distribution data
  const statusDistribution = [
    { label: 'In Execution', count: inExecution, color: '#10B981' },
    { label: 'Delayed', count: delayed, color: '#F59E0B' },
    { label: 'Under RFP', count: underRfp, color: '#8B5CF6' },
    { label: 'Awarded', count: awarded, color: '#6366F1' },
    { label: 'Planning', count: inPlanning, color: '#3B82F6' },
    { label: 'Completed', count: completed, color: '#14B8A6' }
  ];

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
      {/* Top Banner & Breadcrumbs */}
      <div>
        <Breadcrumbs currentModule="Executive Dashboard" />
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-slate-200 gap-2">
          <div>
            <h2 className="text-xl font-bold text-[#0E355C] tracking-tight">
              State Urban Infrastructure Command Center
            </h2>
            <p className="text-xs text-slate-600">
              Real-time portfolio analytics across 33 Districts and 17 Municipal Corporations / ULBs
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentNav('Projects')}
              className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded bg-[#0E355C] text-white hover:bg-[#092644] transition-colors"
            >
              <FolderGit2 className="w-3.5 h-3.5 mr-1.5" />
              Project Registry
            </button>
            <button
              onClick={() => setCurrentNav('Reports')}
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 transition-colors"
            >
              Generate State Report
            </button>
          </div>
        </div>
      </div>

      {/* Row 1: Primary KPI Stat Cards - Project Lifecycle Progression */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Schemes - Anchor Card */}
        <div className="bg-[#0E355C] text-white p-3.5 rounded-lg border border-[#0A2744] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-200">Total Schemes</span>
            <div className="p-1.5 rounded-md bg-white/10 text-amber-300">
              <FolderGit2 className="w-4 h-4" />
            </div>
          </div>
          <div className="my-1.5">
            <div className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">{totalProjects}</div>
            <div className="text-[10px] text-slate-300 font-medium">Active Portfolio</div>
          </div>
          <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-300">
            <span>Across 8 Sectors</span>
            <span className="px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold">100%</span>
          </div>
        </div>

        {/* Planning & Sanction */}
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 border-t-3 border-t-sky-500 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">In Planning</span>
            <div className="p-1.5 rounded-md bg-sky-50 text-sky-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="my-1.5">
            <div className="text-2xl font-bold text-sky-800">{inPlanning}</div>
            <div className="text-[10px] text-slate-500">DPR / AS / TS Pipeline</div>
          </div>
          <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
            <span className="text-slate-500">Share of Total</span>
            <span className="font-bold text-sky-700 font-mono">
              {totalProjects > 0 ? ((inPlanning / totalProjects) * 100).toFixed(0) : 0}%
            </span>
          </div>
        </div>

        {/* Under Tendering */}
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 border-t-3 border-t-purple-500 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Under RFP</span>
            <div className="p-1.5 rounded-md bg-purple-50 text-purple-700">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="my-1.5">
            <div className="text-2xl font-bold text-purple-800">{underRfp}</div>
            <div className="text-[10px] text-slate-500">Bids & Evaluation</div>
          </div>
          <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
            <span className="text-slate-500">Share of Total</span>
            <span className="font-bold text-purple-700 font-mono">
              {totalProjects > 0 ? ((underRfp / totalProjects) * 100).toFixed(0) : 0}%
            </span>
          </div>
        </div>

        {/* Awarded / WO */}
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 border-t-3 border-t-indigo-500 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Awarded</span>
            <div className="p-1.5 rounded-md bg-indigo-50 text-indigo-700">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="my-1.5">
            <div className="text-2xl font-bold text-indigo-800">{awarded}</div>
            <div className="text-[10px] text-slate-500">Work Orders Issued</div>
          </div>
          <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
            <span className="text-slate-500">Share of Total</span>
            <span className="font-bold text-indigo-700 font-mono">
              {totalProjects > 0 ? ((awarded / totalProjects) * 100).toFixed(0) : 0}%
            </span>
          </div>
        </div>

        {/* Under Execution */}
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 border-t-3 border-t-amber-500 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">In Execution</span>
            <div className="p-1.5 rounded-md bg-amber-50 text-amber-700">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="my-1.5">
            <div className="text-2xl font-bold text-amber-800">{inExecution}</div>
            <div className="text-[10px] text-slate-500">Active Construction</div>
          </div>
          <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
            <span className="text-slate-500">Share of Total</span>
            <span className="font-bold text-amber-700 font-mono">
              {totalProjects > 0 ? ((inExecution / totalProjects) * 100).toFixed(0) : 0}%
            </span>
          </div>
        </div>

        {/* Completed */}
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 border-t-3 border-t-emerald-600 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Completed</span>
            <div className="p-1.5 rounded-md bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="my-1.5">
            <div className="text-2xl font-bold text-emerald-800">{completed}</div>
            <div className="text-[10px] text-slate-500">Handed Over to ULBs</div>
          </div>
          <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
            <span className="text-slate-500">Share of Total</span>
            <span className="font-bold text-emerald-700 font-mono">
              {totalProjects > 0 ? ((completed / totalProjects) * 100).toFixed(0) : 0}%
            </span>
          </div>
        </div>
      </div>

      {/* Row 2: Financial Envelope & Outlay Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Approved Outlay */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Total Approved Outlay</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-800">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
              ₹ {(Number(totalApprovedCost) || 0).toFixed(1)} <span className="text-sm font-semibold text-slate-500 font-sans">Cr</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">SJMMSVY, AMRUT 2.0 &amp; World Bank</div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Committed:</span>
            <span className="font-semibold text-slate-800 font-mono">₹ {(Number(totalCommitted) || 0).toFixed(1)} Cr</span>
          </div>
        </div>

        {/* Total Expenditure */}
        <div className="bg-white p-4 rounded-lg border border-emerald-200/80 bg-gradient-to-b from-white to-emerald-50/20 shadow-2xs flex flex-col justify-between hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">Total Expenditure</span>
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-2xl lg:text-3xl font-extrabold text-emerald-900 tracking-tight">
              ₹ {(Number(totalExpenditure) || 0).toFixed(1)} <span className="text-sm font-semibold text-emerald-700 font-sans">Cr</span>
            </div>
            <div className="text-[11px] text-emerald-700/90 mt-0.5">Verified via Treasury &amp; RA Bills</div>
          </div>
          <div className="pt-2 border-t border-emerald-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Disbursed Share:</span>
            <span className="font-bold text-emerald-800 font-mono">
              {(Number(budgetUtilisation) || 0).toFixed(1)}% of Outlay
            </span>
          </div>
        </div>

        {/* Budget Utilisation */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Budget Utilisation</span>
            <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-blue-50 text-blue-800 border border-blue-200">
              {(Number(budgetUtilisation) || 0).toFixed(1)}%
            </span>
          </div>
          <div className="my-2">
            <div className="text-2xl lg:text-3xl font-extrabold text-blue-900 tracking-tight">
              {(Number(budgetUtilisation) || 0).toFixed(1)}%
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full mt-2 overflow-hidden border border-slate-200/60">
              <div
                className="bg-blue-700 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, Number(budgetUtilisation) || 0))}%` }}
              />
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Remaining Balance:</span>
            <span className="font-semibold text-slate-800 font-mono">
              ₹ {Math.max(0, totalApprovedCost - totalExpenditure).toFixed(1)} Cr
            </span>
          </div>
        </div>

        {/* Projects At Risk / Delayed */}
        <div className="bg-white p-4 rounded-lg border border-rose-200/90 bg-rose-50/20 shadow-2xs flex flex-col justify-between hover:border-rose-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-800">Projects At Risk</span>
            <div className="p-2 rounded-lg bg-rose-100 text-rose-700">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-2xl lg:text-3xl font-extrabold text-rose-700 tracking-tight flex items-baseline gap-2">
              <span>{delayed}</span>
              <span className="text-sm font-semibold text-slate-600">Delayed</span>
              <span className="text-slate-300 font-normal">|</span>
              <span>{criticalAndHighRisks.length}</span>
              <span className="text-sm font-semibold text-slate-600">Critical</span>
            </div>
            <div className="text-[11px] text-rose-700 font-medium mt-0.5">Slippage &amp; clearance issues flagged</div>
          </div>
          <div className="pt-2 border-t border-rose-100 flex items-center justify-between text-[11px]">
            <span className="text-rose-700 font-medium">Status:</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
              Action Required
            </span>
          </div>
        </div>
      </div>

      {/* Row 3: Sector-wise Allocation vs Expenditure */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Sector-wise Financial Allocation vs Expenditure
            </h3>
            <p className="text-[11px] text-slate-500">Overview of key urban infrastructure sectors in ₹ Crores</p>
          </div>
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 bg-blue-800 rounded-xs" />
              <span className="text-slate-600 text-[11px]">Approved Outlay</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 bg-emerald-600 rounded-xs" />
              <span className="text-slate-600 text-[11px]">Expenditure Released</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-3 pt-3">
          {categories.map(cat => {
            const data = categorySummary[cat];
            const approvedVal = Number(data?.approved) || 0;
            const spentVal = Number(data?.spent) || 0;
            const utilPct = approvedVal > 0 ? (spentVal / approvedVal) * 100 : 0;

            return (
              <div key={cat} className="p-3 bg-slate-50 rounded border border-slate-200 space-y-2 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-semibold text-slate-900 text-xs truncate" title={cat}>{cat}</span>
                  <span className="text-[11px] font-bold text-blue-900 whitespace-nowrap">{utilPct.toFixed(1)}% spent</span>
                </div>
                <div className="flex items-center justify-between text-[11px] gap-1">
                  <span className="text-slate-600 truncate">
                    Exp: <span className="font-bold text-emerald-800 font-mono">₹{spentVal.toFixed(1)} Cr</span>
                  </span>
                  <span className="text-slate-500 truncate">
                    Outlay: <span className="font-bold text-slate-800 font-mono">₹{approvedVal.toFixed(1)} Cr</span>
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all duration-300"
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
        <div className="bg-white rounded-lg border border-slate-200 shadow-2xs lg:col-span-2 overflow-hidden flex flex-col">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Delayed Schemes Requiring Corrective Action ({delayedProjects.length})
              </h3>
            </div>
            <button
              onClick={() => setCurrentNav('Progress Monitoring')}
              className="text-xs font-semibold text-blue-700 hover:underline flex items-center"
            >
              Progress Tracker <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100 text-slate-600 text-[11px] font-semibold uppercase border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Project ID & Title</th>
                  <th className="py-2.5 px-3">District</th>
                  <th className="py-2.5 px-3 text-center whitespace-nowrap">No. of Days Delay</th>
                  <th className="py-2.5 px-3">Progress</th>
                  <th className="py-2.5 px-3">Root Cause</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {delayedProjects.slice(0, 5).map(prj => (
                  <tr key={prj.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2 px-3">
                      <span className="font-mono text-[10px] text-blue-800 font-bold block">{prj.id}</span>
                      <span className="font-semibold text-slate-900 line-clamp-1">{prj.name}</span>
                    </td>
                    <td className="py-2 px-3 font-medium text-slate-600">{prj.district}</td>
                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border shadow-2xs ${
                          prj.delayDays >= 60
                            ? 'bg-rose-50 text-rose-800 border-rose-200'
                            : prj.delayDays >= 30
                            ? 'bg-amber-50 text-amber-900 border-amber-200'
                            : 'bg-orange-50 text-orange-800 border-orange-200'
                        }`}
                      >
                        <Clock
                          className={`w-3.5 h-3.5 shrink-0 ${
                            prj.delayDays >= 60 ? 'text-rose-600' : 'text-amber-600'
                          }`}
                        />
                        <span className="font-mono font-bold tracking-tight">+{prj.delayDays}</span>
                        <span className="text-[11px] font-medium opacity-90">Days</span>
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <div className="flex items-center space-x-1.5">
                        <div className="w-14 bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-amber-600 h-full rounded-full"
                            style={{ width: `${prj.physicalProgress}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-slate-700">{prj.physicalProgress}%</span>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-[11px] text-slate-600 line-clamp-1 max-w-xs">
                      {prj.delayReason || 'Clearances in progress'}
                    </td>
                    <td className="py-2 px-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedProjectId(prj.id);
                        }}
                        className="p-1 text-blue-700 hover:text-blue-900 hover:bg-blue-50 rounded"
                        title="View Project Master Record"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Actions & Approvals Inbox Preview */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-2xs flex flex-col">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Pending Approvals ({pendingApprovals.length})
            </h3>
            <button
              onClick={() => setCurrentNav('Approvals')}
              className="text-xs font-semibold text-blue-700 hover:underline"
            >
              Open Inbox
            </button>
          </div>

          <div className="p-3 divide-y divide-slate-100 flex-1 overflow-y-auto max-h-80">
            {pendingApprovals.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-1.5" />
                No pending workflow items requiring your action.
              </div>
            ) : (
              pendingApprovals.slice(0, 4).map(app => (
                <div key={app.id} className="py-2.5 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-slate-500">{app.id}</span>
                    <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold">
                      Due: {app.dueDate}
                    </span>
                  </div>
                  <p className="font-semibold text-slate-900 text-xs leading-snug">{app.approvalType}</p>
                  <p className="text-[11px] text-slate-600 line-clamp-1">{app.projectName}</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-500">From: {app.submittedBy}</span>
                    {app.amount ? (
                      <span className="text-[10px] font-bold text-slate-800">₹{app.amount} Cr</span>
                    ) : null}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-center">
            <button
              onClick={() => setCurrentNav('Approvals')}
              className="w-full py-1 text-xs font-semibold text-blue-800 hover:bg-blue-100/50 rounded transition-colors"
            >
              Review All Action Items &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
