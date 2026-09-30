import React, { useState } from 'react';
import {
  FilePlus2,
  Briefcase,
  IndianRupee,
  FileText,
  FileCheck2,
  Gavel,
  ArrowLeft,
  Trash2
} from 'lucide-react';
import { ComaUlbCategory } from './ComaPortalFlow';
import {
  ProposalProjectSummary,
  PROPOSAL_LIFECYCLE_STAGES
} from './ProposalLifecycleFlowView';
import { StageSoftCopyModal } from './StageSoftCopyModal';

export type ActiveMinimalView =
  | 'menu'
  | 'ongoing_works'
  | 'grants_uc'
  | 'submitted_proposals'
  | 'dpr'
  | 'tenders_work_orders';

interface UlbRoutineOperationsPanelProps {
  ulbName: string;
  ulbType: ComaUlbCategory | '';
  district: string;
  submittedProposals: ProposalProjectSummary[];
  proposalStageMap: Record<string, number>;
  activeView: ActiveMinimalView;
  onChangeActiveView: (view: ActiveMinimalView) => void;
  onOpenRegisterProposal: () => void;
  onSelectProposal: (proposalId: string) => void;
  onDeleteProposal: (proposalId: string) => void;
}

export const UlbRoutineOperationsPanel: React.FC<UlbRoutineOperationsPanelProps> = ({
  ulbName,
  ulbType,
  district,
  submittedProposals,
  proposalStageMap,
  activeView,
  onChangeActiveView,
  onOpenRegisterProposal,
  onSelectProposal,
  onDeleteProposal
}) => {
  const isCorp = ulbType === 'Municipal Corporation';

  const [works] = useState([
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

  const [selectedDprProject, setSelectedDprProject] = useState<ProposalProjectSummary | null>(
    null
  );
  const [selectedTenderProject, setSelectedTenderProject] =
    useState<ProposalProjectSummary | null>(null);

  const defaultDprs: ProposalProjectSummary[] = [
    {
      id: 'DPR-2026-01',
      name: '24x7 Water Supply & Feeder Main Augmentation',
      ulb: ulbName,
      category: 'Water Supply & Sewerage',
      estimatedCost: isCorp ? 42.5 : 8.4
    },
    {
      id: 'DPR-2026-02',
      name: 'Stormwater Trunk Drain & Pumping Station',
      ulb: ulbName,
      category: 'Stormwater Drainage',
      estimatedCost: isCorp ? 28.0 : 5.6
    },
    {
      id: 'DPR-2026-03',
      name: 'Smart CCMS Streetlight & Urban Road Upgradation',
      ulb: ulbName,
      category: 'Urban Roads & Bridges',
      estimatedCost: isCorp ? 19.2 : 4.1
    }
  ];

  const allDprs: ProposalProjectSummary[] = [...submittedProposals, ...defaultDprs];

  if (activeView === 'dpr') {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
          <div>
            <p className="text-xs font-semibold text-[#0E355C]">{ulbName}</p>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5">
              Detailed Project Reports (DPRs) ({allDprs.length})
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onChangeActiveView('menu')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#0E355C] cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {allDprs.map(dpr => (
            <div
              key={dpr.id}
              onClick={() => setSelectedDprProject(dpr)}
              className="py-3.5 px-2 -mx-2 rounded-lg flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors cursor-pointer text-xs"
            >
              <div className="min-w-0">
                <div className="font-semibold text-slate-900 truncate">{dpr.name}</div>
                <div className="text-slate-500 mt-0.5 flex flex-wrap items-center gap-1.5">
                  <span className="font-mono font-semibold text-[#0E355C]">{dpr.id}</span>
                  <span aria-hidden="true">·</span>
                  <span>{dpr.category}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-mono font-semibold text-slate-900">
                  ₹ {(Number(dpr.estimatedCost) || 0).toFixed(2)} Cr
                </div>
                <div className="text-[11px] font-medium text-[#0E355C]">
                  View DPR Soft Copy &rarr;
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedDprProject && (
          <StageSoftCopyModal
            stage={PROPOSAL_LIFECYCLE_STAGES[3]} // Stage 04: DPR Preparation
            project={selectedDprProject}
            isCompleted={true}
            isCurrent={false}
            onClose={() => setSelectedDprProject(null)}
            onMarkComplete={() => setSelectedDprProject(null)}
          />
        )}
      </div>
    );
  }

  if (activeView === 'tenders_work_orders') {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
          <div>
            <p className="text-xs font-semibold text-[#0E355C]">{ulbName}</p>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5">
              Tenders &amp; Work Orders ({allDprs.length})
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onChangeActiveView('menu')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#0E355C] cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {allDprs.map(item => (
            <div
              key={item.id}
              onClick={() => setSelectedTenderProject(item)}
              className="py-3.5 px-2 -mx-2 rounded-lg flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors cursor-pointer text-xs"
            >
              <div className="min-w-0">
                <div className="font-semibold text-slate-900 truncate">{item.name}</div>
                <div className="text-slate-500 mt-0.5 flex flex-wrap items-center gap-1.5">
                  <span className="font-mono font-semibold text-[#0E355C]">
                    NIT/{item.id}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{item.category}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-mono font-semibold text-slate-900">
                  ₹ {(Number(item.estimatedCost) || 0).toFixed(2)} Cr
                </div>
                <div className="text-[11px] font-medium text-[#0E355C]">
                  View Tender &amp; Work Order &rarr;
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedTenderProject && (
          <StageSoftCopyModal
            stage={PROPOSAL_LIFECYCLE_STAGES[10]} // Stage 11: Tender Document Preparation
            project={selectedTenderProject}
            isCompleted={true}
            isCurrent={false}
            onClose={() => setSelectedTenderProject(null)}
            onMarkComplete={() => setSelectedTenderProject(null)}
          />
        )}
      </div>
    );
  }

  if (activeView === 'ongoing_works') {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
          <div>
            <p className="text-xs font-semibold text-[#0E355C]">{ulbName}</p>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5">Ongoing Works</h3>
          </div>
          <button
            type="button"
            onClick={() => onChangeActiveView('menu')}
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
            onClick={() => onChangeActiveView('menu')}
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

  if (activeView === 'submitted_proposals') {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
          <div>
            <p className="text-xs font-semibold text-[#0E355C]">{ulbName}</p>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5">
              Submitted Proposals ({submittedProposals.length})
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onChangeActiveView('menu')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#0E355C] cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
        </div>

        {submittedProposals.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-xs text-slate-500 mb-4">
              No proposals have been registered for {ulbName} yet.
            </p>
            <button
              type="button"
              onClick={onOpenRegisterProposal}
              className="h-9 px-4 rounded-lg bg-[#0E355C] text-white text-xs font-semibold hover:bg-[#092644] transition-colors cursor-pointer"
            >
              Register a Proposal
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {submittedProposals.map(proj => {
              const stepIdx = proposalStageMap[proj.id] ?? 1;
              const stageLabel =
                stepIdx >= PROPOSAL_LIFECYCLE_STAGES.length
                  ? 'Project Handover Completed'
                  : PROPOSAL_LIFECYCLE_STAGES[stepIdx]?.title || 'Preliminary Survey';
              return (
                <div
                  key={proj.id}
                  onClick={() => onSelectProposal(proj.id)}
                  className="py-3.5 px-2 -mx-2 rounded-lg flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors cursor-pointer text-xs"
                >
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-900 truncate">{proj.name}</div>
                    <div className="text-slate-500 mt-0.5 flex flex-wrap items-center gap-1.5">
                      <span className="font-mono font-semibold text-[#0E355C]">{proj.id}</span>
                      <span aria-hidden="true">·</span>
                      <span>{proj.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="font-mono font-semibold text-slate-900">
                        ₹ {(Number(proj.estimatedCost) || 0).toFixed(1)} Cr
                      </div>
                      <div className="text-[11px] font-medium text-[#0E355C]">
                        {stageLabel} &rarr;
                      </div>
                    </div>
                    <button
                      type="button"
                      title="Delete submitted proposal"
                      onClick={e => {
                        e.stopPropagation();
                        onDeleteProposal(proj.id);
                      }}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Minimal 2x2 Action Grid
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
      <div className="text-center mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-[#0E355C]">
          {ulbName} · {district}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Card 1: Register a Proposal */}
        <button
          type="button"
          onClick={onOpenRegisterProposal}
          className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-[#0E355C] transition-all text-left flex items-start gap-3.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-lg bg-slate-200/80 text-[#0E355C] group-hover:bg-[#0E355C] group-hover:text-white transition-colors flex items-center justify-center shrink-0">
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
          onClick={() => onChangeActiveView('ongoing_works')}
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
          onClick={() => onChangeActiveView('grants_uc')}
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

        {/* Card 4: Submitted Proposals */}
        <button
          type="button"
          onClick={() => onChangeActiveView('submitted_proposals')}
          className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-[#0E355C] transition-all text-left flex items-start gap-3.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-lg bg-slate-200/80 text-[#0E355C] group-hover:bg-[#0E355C] group-hover:text-white transition-colors flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#0E355C]">
              Submitted Proposals{submittedProposals.length > 0 ? ` (${submittedProposals.length})` : ''}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              View already registered proposals and their lifecycle flow
            </p>
          </div>
        </button>

        {/* Card 5: DPR */}
        <button
          type="button"
          onClick={() => onChangeActiveView('dpr')}
          className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-[#0E355C] transition-all text-left flex items-start gap-3.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-lg bg-slate-200/80 text-[#0E355C] group-hover:bg-[#0E355C] group-hover:text-white transition-colors flex items-center justify-center shrink-0">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#0E355C]">
              DPR ({allDprs.length})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              View all Detailed Project Reports (DPRs) and open their soft copies
            </p>
          </div>
        </button>

        {/* Card 6: Tenders & Work Orders */}
        <button
          type="button"
          onClick={() => onChangeActiveView('tenders_work_orders')}
          className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-[#0E355C] transition-all text-left flex items-start gap-3.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-lg bg-slate-200/80 text-[#0E355C] group-hover:bg-[#0E355C] group-hover:text-white transition-colors flex items-center justify-center shrink-0">
            <Gavel className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#0E355C]">
              Tenders &amp; Work Orders ({allDprs.length})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              View published e-Tenders, DTPs, and issued Work Orders
            </p>
          </div>
        </button>
      </div>
    </div>
  );
};
