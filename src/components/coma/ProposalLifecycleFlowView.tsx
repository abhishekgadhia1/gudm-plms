import React from 'react';
import {
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  Check
} from 'lucide-react';

export interface ProposalProjectSummary {
  id: string;
  name: string;
  ulb: string;
  category: string;
  estimatedCost: number;
}

export interface ProposalFlowStage {
  stepNumber: number;
  title: string;
  phase:
    | 'Survey & DPR'
    | 'Scrutiny & Approvals'
    | 'Tendering & Award'
    | 'Execution & Billing'
    | 'Closure & Handover';
  authority: string;
}

export const PROPOSAL_LIFECYCLE_STAGES: ProposalFlowStage[] = [
  {
    stepNumber: 1,
    title: 'Proposal Submission',
    phase: 'Survey & DPR',
    authority: 'ULB Nodal Officer / Municipal Engineer'
  },
  {
    stepNumber: 2,
    title: 'Preliminary Survey',
    phase: 'Survey & DPR',
    authority: 'ULB Field Engineering Team'
  },
  {
    stepNumber: 3,
    title: 'Feasibility Study',
    phase: 'Survey & DPR',
    authority: 'Technical Consultant / Municipal Engineer'
  },
  {
    stepNumber: 4,
    title: 'DPR Preparation',
    phase: 'Survey & DPR',
    authority: 'Empanelled Consultant / Project Cell'
  },
  {
    stepNumber: 5,
    title: 'DPR Verification',
    phase: 'Survey & DPR',
    authority: 'Executive Engineer (ULB)'
  },
  {
    stepNumber: 6,
    title: 'Technical Scrutiny',
    phase: 'Scrutiny & Approvals',
    authority: 'Superintending Engineer / Technical Cell'
  },
  {
    stepNumber: 7,
    title: 'Cost Estimation',
    phase: 'Scrutiny & Approvals',
    authority: 'SOR & Estimation Wing'
  },
  {
    stepNumber: 8,
    title: 'Commissioner Approval',
    phase: 'Scrutiny & Approvals',
    authority: 'Municipal Commissioner / Chief Officer'
  },
  {
    stepNumber: 9,
    title: 'Standing Committee Approval',
    phase: 'Scrutiny & Approvals',
    authority: 'Standing Committee / General Board'
  },
  {
    stepNumber: 10,
    title: 'Technical Sanction',
    phase: 'Scrutiny & Approvals',
    authority: 'Chief Engineer / CoMA Technical Authority'
  },
  {
    stepNumber: 11,
    title: 'Tender Document Preparation',
    phase: 'Tendering & Award',
    authority: 'Procurement & Tender Cell'
  },
  {
    stepNumber: 12,
    title: 'e-Procurement Publication',
    phase: 'Tendering & Award',
    authority: 'nProcure / e-Tender Portal Officer'
  },
  {
    stepNumber: 13,
    title: 'Technical Evaluation',
    phase: 'Tendering & Award',
    authority: 'Tender Evaluation Committee (TEC)'
  },
  {
    stepNumber: 14,
    title: 'Financial Evaluation',
    phase: 'Tendering & Award',
    authority: 'Finance & Accounts / TEC'
  },
  {
    stepNumber: 15,
    title: 'LOI Issuance',
    phase: 'Tendering & Award',
    authority: 'Municipal Commissioner / Chief Officer'
  },
  {
    stepNumber: 16,
    title: 'Performance Bank Guarantee Submission',
    phase: 'Tendering & Award',
    authority: 'Selected Contractor / Accounts Verification'
  },
  {
    stepNumber: 17,
    title: 'Agreement Signing',
    phase: 'Tendering & Award',
    authority: 'ULB Authority & Contractor'
  },
  {
    stepNumber: 18,
    title: 'Site Handover',
    phase: 'Execution & Billing',
    authority: 'Site Engineer & Ward Officer'
  },
  {
    stepNumber: 19,
    title: 'Design Approval',
    phase: 'Execution & Billing',
    authority: 'PMC / Proof Consultant & Executive Engineer'
  },
  {
    stepNumber: 20,
    title: 'Construction Execution',
    phase: 'Execution & Billing',
    authority: 'EPC Contractor & Field Engineering Team'
  },
  {
    stepNumber: 21,
    title: 'RFI Submission',
    phase: 'Execution & Billing',
    authority: 'Contractor Quality Engineer'
  },
  {
    stepNumber: 22,
    title: 'Site Inspection',
    phase: 'Execution & Billing',
    authority: 'PMC Engineer & ULB Site Engineer'
  },
  {
    stepNumber: 23,
    title: 'Contractor RA Bill Submission',
    phase: 'Execution & Billing',
    authority: 'Contractor Billing Section'
  },
  {
    stepNumber: 24,
    title: 'Site Verification Check',
    phase: 'Execution & Billing',
    authority: 'Deputy Executive Engineer (Measurement Book)'
  },
  {
    stepNumber: 25,
    title: 'PMC Bill Verification & Payment Request',
    phase: 'Execution & Billing',
    authority: 'Project Management Consultant (PMC)'
  },
  {
    stepNumber: 26,
    title: 'Contractor Payment',
    phase: 'Execution & Billing',
    authority: 'Chief Accountant / Municipal Treasury'
  },
  {
    stepNumber: 27,
    title: 'Final Site Inspection',
    phase: 'Closure & Handover',
    authority: 'Joint Inspection Team (ULB, PMC & TPI)'
  },
  {
    stepNumber: 28,
    title: 'Project Completion Certificate',
    phase: 'Closure & Handover',
    authority: 'Chief Engineer / Municipal Commissioner'
  },
  {
    stepNumber: 29,
    title: 'Project Handover',
    phase: 'Closure & Handover',
    authority: 'O&M Wing / Municipal Asset Cell'
  }
];

