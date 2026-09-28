import React, { useState } from 'react';
import {
  FilePlus2,
  Briefcase,
  IndianRupee,
  FileCheck2,
  ArrowLeft,
  CheckCircle2,
  Plus
} from 'lucide-react';
import { ComaUlbCategory } from './ComaPortalFlow';

interface UlbRoutineOperationsPanelProps {
  ulbName: string;
  ulbType: ComaUlbCategory | '';
  district: string;
  registeredProposalsCount: number;
  onOpenRegisterProposal: () => void;
}

type ActiveMinimalView = 'menu' | 'ongoing_works' | 'grants_uc' | 'resolutions';

export const UlbRoutineOperationsPanel: React.FC<UlbRoutineOperationsPanelProps> = ({
  ulbName,
  ulbType,
  district,
  onOpenRegisterProposal
}) => {
  const isCorp = ulbType === 'Municipal Corporation';
  const [activeView, setActiveView] = useState<ActiveMinimalView>('menu');

  const [works, setWorks] = useState([
    {
      id: 'WRK-01',
      title: 'Water Supply Distribution Network & Valve Upgrade',
      stage: 'Execution (75%)',
      cost: isCorp ? '18.5 Cr' : '4.2 Cr'
    },
    {
      id: 'WRK-02',
      title: 'Stormwater Drainage & Main Outfall Desilting',
      stage: 'Execution (90%)',
      cost: isCorp ? '12.0 Cr' : '2.8 Cr'
    },
    {
      id: 'WRK-03',
      title: 'Municipal Road Resurfacing & Junction Improvement',
      stage: 'Tendering',
      cost: isCorp ? '24.0 Cr' : '5.5 Cr'
    }
  ]);

  const [grants, setGrants] = useState([
    {
      id: 'GR-01',
      name: 'SJMMSVY Infrastructure Grant (FY 2026-27)',
      amount: isCorp ? '₹ 85.0 Cr' : '₹ 18.5 Cr',
      status: 'UC Submitted'
    },
    {
      id: 'GR-02',
      name: '15th Finance Commission Tied Grant',
      amount: isCorp ? '₹ 42.0 Cr' : '₹ 9.4 Cr',
      status: 'UC Pending'
    },
    {
      id: 'GR-03',
      name: 'AMRUT 2.0 Water & Sewerage Tranche',
      amount: isCorp ? '₹ 64.0 Cr' : '₹ 12.0 Cr',
      status: 'Verified'
    }
  ]);

  const [resolutions, setResolutions] = useState([
    {
      no: 'SC/2026/084',
      title: 'Standing Committee Sanction for Water Supply Augmentation',
      date: '18 Sep 2026'
    },
    {
      no: 'GB/2026/041',
      title: 'General Board Approval for Annual Civil & O&M Rate Contract',
      date: '05 Sep 2026'
    }
  ]);

  const [newResNo, setNewResNo] = useState('');
  const [newResTitle, setNewResTitle] = useState('');

  const handleAddResolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResNo.trim() || !newResTitle.trim()) return;
    setResolutions([
      { no: newResNo.trim(), title: newResTitle.trim(), date: 'Today' },
      ...resolutions
    ]);
    setNewResNo('');
    setNewResTitle('');
  };

  if (activeView === 'ongoing_works') {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
          <div>
            <p className="text-xs font-semibold text-[#0E355C]">{ulbName}</p>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5">Ongoing Municipal Works</h3>
          </div>
          <button
            type="button"
            onClick={() => setActiveView('menu')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#0E355C] cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {works.map(w => (
            <div key={w.id} className="py-3.5 flex items-center justify-between gap-4 text-xs">
              <div>
                <div className="font-semibold text-slate-900">{w.title}</div>
                <div className="text-slate-500 mt-0.5">
                  <span className="font-mono text-[#0E355C] font-medium">{w.id}</span> · ₹ {w.cost}
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium shrink-0">
                {w.stage}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeView === 'grants_uc') {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
          <div>
            <p className="text-xs font-semibold text-[#0E355C]">{ulbName}</p>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5">Grant &amp; UC Status</h3>
          </div>
          <button
            type="button"
            onClick={() => setActiveView('menu')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#0E355C] cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {grants.map(g => (
            <div key={g.id} className="py-3.5 flex items-center justify-between gap-4 text-xs">
              <div>
                <div className="font-semibold text-slate-900">{g.name}</div>
                <div className="text-slate-500 mt-0.5">Allocation: {g.amount}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`px-2.5 py-1 rounded-md font-medium ${
                    g.status === 'UC Pending'
                      ? 'bg-amber-50 text-amber-800'
                      : 'bg-emerald-50 text-emerald-800'
                  }`}
                >
                  {g.status}
                </span>
                {g.status === 'UC Pending' && (
                  <button
                    type="button"
                    onClick={() =>
                      setGrants(prev =>
                        prev.map(item =>
                          item.id === g.id ? { ...item, status: 'UC Submitted' } : item
                        )
                      )
                    }
                    className="px-3 py-1 rounded-md bg-[#0E355C] text-white font-semibold hover:bg-[#092644] cursor-pointer"
                  >
                    Submit UC
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeView === 'resolutions') {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
          <div>
            <p className="text-xs font-semibold text-[#0E355C]">{ulbName}</p>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5">
              Standing Committee Resolutions
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setActiveView('menu')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#0E355C] cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
        </div>

        <form onSubmit={handleAddResolution} className="flex flex-col sm:flex-row gap-2.5 mb-5 text-xs">
          <input
            type="text"
            required
            placeholder="Resolution No. (e.g. SC/2026/090)"
            value={newResNo}
            onChange={e => setNewResNo(e.target.value)}
            className="sm:w-48 h-9 px-3 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0E355C]"
          />
          <input
            type="text"
            required
            placeholder="Resolution subject..."
            value={newResTitle}
            onChange={e => setNewResTitle(e.target.value)}
            className="flex-1 h-9 px-3 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0E355C]"
          />
          <button
            type="submit"
            className="h-9 px-4 rounded-lg bg-[#0E355C] text-white font-semibold hover:bg-[#092644] shrink-0 cursor-pointer"
          >
            Add
          </button>
        </form>

        <div className="divide-y divide-slate-100">
          {resolutions.map(r => (
            <div key={r.no} className="py-3.5 flex items-center justify-between gap-4 text-xs">
              <div>
                <div className="font-semibold text-slate-900">{r.title}</div>
                <div className="font-mono text-slate-500 mt-0.5">{r.no}</div>
              </div>
              <span className="text-slate-500 shrink-0">{r.date}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Minimal 2x2 Action Grid
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
      <div className="text-center mb-6">
        <p className="text-xs font-semibold text-[#0E355C]">
          {ulbName} · {district}
        </p>
        <h2 className="text-xl font-bold text-slate-900 mt-1">
          Select Municipal Action
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Card 1: Register a Proposal */}
        <button
          type="button"
          onClick={onOpenRegisterProposal}
          className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-[#0E355C] transition-all text-left flex items-start gap-3.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-lg bg-[#0E355C] text-white flex items-center justify-center shrink-0">
            <FilePlus2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#0E355C]">Register a Proposal</h3>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              Submit a new infrastructure scheme proposal for sanction
            </p>
          </div>
        </button>

        {/* Card 2: Ongoing Works */}
        <button
          type="button"
          onClick={() => setActiveView('ongoing_works')}
          className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-[#0E355C] transition-all text-left flex items-start gap-3.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-lg bg-slate-200/80 text-[#0E355C] group-hover:bg-[#0E355C] group-hover:text-white transition-colors flex items-center justify-center shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#0E355C]">Ongoing Works</h3>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              Track physical progress of active municipal works
            </p>
          </div>
        </button>

        {/* Card 3: Grant & UC Status */}
        <button
          type="button"
          onClick={() => setActiveView('grants_uc')}
          className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-[#0E355C] transition-all text-left flex items-start gap-3.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-lg bg-slate-200/80 text-[#0E355C] group-hover:bg-[#0E355C] group-hover:text-white transition-colors flex items-center justify-center shrink-0">
            <IndianRupee className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#0E355C]">Grant &amp; UC Status</h3>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              View scheme grant allocations and submit UCs
            </p>
          </div>
        </button>

        {/* Card 4: Standing Committee Resolutions */}
        <button
          type="button"
          onClick={() => setActiveView('resolutions')}
          className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-[#0E355C] transition-all text-left flex items-start gap-3.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-lg bg-slate-200/80 text-[#0E355C] group-hover:bg-[#0E355C] group-hover:text-white transition-colors flex items-center justify-center shrink-0">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#0E355C]">Committee Resolutions</h3>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              Record Standing Committee &amp; General Board approvals
            </p>
          </div>
        </button>
      </div>
    </div>
  );
};