interface ProposalLifecycleFlowViewProps {
  project: ProposalProjectSummary;
  currentStepIndex: number; // 0-indexed (0 = Stage 1 completed, Stage 2 active)
  onAdvanceStage: (nextStepIndex: number) => void;
  onBack: () => void;
  onOpenFullDashboard: () => void;
}

export const ProposalLifecycleFlowView: React.FC<ProposalLifecycleFlowViewProps> = ({
  project,
  currentStepIndex,
  onAdvanceStage,
  onBack,
  onOpenFullDashboard
}) => {
  const totalSteps = PROPOSAL_LIFECYCLE_STAGES.length;
  const activeStage = PROPOSAL_LIFECYCLE_STAGES[Math.min(currentStepIndex, totalSteps - 1)];
  const isAllCompleted = currentStepIndex >= totalSteps;

  return (
    <div className="space-y-5">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#0E355C] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to {project.ulb} Portal</span>
        </button>

        <button
          type="button"
          onClick={onOpenFullDashboard}
          className="text-xs font-semibold text-[#0E355C] hover:underline cursor-pointer"
        >
          Open in Main Dashboard &rarr;
        </button>
      </div>

      {/* Proposal Header & Current Stage Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-mono font-bold text-[#0E355C] bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                {project.id}
              </span>
              <span className="text-slate-500">{project.ulb}</span>
              <span className="text-slate-300">·</span>
              <span className="text-slate-600 font-medium">{project.category}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1.5">
              {project.name}
            </h2>
          </div>

          <div className="sm:text-right shrink-0">
            <div className="text-xs text-slate-500">Estimated Cost</div>
            <div className="text-base font-bold text-slate-900">
              ₹ {(Number(project.estimatedCost) || 0).toFixed(2)} Cr
            </div>
          </div>
        </div>

        {/* Active Stage Action Strip */}
        <div className="pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
              {isAllCompleted
                ? 'Lifecycle Completed (29 / 29 Stages)'
                : `Current Stage · Step ${activeStage.stepNumber} of ${totalSteps}`}
            </div>
            <div className="text-base font-bold text-[#0E355C] mt-0.5">
              {isAllCompleted ? 'Project Handover Completed' : activeStage.title}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Authority: {activeStage.authority}
            </div>
          </div>

          {!isAllCompleted && (
            <button
              type="button"
              onClick={() => onAdvanceStage(currentStepIndex + 1)}
              className="h-10 px-5 rounded-xl bg-[#0E355C] text-white hover:bg-[#092644] text-xs font-semibold transition-colors flex items-center gap-2 shrink-0 cursor-pointer shadow-2xs"
            >
              <span>Complete &amp; Move to Next Stage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Complete 29-Stage End-to-End Flow */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Post-Proposal Project Lifecycle Flow (29 Stages)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              End-to-end municipal workflow from Proposal Submission to Project Handover
            </p>
          </div>
          <span className="text-xs font-semibold text-[#0E355C] bg-slate-100 px-3 py-1 rounded-full">
            {Math.min(currentStepIndex, totalSteps)} / {totalSteps} Completed
          </span>
        </div>

        <div className="relative pl-4 sm:pl-6 border-l-2 border-slate-200 space-y-3">
          {PROPOSAL_LIFECYCLE_STAGES.map((stage, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex && !isAllCompleted;

            return (
              <div
                key={stage.stepNumber}
                onClick={() => onAdvanceStage(idx)}
                title="Click to set current stage"
                className={`relative p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                  isCurrent
                    ? 'border-[#0E355C] bg-blue-50/50 shadow-2xs'
                    : isCompleted
                    ? 'border-emerald-200 bg-emerald-50/30'
                    : 'border-slate-200/80 bg-white hover:border-slate-300'
                }`}
              >
                {/* Timeline Node Dot */}
                <div
                  className={`absolute -left-[25px] sm:-left-[33px] w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${
                    isCompleted
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-[#0E355C] border-[#0E355C] text-white ring-4 ring-blue-100'
                      : 'bg-white border-slate-300 text-slate-500'
                  }`}
                >
                  {isCompleted ? <Check className="w-3 h-3" /> : stage.stepNumber}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-mono font-bold text-slate-400">
                      #{String(stage.stepNumber).padStart(2, '0')}
                    </span>
                    <span
                      className={`text-xs sm:text-sm font-bold ${
                        isCurrent
                          ? 'text-[#0E355C]'
                          : isCompleted
                          ? 'text-emerald-950'
                          : 'text-slate-700'
                      }`}
                    >
                      {stage.title}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {stage.authority} · <span className="text-slate-400">{stage.phase}</span>
                  </div>
                </div>

                <div className="shrink-0">
                  {isCompleted ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold">
                      <CheckCircle2 className="w-3 h-3" />
                      Done
                    </span>
                  ) : isCurrent ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#0E355C] text-white text-[11px] font-semibold">
                      <Clock className="w-3 h-3" />
                      In Progress
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400 font-medium">Pending</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
